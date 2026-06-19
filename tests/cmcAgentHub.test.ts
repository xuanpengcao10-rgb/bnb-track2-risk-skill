import { describe, expect, it } from "vitest";
import cmcDataQuotePayload from "../examples/cmc-data-quote-payload.json" with { type: "json" };
import cmcPayload from "../examples/cmc-agent-hub-payload.json" with { type: "json" };
import { normalizeCmcAgentHubPayload, runCmcAgentHubSkill } from "../src/integrations/cmcAgentHub.js";

describe("CMC Agent Hub payload adapter", () => {
  it("normalizes live-style CMC Agent Hub payloads into StrategyInput", () => {
    const input = normalizeCmcAgentHubPayload(cmcPayload);

    expect(input.token.symbol).toBe("BNB");
    expect(input.token.eligible).toBe(true);
    expect(input.market.liquidityUsd).toBe(82_000_000);
    expect(input.market.rsi14).toBe(58);
    expect(input.market.dataAgeMinutes).toBe(6);
    expect(input.narrative.newsScore).toBeCloseTo(0.72);
    expect(input.risk.riskProfile).toBe("balanced");
    expect(input.risk.maxDataAgeMinutes).toBe(15);
  });

  it("accepts common CMC quote payloads nested under data", () => {
    const input = normalizeCmcAgentHubPayload(cmcDataQuotePayload);

    expect(input.token).toEqual({
      symbol: "CAKE",
      name: "PancakeSwap",
      chain: "BNB Smart Chain",
      eligible: false,
    });
    expect(input.market.priceChange24hPct).toBe(2.6);
    expect(input.market.priceChange7dPct).toBe(5.4);
    expect(input.market.volumeChange24hPct).toBe(19);
    expect(input.market.rsi14).toBe(54);
  });

  it("lets direct market fields override nested CMC quote values", () => {
    const input = normalizeCmcAgentHubPayload({
      ...cmcPayload,
      market: {
        ...cmcPayload.market,
        priceChange24hPct: 1.2,
        priceChange7dPct: 3.4,
        volumeChange24hPct: 5.6,
      },
    });

    expect(input.market.priceChange24hPct).toBe(1.2);
    expect(input.market.priceChange7dPct).toBe(3.4);
    expect(input.market.volumeChange24hPct).toBe(5.6);
  });

  it("rejects payloads without an asset or data symbol", () => {
    expect(() =>
      normalizeCmcAgentHubPayload({
        market: cmcPayload.market,
        narrative: cmcPayload.narrative,
        risk: cmcPayload.portfolioRisk,
      }),
    ).toThrow("CMC Agent Hub payload requires asset.symbol or data.symbol.");
  });

  it("runs the strategy directly from normalized CMC payloads", () => {
    const response = runCmcAgentHubSkill(cmcPayload);

    expect(response.skill).toBe("risk-gated-narrative-alpha");
    expect(response.output.token).toBe("BNB");
    expect(response.output.decision).toBe("buy");
    expect(response.audit.sourceAdapters).toContain("cmc-agent-hub-payload");
    expect(response.audit.adapterReady).toBe(true);
    expect(response.audit.dataMode).toBe("live-compatible-payload");
    expect(response.audit.liveReady).toBe(true);
    expect(response.audit.inputSource).toBe("cmc-agent-hub");
    expect(response.audit.inputGeneratedAt).toBe("2026-06-18T09:00:00.000Z");
  });

  it("safely handles raw CMC quote payloads without supplemental strategy context", () => {
    const response = runCmcAgentHubSkill({
      source: "coinmarketcap-raw-quote",
      generatedAt: "2026-06-18T09:04:00.000Z",
      data: {
        symbol: "CAKE",
        name: "PancakeSwap",
        platform: { name: "BNB Smart Chain" },
        quote: {
          USD: {
            percent_change_24h: 2.6,
            percent_change_7d: 5.4,
            volume_change_24h: 19,
          },
        },
      },
    });

    expect(response.output.token).toBe("CAKE");
    expect(response.output.decision).toBe("avoid");
    expect(response.audit.liveReady).toBe(false);
    expect(response.audit.warnings).toEqual(
      expect.arrayContaining([
        "Market data age is missing; add dataAgeMinutes for stricter stale-data protection.",
        "Narrative evidence is empty; provide cited market or catalyst evidence before sizing.",
        "Supplemental liquidity, volatility, and risk limits are missing; defaults force conservative analysis.",
      ]),
    );
  });

  it("surfaces audit warnings for incomplete live payload context", () => {
    const response = runCmcAgentHubSkill({
      asset: cmcPayload.asset,
      market: {
        ...cmcPayload.market,
        data_age_minutes: undefined,
        dataAgeMinutes: undefined,
      },
      narrative: {
        ...cmcPayload.narrative,
        evidence: [],
      },
      portfolioRisk: cmcPayload.portfolioRisk,
    });

    expect(response.audit.warnings).toContain("Payload generatedAt is missing; rely on the data-freshness gate before execution.");
    expect(response.audit.warnings).toContain("Market data age is missing; add dataAgeMinutes for stricter stale-data protection.");
    expect(response.audit.warnings).toContain("Narrative evidence is empty; provide cited market or catalyst evidence before sizing.");
    expect(response.audit.liveReady).toBe(false);
  });
});
