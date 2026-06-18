import type { RiskProfile, StrategyInput } from "../core/types.js";
import { runCmcSkill, type CmcSkillResponse } from "./cmcSkill.js";

interface CmcAgentHubPayload {
  source?: string;
  generatedAt?: string;
  asset: {
    symbol: string;
    name?: string;
    chain?: string;
    eligible?: boolean;
    eligibleForTrack?: boolean;
  };
  market: {
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
    technical?: {
      rsi_14?: number;
      rsi14?: number;
    };
    rsi14?: number;
  };
  narrative: {
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
  const quote = payload.market.quote?.USD;
  const risk = payload.portfolioRisk ?? payload.risk ?? {};

  return {
    token: {
      symbol: payload.asset.symbol,
      name: payload.asset.name ?? payload.asset.symbol,
      chain: payload.asset.chain ?? "BNB Chain",
      eligible: payload.asset.eligibleForTrack ?? payload.asset.eligible ?? false,
    },
    market: {
      priceChange24hPct: numberValue(payload.market.priceChange24hPct ?? quote?.percent_change_24h, 0),
      priceChange7dPct: numberValue(payload.market.priceChange7dPct ?? quote?.percent_change_7d, 0),
      volumeChange24hPct: numberValue(payload.market.volumeChange24hPct ?? quote?.volume_change_24h, 0),
      liquidityUsd: numberValue(payload.market.liquidityUsd ?? payload.market.liquidity_usd, 0),
      volatility7dPct: numberValue(payload.market.volatility7dPct ?? payload.market.volatility_7d_pct, 0),
      fundingRatePct: numberValue(payload.market.fundingRatePct ?? payload.market.funding_rate_pct, 0),
      rsi14: numberValue(payload.market.rsi14 ?? payload.market.technical?.rsi14 ?? payload.market.technical?.rsi_14, 50),
    },
    narrative: {
      newsScore: scoreValue(payload.narrative.news_score, payload.narrative.newsScore),
      socialScore: scoreValue(payload.narrative.social_score, payload.narrative.socialScore),
      kolScore: scoreValue(payload.narrative.kol_score, payload.narrative.kolScore),
      catalystScore: scoreValue(payload.narrative.catalyst_score, payload.narrative.catalystScore),
      evidence: payload.narrative.evidence ?? [],
    },
    risk: {
      maxDrawdownPct: numberValue(risk.maxDrawdownPct ?? risk.max_drawdown_pct, 12),
      currentDrawdownPct: numberValue(risk.currentDrawdownPct ?? risk.current_drawdown_pct, 0),
      minLiquidityUsd: numberValue(risk.minLiquidityUsd ?? risk.min_liquidity_usd, 5_000_000),
      maxVolatilityPct: numberValue(risk.maxVolatilityPct ?? risk.max_volatility_pct, 18),
      riskProfile: riskProfileValue(risk.riskProfile ?? risk.risk_profile),
    },
  };
}

export function runCmcAgentHubSkill(payload: CmcAgentHubPayload): CmcSkillResponse {
  const response = runCmcSkill(normalizeCmcAgentHubPayload(payload));

  return {
    ...response,
    audit: {
      ...response.audit,
      sourceAdapters: ["cmc-agent-hub-payload", ...response.audit.sourceAdapters],
    },
  };
}

export type { CmcAgentHubPayload };
