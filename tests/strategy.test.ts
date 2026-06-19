import { describe, expect, it } from "vitest";
import { evaluateStrategy } from "../src/core/strategy.js";
import type { StrategyInput } from "../src/core/types.js";

const baseInput: StrategyInput = {
  token: {
    symbol: "BNB",
    name: "BNB",
    chain: "BNB Chain",
    eligible: true,
  },
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
      "CMC-style market structure signal is positive",
      "Social momentum is rising without extreme crowding",
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
};

const expectFiniteStrategyNumbers = (result: ReturnType<typeof evaluateStrategy>) => {
  const values = [
    result.confidence,
    result.marketScore,
    result.narrativeScore,
    result.signalScore,
    result.riskScore,
    result.position.maxPortfolioPct,
    result.position.stopLossPct,
    result.position.takeProfitPct,
    result.position.cooldownHours,
    result.agentOutput.confidence,
    result.agentOutput.maxPositionPct,
    result.agentOutput.stopLossPct,
    result.agentOutput.scoreBreakdown.market,
    result.agentOutput.scoreBreakdown.narrative,
    result.agentOutput.scoreBreakdown.signal,
    result.agentOutput.scoreBreakdown.risk,
  ];

  for (const value of values) {
    expect(Number.isFinite(value)).toBe(true);
  }
};

describe("evaluateStrategy", () => {
  it("returns a buy decision when positive signals pass every risk gate", () => {
    const result = evaluateStrategy(baseInput);

    expect(result.action).toBe("buy");
    expect(result.confidence).toBeGreaterThanOrEqual(70);
    expect(result.position.maxPortfolioPct).toBeGreaterThan(0);
    expect(result.risk.gates.every((gate) => gate.passed)).toBe(true);
    expect(result.executionGuards.length).toBeGreaterThan(0);
    expect(result.agentOutput.version).toBe("1.0");
    expect(result.agentOutput.scoreBreakdown).toEqual({
      market: result.marketScore,
      narrative: result.narrativeScore,
      signal: result.signalScore,
      risk: result.riskScore,
    });
  });

  it("returns avoid when the token is outside the eligible token universe", () => {
    const result = evaluateStrategy({
      ...baseInput,
      token: { ...baseInput.token, symbol: "RANDOM", eligible: false },
    });

    expect(result.action).toBe("avoid");
    expect(result.position.maxPortfolioPct).toBe(0);
    expect(result.risk.gates.some((gate) => gate.id === "eligible-token" && !gate.passed)).toBe(true);
    expect(result.invalidationConditions).toContain("Token is outside the hackathon eligible universe.");
  });

  it("prioritizes capital protection when volatility or drawdown gates fail", () => {
    const result = evaluateStrategy({
      ...baseInput,
      market: { ...baseInput.market, volatility7dPct: 24 },
      risk: { ...baseInput.risk, currentDrawdownPct: 14 },
    });

    expect(result.action).toBe("avoid");
    expect(result.confidence).toBeLessThan(60);
    expect(result.position.maxPortfolioPct).toBe(0);
    expect(result.risk.gates.filter((gate) => !gate.passed).map((gate) => gate.id)).toEqual(
      expect.arrayContaining(["volatility", "drawdown"]),
    );
  });

  it("returns hold for conflicted signals that pass hard risk gates", () => {
    const result = evaluateStrategy({
      ...baseInput,
      market: {
        ...baseInput.market,
        priceChange24hPct: -1.4,
        volumeChange24hPct: 5,
        rsi14: 49,
      },
      narrative: {
        ...baseInput.narrative,
        newsScore: 0.52,
        socialScore: 0.48,
        kolScore: 0.42,
        catalystScore: 0.5,
      },
    });

    expect(result.action).toBe("hold");
    expect(result.position.maxPortfolioPct).toBeGreaterThan(0);
    expect(result.position.maxPortfolioPct).toBeLessThanOrEqual(4);
    expect(result.agentOutput.decision).toBe("hold");
  });

  it("blocks stale market data before an agent can open exposure", () => {
    const result = evaluateStrategy({
      ...baseInput,
      market: { ...baseInput.market, dataAgeMinutes: 42 },
    });

    expect(result.action).toBe("avoid");
    expect(result.position.maxPortfolioPct).toBe(0);
    expect(result.risk.gates.some((gate) => gate.id === "data-freshness" && !gate.passed)).toBe(true);
    expect(result.invalidationConditions).toContain("Market data age exceeds the configured freshness limit.");
    expect(result.executionGuards).toContain("Cancel execution if market data age exceeds the returned freshness limit.");
  });

  it("keeps numeric outputs finite when volatility limits are configured at zero", () => {
    const result = evaluateStrategy({
      ...baseInput,
      market: { ...baseInput.market, volatility7dPct: 0 },
      risk: { ...baseInput.risk, maxVolatilityPct: 0 },
    });

    expect(result.action).toBe("buy");
    expectFiniteStrategyNumbers(result);
  });

  it("keeps numeric outputs finite at the drawdown budget boundary", () => {
    const result = evaluateStrategy({
      ...baseInput,
      risk: { ...baseInput.risk, maxDrawdownPct: 0, currentDrawdownPct: 0 },
    });

    expect(result.action).toBe("avoid");
    expect(result.position.maxPortfolioPct).toBe(0);
    expectFiniteStrategyNumbers(result);
  });
});
