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
    riskProfile: "balanced",
  },
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
});
