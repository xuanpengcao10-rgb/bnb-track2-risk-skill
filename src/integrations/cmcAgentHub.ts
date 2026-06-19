import type { RiskProfile, StrategyInput } from "../core/types.js";
import { runCmcSkill, type CmcSkillResponse } from "./cmcSkill.js";

interface CmcAgentHubPayload {
  source?: string;
  generatedAt?: string;
  asset?: {
    symbol: string;
    name?: string;
    chain?: string;
    eligible?: boolean;
    eligibleForTrack?: boolean;
  };
  data?: {
    symbol?: string;
    name?: string;
    chain?: string;
    eligible?: boolean;
    eligibleForTrack?: boolean;
    platform?: {
      name?: string;
    };
    quote?: {
      USD?: {
        percent_change_24h?: number;
        percent_change_7d?: number;
        volume_change_24h?: number;
      };
    };
  };
  market?: {
    quote?: {
      USD?: {
        percent_change_24h?: number;
        percent_change_7d?: number;
        volume_change_24h?: number;
      };
    };
    priceChange24hPct?: number;
    priceChange7dPct?: number;
    volumeChange24hPct?: number;
    liquidity_usd?: number;
    liquidityUsd?: number;
    volatility_7d_pct?: number;
    volatility7dPct?: number;
    funding_rate_pct?: number;
    fundingRatePct?: number;
    data_age_minutes?: number;
    dataAgeMinutes?: number;
    technical?: {
      rsi_14?: number;
      rsi14?: number;
    };
    rsi14?: number;
  };
  narrative?: {
    news_score?: number;
    newsScore?: number;
    social_score?: number;
    socialScore?: number;
    kol_score?: number;
    kolScore?: number;
    catalyst_score?: number;
    catalystScore?: number;
    evidence?: string[];
  };
  portfolioRisk?: {
    max_drawdown_pct?: number;
    maxDrawdownPct?: number;
    current_drawdown_pct?: number;
    currentDrawdownPct?: number;
    min_liquidity_usd?: number;
    minLiquidityUsd?: number;
    max_volatility_pct?: number;
    maxVolatilityPct?: number;
    max_data_age_minutes?: number;
    maxDataAgeMinutes?: number;
    risk_profile?: string;
    riskProfile?: string;
  };
  risk?: CmcAgentHubPayload["portfolioRisk"];
}

const numberValue = (value: number | undefined, fallback: number) => value ?? fallback;
const scoreValue = (snake: number | undefined, camel: number | undefined) => numberValue(snake ?? camel, 0);
const riskProfileValue = (value: string | undefined): RiskProfile => {
  if (value === "conservative" || value === "aggressive") return value;
  return "balanced";
};

export function normalizeCmcAgentHubPayload(payload: CmcAgentHubPayload): StrategyInput {
  const asset = payload.asset ?? payload.data;
  if (!asset?.symbol) {
    throw new Error("CMC Agent Hub payload requires asset.symbol or data.symbol.");
  }
  const market = payload.market ?? {};
  const quote = market.quote?.USD ?? payload.data?.quote?.USD;
  const narrative = payload.narrative ?? {};
  const risk = payload.portfolioRisk ?? payload.risk ?? {};

  return {
    token: {
      symbol: asset.symbol,
      name: asset.name ?? asset.symbol,
      chain: asset.chain ?? payload.data?.platform?.name ?? "BNB Chain",
      eligible: asset.eligibleForTrack ?? asset.eligible ?? false,
    },
    market: {
      priceChange24hPct: numberValue(market.priceChange24hPct ?? quote?.percent_change_24h, 0),
      priceChange7dPct: numberValue(market.priceChange7dPct ?? quote?.percent_change_7d, 0),
      volumeChange24hPct: numberValue(market.volumeChange24hPct ?? quote?.volume_change_24h, 0),
      liquidityUsd: numberValue(market.liquidityUsd ?? market.liquidity_usd, 0),
      volatility7dPct: numberValue(market.volatility7dPct ?? market.volatility_7d_pct, 0),
      fundingRatePct: numberValue(market.fundingRatePct ?? market.funding_rate_pct, 0),
      rsi14: numberValue(market.rsi14 ?? market.technical?.rsi14 ?? market.technical?.rsi_14, 50),
      dataAgeMinutes: market.dataAgeMinutes ?? market.data_age_minutes,
    },
    narrative: {
      newsScore: scoreValue(narrative.news_score, narrative.newsScore),
      socialScore: scoreValue(narrative.social_score, narrative.socialScore),
      kolScore: scoreValue(narrative.kol_score, narrative.kolScore),
      catalystScore: scoreValue(narrative.catalyst_score, narrative.catalystScore),
      evidence: narrative.evidence ?? [],
    },
    risk: {
      maxDrawdownPct: numberValue(risk.maxDrawdownPct ?? risk.max_drawdown_pct, 12),
      currentDrawdownPct: numberValue(risk.currentDrawdownPct ?? risk.current_drawdown_pct, 0),
      minLiquidityUsd: numberValue(risk.minLiquidityUsd ?? risk.min_liquidity_usd, 5_000_000),
      maxVolatilityPct: numberValue(risk.maxVolatilityPct ?? risk.max_volatility_pct, 18),
      maxDataAgeMinutes: risk.maxDataAgeMinutes ?? risk.max_data_age_minutes,
      riskProfile: riskProfileValue(risk.riskProfile ?? risk.risk_profile),
    },
  };
}

export function runCmcAgentHubSkill(payload: CmcAgentHubPayload): CmcSkillResponse {
  const input = normalizeCmcAgentHubPayload(payload);
  const response = runCmcSkill(input);
  const market = payload.market ?? {};
  const hasSupplementalMarket =
    (market.liquidityUsd ?? market.liquidity_usd) !== undefined &&
    (market.volatility7dPct ?? market.volatility_7d_pct) !== undefined;
  const hasSupplementalRisk = Boolean(payload.portfolioRisk ?? payload.risk);
  const readinessWarnings: string[] = [];
  const warnings = [
    "Live-compatible payloads still require a fresh CMC fetch and user-approved execution before any wallet action.",
  ];
  if (!payload.generatedAt) readinessWarnings.push("Payload generatedAt is missing; rely on the data-freshness gate before execution.");
  if (input.market.dataAgeMinutes === undefined) readinessWarnings.push("Market data age is missing; add dataAgeMinutes for stricter stale-data protection.");
  if (input.narrative.evidence.length === 0) readinessWarnings.push("Narrative evidence is empty; provide cited market or catalyst evidence before sizing.");
  if (!hasSupplementalMarket || !hasSupplementalRisk) {
    readinessWarnings.push("Supplemental liquidity, volatility, and risk limits are missing; defaults force conservative analysis.");
  }
  warnings.push(...readinessWarnings);

  return {
    ...response,
    audit: {
      ...response.audit,
      sourceAdapters: ["cmc-agent-hub-payload", ...response.audit.sourceAdapters],
      dataMode: "live-compatible-payload",
      adapterReady: true,
      liveReady: readinessWarnings.length === 0,
      inputSource: payload.source ?? "cmc-agent-hub-payload",
      inputGeneratedAt: payload.generatedAt,
      warnings,
    },
  };
}

export type { CmcAgentHubPayload };
