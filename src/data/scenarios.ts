import type { StrategyInput } from "../core/types.js";

export interface StrategyScenario {
  id: string;
  label: string;
  input: StrategyInput;
  nextMovePct: number;
}

export const sampleScenarios: StrategyScenario[] = [
  {
    id: "bnb-rotation-breakout",
    label: "BNB rotation with improving market breadth",
    nextMovePct: 5.8,
    input: {
      token: { symbol: "BNB", name: "BNB", chain: "BNB Chain", eligible: true },
      market: {
        priceChange24hPct: 4.2,
        priceChange7dPct: 9.4,
        volumeChange24hPct: 38,
        liquidityUsd: 82_000_000,
        volatility7dPct: 6.8,
        fundingRatePct: 0.012,
        rsi14: 58,
        dataAgeMinutes: 6,
      },
      narrative: {
        newsScore: 0.72,
        socialScore: 0.65,
        kolScore: 0.61,
        catalystScore: 0.7,
        evidence: [
          "CMC-style market breadth shifted positive across large-cap BNB ecosystem assets.",
          "Social momentum is rising without the RSI profile of a late chase.",
          "Catalyst calendar includes agent infrastructure announcements during the build window.",
        ],
      },
      risk: {
        maxDrawdownPct: 12,
        currentDrawdownPct: 4.5,
        minLiquidityUsd: 5_000_000,
        maxVolatilityPct: 18,
        maxDataAgeMinutes: 15,
        riskProfile: "balanced",
      },
    },
  },
  {
    id: "meme-volatility-trap",
    label: "High-social meme spike rejected by risk gate",
    nextMovePct: -13.4,
    input: {
      token: { symbol: "FLOKI", name: "FLOKI", chain: "BNB Chain", eligible: true },
      market: {
        priceChange24hPct: 18.6,
        priceChange7dPct: 31.2,
        volumeChange24hPct: 144,
        liquidityUsd: 16_500_000,
        volatility7dPct: 31,
        fundingRatePct: 0.098,
        rsi14: 82,
        dataAgeMinutes: 5,
      },
      narrative: {
        newsScore: 0.58,
        socialScore: 0.92,
        kolScore: 0.78,
        catalystScore: 0.44,
        evidence: [
          "KOL attention is elevated, but the move is already crowded.",
          "Funding and volatility show a late-entry trap rather than fresh alpha.",
        ],
      },
      risk: {
        maxDrawdownPct: 10,
        currentDrawdownPct: 6.5,
        minLiquidityUsd: 5_000_000,
        maxVolatilityPct: 18,
        maxDataAgeMinutes: 15,
        riskProfile: "balanced",
      },
    },
  },
  {
    id: "stale-catalyst-feed",
    label: "Strong catalyst rejected because CMC data is stale",
    nextMovePct: -5.6,
    input: {
      token: { symbol: "CAKE", name: "PancakeSwap", chain: "BNB Chain", eligible: true },
      market: {
        priceChange24hPct: 6.1,
        priceChange7dPct: 11.8,
        volumeChange24hPct: 52,
        liquidityUsd: 38_000_000,
        volatility7dPct: 9.2,
        fundingRatePct: 0.018,
        rsi14: 61,
        dataAgeMinutes: 44,
      },
      narrative: {
        newsScore: 0.76,
        socialScore: 0.68,
        kolScore: 0.59,
        catalystScore: 0.83,
        evidence: [
          "Catalyst quality is high, but the market snapshot is too old for pre-trade execution.",
          "The agent should request a fresh CMC payload before sizing any position.",
        ],
      },
      risk: {
        maxDrawdownPct: 12,
        currentDrawdownPct: 3.5,
        minLiquidityUsd: 5_000_000,
        maxVolatilityPct: 18,
        maxDataAgeMinutes: 15,
        riskProfile: "balanced",
      },
    },
  },
  {
    id: "link-conflicted-monitor",
    label: "Conflicted signal where the agent should wait",
    nextMovePct: 1.1,
    input: {
      token: { symbol: "LINK", name: "Chainlink", chain: "BNB Chain", eligible: true },
      market: {
        priceChange24hPct: -1.4,
        priceChange7dPct: 1.6,
        volumeChange24hPct: 5,
        liquidityUsd: 24_000_000,
        volatility7dPct: 8.5,
        fundingRatePct: 0.006,
        rsi14: 49,
        dataAgeMinutes: 9,
      },
      narrative: {
        newsScore: 0.52,
        socialScore: 0.48,
        kolScore: 0.42,
        catalystScore: 0.5,
        evidence: [
          "Narrative quality is neutral and does not justify fresh exposure.",
          "Liquidity is acceptable, so the agent can monitor without opening a position.",
        ],
      },
      risk: {
        maxDrawdownPct: 12,
        currentDrawdownPct: 3,
        minLiquidityUsd: 5_000_000,
        maxVolatilityPct: 18,
        maxDataAgeMinutes: 15,
        riskProfile: "balanced",
      },
    },
  },
  {
    id: "ineligible-random-token",
    label: "Outside eligible universe despite attractive narrative",
    nextMovePct: 7.3,
    input: {
      token: { symbol: "RANDOM", name: "Random Token", chain: "Unknown", eligible: false },
      market: {
        priceChange24hPct: 7.4,
        priceChange7dPct: 14.1,
        volumeChange24hPct: 45,
        liquidityUsd: 9_200_000,
        volatility7dPct: 7.9,
        fundingRatePct: 0.014,
        rsi14: 57,
        dataAgeMinutes: 7,
      },
      narrative: {
        newsScore: 0.81,
        socialScore: 0.69,
        kolScore: 0.64,
        catalystScore: 0.78,
        evidence: [
          "Narrative signal is positive but rejected by universe constraints.",
          "The skill intentionally separates alpha quality from competition eligibility.",
        ],
      },
      risk: {
        maxDrawdownPct: 12,
        currentDrawdownPct: 2,
        minLiquidityUsd: 5_000_000,
        maxVolatilityPct: 18,
        maxDataAgeMinutes: 15,
        riskProfile: "balanced",
      },
    },
  },
];
