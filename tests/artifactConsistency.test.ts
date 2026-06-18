import { describe, expect, it } from "vitest";
import exampleResponse from "../examples/cmc-skill-response.json" with { type: "json" };
import skillManifest from "../submissions/skill-manifest.json" with { type: "json" };
import { cmcSkillManifest, runCmcSkill, sampleScenarios } from "../src/index.js";

describe("submission artifacts", () => {
  it("keeps the review manifest aligned with the source manifest", () => {
    expect(skillManifest).toEqual(cmcSkillManifest);
  });

  it("keeps the sample CMC response aligned with the deterministic BNB scenario", () => {
    expect(exampleResponse).toEqual(runCmcSkill(sampleScenarios[0].input));
  });
});
