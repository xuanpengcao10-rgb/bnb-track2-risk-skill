import { describe, expect, it } from "vitest";
import { runSimulation } from "../src/core/simulation.js";
import { sampleScenarios } from "../src/data/scenarios.js";

describe("runSimulation", () => {
  it("evaluates every sample scenario and returns an aggregate summary", () => {
    const result = runSimulation(sampleScenarios);

    expect(result.rows).toHaveLength(sampleScenarios.length);
    expect(result.summary.totalScenarios).toBe(sampleScenarios.length);
    expect(result.summary.actionCounts.buy).toBeGreaterThanOrEqual(1);
    expect(result.summary.actionCounts.avoid).toBeGreaterThanOrEqual(1);
    expect(result.summary.averageConfidence).toBeGreaterThan(0);
  });

  it("marks risk-blocked scenarios as capital preservation wins", () => {
    const result = runSimulation(sampleScenarios);
    const blocked = result.rows.find((row) => row.id === "meme-volatility-trap");

    expect(blocked).toBeDefined();
    expect(blocked?.decision.action).toBe("avoid");
    expect(blocked?.simulationOutcome.label).toBe("capital_preserved");
    expect(blocked?.simulationOutcome.estimatedReturnPct).toBe(0);
  });

  it("shows stale data as a capital-preservation block in the demo set", () => {
    const result = runSimulation(sampleScenarios);
    const blocked = result.rows.find((row) => row.id === "stale-catalyst-feed");

    expect(blocked).toBeDefined();
    expect(blocked?.decision.action).toBe("avoid");
    expect(blocked?.decision.risk.gates.some((gate) => gate.id === "data-freshness" && !gate.passed)).toBe(true);
    expect(blocked?.simulationOutcome.label).toBe("capital_preserved");
  });

  it("keeps agent-readable outputs available for downstream trading agents", () => {
    const result = runSimulation(sampleScenarios);

    for (const row of result.rows) {
      expect(row.decision.agentOutput.version).toBe("1.0");
      expect(row.decision.agentOutput.token).toBe(row.input.token.symbol);
      expect(row.decision.agentOutput.riskGates.length).toBeGreaterThan(0);
    }
  });

  it("returns an equity curve that auditors can inspect", () => {
    const result = runSimulation(sampleScenarios);

    expect(result.equityCurve).toHaveLength(sampleScenarios.length + 1);
    expect(result.equityCurve[0]).toEqual({ step: 0, label: "Start", cumulativeReturnPct: 0, drawdownPct: 0 });
    expect(result.equityCurve.at(-1)?.cumulativeReturnPct).toBe(result.summary.estimatedPortfolioReturnPct);
    expect(result.summary.capitalPreservedPct).toBeGreaterThan(0);
  });
});
