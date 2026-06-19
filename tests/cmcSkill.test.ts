import { describe, expect, it } from "vitest";
import { sampleScenarios } from "../src/data/scenarios.js";
import { cmcSkillManifest, runCmcSkill } from "../src/integrations/cmcSkill.js";

describe("CMC skill adapter", () => {
  it("exposes a stable manifest for hackathon submission review", () => {
    expect(cmcSkillManifest.name).toBe("risk-gated-narrative-alpha");
    expect(cmcSkillManifest.version).toBe("1.0.0");
    expect(cmcSkillManifest.track).toBe("BNB Hack Track 2: Strategy Skills");
    expect(cmcSkillManifest.inputSchema.required).toEqual(["token", "market", "narrative", "risk"]);
    expect(cmcSkillManifest.outputSchema.required).toEqual(
      expect.arrayContaining(["decision", "confidence", "riskGates", "executionGuards"]),
    );
  });

  it("returns an agent payload with execution guards and audit metadata", () => {
    const response = runCmcSkill(sampleScenarios[0].input);

    expect(response.skill).toBe(cmcSkillManifest.name);
    expect(response.output.decision).toBe("buy");
    expect(response.output.riskGates.every((gate) => gate.passed)).toBe(true);
    expect(response.output.executionGuards.length).toBeGreaterThan(0);
    expect(response.audit.sourceAdapters).toEqual(["cmc-style-market", "narrative-alpha", "portfolio-risk"]);
    expect(response.audit.custodyMode).toBe("analysis-only");
    expect(response.audit.dataMode).toBe("deterministic-demo");
    expect(response.audit.adapterReady).toBe(true);
    expect(response.audit.liveReady).toBe(false);
    expect(response.audit.warnings).toContain("Demo scenarios are deterministic fixtures; refresh with a live CMC payload before execution.");
  });
});
