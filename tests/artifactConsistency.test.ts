import { describe, expect, it } from "vitest";
import exampleResponse from "../examples/cmc-skill-response.json" with { type: "json" };
import skillManifest from "../submissions/skill-manifest.json" with { type: "json" };
import { cmcSkillManifest, runCmcSkill, sampleScenarios } from "../src/index.js";

describe("submission artifacts", () => {
  it("keeps the review manifest aligned with the source manifest", () => {
    expect(skillManifest).toEqual(cmcSkillManifest);
  });

  it("exposes judge-facing proof fields in the review manifest", () => {
    expect(skillManifest.capabilities).toEqual(
      expect.arrayContaining([
        "pre-trade-risk-gates",
        "backtestable-strategy-spec",
        "cmc-agent-hub-payload-normalization",
        "bnb-agent-tool-wrapper",
      ]),
    );
    expect(skillManifest.auditFields).toEqual(
      expect.arrayContaining(["dataMode", "adapterReady", "liveReady", "riskGateSummary", "warnings"]),
    );
    expect(skillManifest.reviewExamples).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "Deterministic demo response",
          path: "examples/cmc-skill-response.json",
        }),
        expect.objectContaining({
          name: "Baseline comparison report",
          path: "docs/backtest-baseline-report.md",
        }),
      ]),
    );
  });

  it("keeps the sample CMC response aligned with the deterministic BNB scenario", () => {
    expect(exampleResponse).toEqual(runCmcSkill(sampleScenarios[0].input));
  });
});
