import { describe, expect, it } from "vitest";
import { bnbAgentStrategyTool, sampleScenarios } from "../src/index.js";

describe("BNB agent tool wrapper", () => {
  it("exposes a deterministic tool wrapper around the strategy skill", () => {
    expect(bnbAgentStrategyTool.name).toBe("risk_gated_narrative_alpha");
    expect(bnbAgentStrategyTool.permissions.custody).toBe("none");
    expect(bnbAgentStrategyTool.permissions.trading).toBe("analysis-only");
  });

  it("executes with StrategyInput and returns agent-readable output", () => {
    const response = bnbAgentStrategyTool.execute(sampleScenarios[0].input);

    expect(response.skill).toBe("risk-gated-narrative-alpha");
    expect(response.output.decision).toBe("buy");
    expect(response.output.executionGuards.length).toBeGreaterThan(0);
  });
});
