import { evaluateStrategy } from "./strategy.js";
import type { StrategyInput, StrategyResult } from "./types.js";
import type { StrategyScenario } from "../data/scenarios.js";

export interface SimulationOutcome {
  label: "captured_upside" | "small_watchlist_gain" | "capital_preserved" | "missed_upside" | "loss_limited";
  estimatedReturnPct: number;
  explanation: string;
}

export interface SimulationRow {
  id: string;
  label: string;
  input: StrategyInput;
  decision: StrategyResult;
  simulationOutcome: SimulationOutcome;
}

export interface SimulationSummary {
  totalScenarios: number;
  actionCounts: Record<"buy" | "hold" | "avoid", number>;
  averageConfidence: number;
  riskBlockedCount: number;
  estimatedPortfolioReturnPct: number;
  capitalPreservedPct: number;
}

export interface EquityCurvePoint {
  step: number;
  label: string;
  cumulativeReturnPct: number;
  drawdownPct: number;
}

export interface SimulationResult {
  rows: SimulationRow[];
  summary: SimulationSummary;
  equityCurve: EquityCurvePoint[];
}

const round = (value: number, digits = 1) => Number(value.toFixed(digits));

function outcomeFor(decision: StrategyResult, nextMovePct: number): SimulationOutcome {
  if (decision.action === "buy") {
    const captured = nextMovePct * (decision.position.maxPortfolioPct / 100);
    if (captured >= 0) {
      return {
        label: "captured_upside",
        estimatedReturnPct: round(captured, 2),
        explanation: "The skill allowed exposure and captured a risk-scaled share of the next move.",
      };
    }
    const limited = Math.max(captured, -decision.position.stopLossPct * (decision.position.maxPortfolioPct / 100));
    return {
      label: "loss_limited",
      estimatedReturnPct: round(limited, 2),
      explanation: "The trade moved against the thesis, but stop and position sizing bounded the damage.",
    };
  }

  if (decision.action === "hold") {
    return {
      label: "small_watchlist_gain",
      estimatedReturnPct: round(Math.max(0, nextMovePct) * 0.01, 2),
      explanation: "The skill kept the token on watch without opening meaningful exposure.",
    };
  }

  if (nextMovePct < 0) {
    return {
      label: "capital_preserved",
      estimatedReturnPct: 0,
      explanation: "The skill blocked a setup that later moved against risk-seeking buyers.",
    };
  }

  return {
    label: "missed_upside",
    estimatedReturnPct: 0,
    explanation: "The skill skipped upside because a hard risk or eligibility gate had priority.",
  };
}

export function runSimulation(scenarios: StrategyScenario[]): SimulationResult {
  const rows = scenarios.map((scenario) => {
    const decision = evaluateStrategy(scenario.input);
    return {
      id: scenario.id,
      label: scenario.label,
      input: scenario.input,
      decision,
      simulationOutcome: outcomeFor(decision, scenario.nextMovePct),
    };
  });

  const actionCounts = rows.reduce<SimulationSummary["actionCounts"]>(
    (counts, row) => {
      counts[row.decision.action] += 1;
      return counts;
    },
    { buy: 0, hold: 0, avoid: 0 },
  );
  const averageConfidence = round(
    rows.reduce((sum, row) => sum + row.decision.confidence, 0) / Math.max(rows.length, 1),
    1,
  );
  const riskBlockedCount = rows.filter((row) => row.decision.risk.gates.some((gate) => !gate.passed)).length;
  const estimatedPortfolioReturnPct = round(
    rows.reduce((sum, row) => sum + row.simulationOutcome.estimatedReturnPct, 0),
    2,
  );
  const capitalPreservedCount = rows.filter((row) => row.simulationOutcome.label === "capital_preserved").length;
  const capitalPreservedPct = round((capitalPreservedCount / Math.max(rows.length, 1)) * 100, 1);
  const equityCurve = rows.reduce<EquityCurvePoint[]>(
    (curve, row, index) => {
      const previous = curve[curve.length - 1];
      const cumulativeReturnPct = round(previous.cumulativeReturnPct + row.simulationOutcome.estimatedReturnPct, 2);
      const peakReturnPct = Math.max(...curve.map((point) => point.cumulativeReturnPct), cumulativeReturnPct);
      curve.push({
        step: index + 1,
        label: row.input.token.symbol,
        cumulativeReturnPct,
        drawdownPct: round(Math.max(0, peakReturnPct - cumulativeReturnPct), 2),
      });
      return curve;
    },
    [{ step: 0, label: "Start", cumulativeReturnPct: 0, drawdownPct: 0 }],
  );

  return {
    rows,
    summary: {
      totalScenarios: rows.length,
      actionCounts,
      averageConfidence,
      riskBlockedCount,
      estimatedPortfolioReturnPct,
      capitalPreservedPct,
    },
    equityCurve,
  };
}
