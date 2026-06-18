import { describe, expect, it } from "vitest";
import cmcPayload from "../examples/cmc-agent-hub-payload.json" with { type: "json" };
import { normalizeCmcAgentHubPayload, runCmcAgentHubSkill } from "../src/integrations/cmcAgentHub.js";

describe("CMC Agent Hub payload adapter", () => {
  it("normalizes live-style CMC Agent Hub payloads into StrategyInput", () => {
    const input = normalizeCmcAgentHubPayload(cmcPayload);

    expect(input.token.symbol).toBe("BNB");
    expect(input.token.eligible).toBe(true);
    expect(input.market.liquidityUsd).toBe(82_000_000);
    expect(input.market.rsi14).toBe(58);
    expect(input.narrative.newsScore).toBeCloseTo(0.72);
    expect(input.risk.riskProfile).toBe("balanced");
  });

  it("runs the strategy directly from normalized CMC payloads", () => {
    const response = runCmcAgentHubSkill(cmcPayload);

    expect(response.skill).toBe("risk-gated-narrative-alpha");
    expect(response.output.token).toBe("BNB");
    expect(response.output.decision).toBe("buy");
    expect(response.audit.sourceAdapters).toContain("cmc-agent-hub-payload");
  });
});
