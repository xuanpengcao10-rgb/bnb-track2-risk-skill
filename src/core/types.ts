export type RiskProfile = "conservative" | "balanced" | "aggressive";
export type StrategyAction = "buy" | "hold" | "avoid";

export interface TokenContext {
  symbol: string;
  name: string;
  chain: string;
  eligible: boolean;
}

export interface MarketSignals {
  priceChange24hPct: number;
  priceChange7dPct: number;
  volumeChange24hPct: number;
  liquidityUsd: number;
  volatility7dPct: number;
  fundingRatePct: number;
  rsi14: number;
  dataAgeMinutes?: number;
}

export interface NarrativeSignals {
  newsScore: number;
  socialScore: number;
  kolScore: number;
  catalystScore: number;
  evidence: string[];
}

export interface RiskLimits {
  maxDrawdownPct: number;
  currentDrawdownPct: number;
  minLiquidityUsd: number;
  maxVolatilityPct: number;
  maxDataAgeMinutes?: number;
  riskProfile: RiskProfile;
}

export interface StrategyInput {
  token: TokenContext;
  market: MarketSignals;
  narrative: NarrativeSignals;
  risk: RiskLimits;
}

export interface RiskGateResult {
  id: string;
  label: string;
  passed: boolean;
  observed: number | string;
  limit: number | string;
  severity: "info" | "warning" | "critical";
  rationale: string;
}

export interface PositionPlan {
  maxPortfolioPct: number;
  stopLossPct: number;
  takeProfitPct: number;
  cooldownHours: number;
}

export interface ScoreBreakdown {
  market: number;
  narrative: number;
  signal: number;
  risk: number;
}

export interface AgentReadableOutput {
  version: "1.0";
  token: string;
  decision: StrategyAction;
  confidence: number;
  maxPositionPct: number;
  stopLossPct: number;
  scoreBreakdown: ScoreBreakdown;
  invalidation: string[];
  evidence: string[];
  riskGates: Array<Pick<RiskGateResult, "id" | "passed" | "severity">>;
}

export interface StrategyResult {
  action: StrategyAction;
  confidence: number;
  marketScore: number;
  narrativeScore: number;
  signalScore: number;
  riskScore: number;
  position: PositionPlan;
  risk: {
    gates: RiskGateResult[];
    summary: string;
  };
  thesis: string;
  invalidationConditions: string[];
  executionGuards: string[];
  agentOutput: AgentReadableOutput;
}
