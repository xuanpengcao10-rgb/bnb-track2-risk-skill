import { describe, expect, it } from "vitest";
import { cmcSkillManifest, cmcSkillResponseSchema, evaluateStrategy, runCmcSkill, sampleScenarios } from "../src/index.js";

describe("public package API", () => {
  it("exports the strategy engine and CMC skill adapter from one entrypoint", () => {
    const result = evaluateStrategy(sampleScenarios[0].input);
    const adapterResult = runCmcSkill(sampleScenarios[0].input);

    expect(result.action).toBe("buy");
    expect(adapterResult.skill).toBe(cmcSkillManifest.name);
    expect(cmcSkillResponseSchema.required).toEqual(["skill", "version", "output", "audit"]);
  });
});
