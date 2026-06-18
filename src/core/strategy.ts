import type {
  AgentReadableOutput,
  MarketSignals,
  NarrativeSignals,
  PositionPlan,
  RiskGateResult,
  RiskProfile,
  StrategyAction,
  StrategyInput,
  StrategyResult,
} from "./types.js";

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const round = (value: number, digits = 1) => Number(value.toFixed(digits));

function profileMultiplier(profile: RiskProfile): number {
  if (profile === "conservative") return 0.72;
  if (profile === "aggressive") return 1.22;
  return 1;
}

function scoreMarket(market: MarketSignals): number {
  const momentum = clamp((market.priceChange24hPct * 3 + market.priceChange7dPct * 1.5 + 35) / 70, 0, 1);
  const participation = clamp((market.volumeChange24hPct + 20) / 80, 0, 1);
  const rsiBalance = market.rsi14 > 72 ? 0.38 : market.rsi14 > 64 ? 0.72 : market.rsi14 >= 45 ? 0.9 : 0.48;
  const fundingPenalty = Math.abs(market.fundingRatePct) > 0.08 ? 0.62 : 1;
  return round((momentum * 0.42 + participation * 0.28 + rsiBalance * 0.3) * fundingPenalty * 100, 1);
}

function scoreNarrative(narrative: NarrativeSignals): number {
  const weighted =
    narrative.newsScore * 0.28 +
    narrative.socialScore * 0.22 +
    narrative.kolScore * 0.18 +
    narrative.catalystScore * 0.32;
  return round(clamp(weighted, 0, 1) * 100, 1);
}

function evaluateRiskGates(input: StrategyInput): RiskGateResult[] {
  const { token, market, risk } = input;
  return [
    {
      id: "eligible-token",
      label: "Eligible token universe",
      passed: token.eligible,
      observed: token.eligible ? "eligible" : "not eligible",
      limit: "BNB Hack eligible token list",
      severity: token.eligible ? "info" : "critical",
      rationale: token.eligible
        ? "Token is inside the allowed strategy universe."
        : "Track conditions should prevent the agent from acting outside the eligible universe.",
    },
    {
      id: "liquidity",
      label: "Minimum liquidity",
      passed: market.liquidityUsd >= risk.minLiquidityUsd,
      observed: market.liquidityUsd,
      limit: risk.minLiquidityUsd,
      severity: market.liquidityUsd >= risk.minLiquidityUsd ? "info" : "critical",
      rationale: "Thin liquidity makes simulated alpha difficult to execute and amplifies slippage.",
    },
    {
      id: "volatility",
      label: "Volatility ceiling",
      passed: market.volatility7dPct <= risk.maxVolatilityPct,
      observed: market.volatility7dPct,
      limit: risk.maxVolatilityPct,
      severity: market.volatility7dPct <= risk.maxVolatilityPct ? "info" : "critical",
      rationale: "The strategy refuses new exposure when short-term volatility breaches the configured ceiling.",
    },
    {
      id: "drawdown",
      label: "Drawdown budget",
      passed: risk.currentDrawdownPct < risk.maxDrawdownPct,
      observed: risk.currentDrawdownPct,
      limit: risk.maxDrawdownPct,
      severity: risk.currentDrawdownPct < risk.maxDrawdownPct ? "info" : "critical",
      rationale: "Capital protection has priority over new entries when the drawdown budget is nearly consumed.",
    },
    {
      id: "data-freshness",
      label: "Market data freshness",
      passed: market.dataAgeMinutes === undefined || market.dataAgeMinutes <= (risk.maxDataAgeMinutes ?? 15),
      observed: market.dataAgeMinutes === undefined ? "not supplied" : `${market.dataAgeMinutes} min`,
      limit: `${risk.maxDataAgeMinutes ?? 15} min`,
      severity: market.dataAgeMinutes === undefined || market.dataAgeMinutes <= (risk.maxDataAgeMinutes ?? 15)
        ? "info"
        : "critical",
      rationale: "Trading agents should not open exposure from stale market data.",
    },
    {
      id: "overheated-rsi",
      label: "Overheated momentum filter",
      passed: market.rsi14 < 76,
      observed: market.rsi14,
      limit: "RSI < 76",
      severity: market.rsi14 < 76 ? "info" : "warning",
      rationale: "The skill trims risk when crowding turns momentum into late-entry risk.",
    },
  ];
}

function chooseAction(signalScore: number, gates: RiskGateResult[]): StrategyAction {
  const failedCritical = gates.some((gate) => !gate.passed && gate.severity === "critical");
  if (failedCritical) return "avoid";
  if (signalScore >= 68) return "buy";
  if (signalScore >= 45) return "hold";
  return "avoid";
}

function buildPosition(action: StrategyAction, signalScore: number, input: StrategyInput): PositionPlan {
  if (action === "avoid") {
    return { maxPortfolioPct: 0, stopLossPct: 0, takeProfitPct: 0, cooldownHours: 12 };
  }
  const remainingDrawdown = clamp(input.risk.maxDrawdownPct - input.risk.currentDrawdownPct, 0, input.risk.maxDrawdownPct);
  const drawdownFactor = clamp(remainingDrawdown / input.risk.maxDrawdownPct, 0.25, 1);
  const volatilityFactor = clamp(1 - input.market.volatility7dPct / (input.risk.maxVolatilityPct * 1.6), 0.28, 1);
  const base = action === "buy" ? 8 : 3.2;
  const conviction = clamp(signalScore / 82, 0.45, 1.18);
  const maxPortfolioPct = round(base * conviction * drawdownFactor * volatilityFactor * profileMultiplier(input.risk.riskProfile), 1);
  return {
    maxPortfolioPct: clamp(maxPortfolioPct, action === "buy" ? 1 : 0.5, action === "buy" ? 9.5 : 4),
    stopLossPct: round(clamp(input.market.volatility7dPct * 0.9, 3.5, 9.5), 1),
    takeProfitPct: round(clamp(input.market.volatility7dPct * 1.8, 8, 24), 1),
    cooldownHours: action === "buy" ? 4 : 8,
  };
}

function invalidationConditions(input: StrategyInput, gates: RiskGateResult[], action: StrategyAction): string[] {
  const conditions: string[] = [];
  if (!input.token.eligible) conditions.push("Token is outside the hackathon eligible universe.");
  if (!gates.find((gate) => gate.id === "liquidity")?.passed) conditions.push("Liquidity falls below the configured execution floor.");
  if (!gates.find((gate) => gate.id === "volatility")?.passed) conditions.push("Seven-day volatility breaches the risk ceiling.");
  if (!gates.find((gate) => gate.id === "drawdown")?.passed) conditions.push("Current drawdown consumes the configured loss budget.");
  if (!gates.find((gate) => gate.id === "data-freshness")?.passed) conditions.push("Market data age exceeds the configured freshness limit.");
  conditions.push("Narrative score drops below 0.45 or evidence freshness cannot be verified.");
  if (action === "buy") conditions.push("Price closes below the strategy stop level or RSI accelerates above 76.");
  return conditions;
}

function executionGuards(input: StrategyInput, action: StrategyAction): string[] {
  const guards = [
    "Do not execute unless the token appears in the BNB Hack eligible token universe.",
    "Route execution through a user-approved wallet or agent executor; this skill never holds keys.",
    "Recompute signals before every order and cancel if market data is stale.",
    "Cancel execution if market data age exceeds the returned freshness limit.",
  ];
  if (action !== "buy") guards.push("Return analysis only; no new order should be opened for hold or avoid decisions.");
  if (input.risk.riskProfile !== "aggressive") guards.push("Cap single-position exposure below the returned maxPortfolioPct even when execution liquidity looks deep.");
  return guards;
}

export function evaluateStrategy(input: StrategyInput): StrategyResult {
  const marketScore = scoreMarket(input.market);
  const narrativeScore = scoreNarrative(input.narrative);
  const signalScore = round(marketScore * 0.48 + narrativeScore * 0.52, 1);
  const gates = evaluateRiskGates(input);
  const passedGateRatio = gates.filter((gate) => gate.passed).length / gates.length;
  const riskScore = round(passedGateRatio * 100, 1);
  const action = chooseAction(signalScore, gates);
  const confidence = action === "avoid"
    ? round(Math.min(signalScore, riskScore) * 0.72, 0)
    : round(clamp(signalScore * 0.72 + riskScore * 0.28, 0, 94), 0);
  const position = buildPosition(action, signalScore, input);
  const invalidation = invalidationConditions(input, gates, action);
  const guards = executionGuards(input, action);
  const thesis = action === "buy"
    ? `${input.token.symbol} has aligned market participation and narrative catalysts while hard risk gates remain open.`
    : action === "hold"
      ? `${input.token.symbol} has enough structure to monitor, but signal strength is not high enough for fresh exposure.`
      : `${input.token.symbol} is blocked by risk gates or insufficient signal quality; capital protection takes priority.`;
  const agentOutput: AgentReadableOutput = {
    version: "1.0",
    token: input.token.symbol,
    decision: action,
    confidence,
    maxPositionPct: position.maxPortfolioPct,
    stopLossPct: position.stopLossPct,
    scoreBreakdown: {
      market: marketScore,
      narrative: narrativeScore,
      signal: signalScore,
      risk: riskScore,
    },
    invalidation,
    evidence: input.narrative.evidence.slice(0, 6),
    riskGates: gates.map(({ id, passed, severity }) => ({ id, passed, severity })),
  };

  return {
    action,
    confidence,
    marketScore,
    narrativeScore,
    signalScore,
    riskScore,
    position,
    risk: {
      gates,
      summary: `${gates.filter((gate) => gate.passed).length}/${gates.length} risk gates passed`,
    },
    thesis,
    invalidationConditions: invalidation,
    executionGuards: guards,
    agentOutput,
  };
}
