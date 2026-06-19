import { describe, expect, it } from "vitest";
import exampleResponse from "../examples/cmc-skill-response.json" with { type: "json" };
import demoSource from "../src/ui/App.tsx?raw";
import finalCopy from "../submissions/final-submit-copy.md?raw";
import proofPack from "../submissions/judge-proof-pack.md?raw";
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

  it("ships a judge proof pack and final copy for DoraHacks review", () => {
    expect(proofPack).toContain("Integration proof");
    expect(proofPack).toContain("30 tests passed");
    expect(proofPack).toContain("+0.36%");
    expect(proofPack).toContain("0.57% avoided loss");
    expect(proofPack).toContain("src/integrations/cmcAgentHub.ts");
    expect(proofPack).toContain("src/integrations/bnbAgentTool.ts");

    expect(finalCopy).toContain("https://github.com/xuanpengcao10-rgb/bnb-track2-risk-skill");
    expect(finalCopy).toContain("https://xuanpengcao10-rgb.github.io/bnb-track2-risk-skill/");
    expect(finalCopy).toContain("Risk-Gated Narrative Alpha Skill");

    expect(demoSource).toContain("Integration Proof");
    expect(demoSource).toContain("CMC Agent Hub payload");
    expect(demoSource).toContain("BNB agent wrapper");
    expect(demoSource).toContain("Trust Wallet boundary");
  });
});
