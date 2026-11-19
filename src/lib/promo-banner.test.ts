import assert from "node:assert/strict";
import { describe, it } from "node:test";
import vm from "node:vm";
import {
  PROMO_PHASES,
  createPromoBannerBootScript,
  promoHref,
} from "./promo-banner.ts";

/**
 * Run the real boot script (the one inlined into the page) at a fixed instant.
 * Returns the phase written onto <html>, or null when the bar stays hidden.
 */
function phaseAt(iso: string, search = "", allowPreview = true): string | null {
  const script = createPromoBannerBootScript(allowPreview);
  const fixed = new Date(iso).getTime();
  let value: string | null = null;

  function FakeDate(this: unknown, ...args: ConstructorParameters<typeof Date>) {
    if (!(this instanceof FakeDate)) {
      return args.length === 0 ? new Date(fixed) : new Date(...args);
    }
    if (args.length === 0) return new Date(fixed);
    return new Date(...args);
  }
  FakeDate.now = () => fixed;
  FakeDate.parse = Date.parse;
  FakeDate.UTC = Date.UTC;
  FakeDate.prototype = Date.prototype;

  const context = vm.createContext({
    document: {
      documentElement: {
        setAttribute(_name: string, next: string) {
          value = next;
        },
      },
    },
    location: { search },
    URLSearchParams,
    Intl,
    Date: FakeDate,
  });

  vm.runInContext(script, context, { timeout: 1000 });
  return value;
}

describe("promo banner schedule (Europe/London)", () => {
  it("is hidden at 06:59:59 and visible at 07:00 on 27 November", () => {
    assert.equal(phaseAt("2026-11-27T06:59:59.000Z"), null);
    assert.equal(phaseAt("2026-11-27T06:59:59.999Z"), null);
    assert.equal(phaseAt("2026-11-27T07:00:00.000Z"), "launch");
    assert.equal(phaseAt("2026-11-27T07:00:00.001Z"), "launch");
  });

  it("hands off from launch to midsale at 30 November 07:00 exactly", () => {
    assert.equal(phaseAt("2026-11-30T06:59:59.000Z"), "launch");
    assert.equal(phaseAt("2026-11-30T06:59:59.999Z"), "launch");
    assert.equal(phaseAt("2026-11-30T07:00:00.000Z"), "midsale");
  });

  it("hands off from midsale to final at 5 December 07:00 exactly", () => {
    assert.equal(phaseAt("2026-12-05T06:59:59.000Z"), "midsale");
    assert.equal(phaseAt("2026-12-05T06:59:59.999Z"), "midsale");
    assert.equal(phaseAt("2026-12-05T07:00:00.000Z"), "final");
  });

  it("stays on the final phase through 23:59:59 on 6 December and hides at 00:00 on 7 December", () => {
    assert.equal(phaseAt("2026-12-06T23:59:59.000Z"), "final");
    assert.equal(phaseAt("2026-12-06T23:59:59.999Z"), "final");
    assert.equal(phaseAt("2026-12-07T00:00:00.000Z"), null);
    assert.equal(phaseAt("2026-12-07T00:00:00.001Z"), null);
  });

  it("is hidden well outside the sale", () => {
    assert.equal(phaseAt("2026-11-19T12:00:00.000Z"), null);
    assert.equal(phaseAt("2026-11-27T00:00:00.000Z"), null);
    assert.equal(phaseAt("2027-01-01T00:00:00.000Z"), null);
  });

  it("uses the Europe/London instant, not the digits in the timestamp or the machine timezone", () => {
    // 07:00 in Paris on 27 November is 06:00 in London (GMT). Still hidden.
    assert.equal(phaseAt("2026-11-27T07:00:00.000+01:00"), null);
    // 08:00 in Paris is 07:00 in London. Launch.
    assert.equal(phaseAt("2026-11-27T08:00:00.000+01:00"), "launch");
    // 02:00 in New York (EST, UTC-5) is 07:00 in London. Launch.
    assert.equal(phaseAt("2026-11-27T01:59:59.000-05:00"), null);
    assert.equal(phaseAt("2026-11-27T02:00:00.000-05:00"), "launch");
    // Midnight in Paris on 7 December is still 23:00 on 6 December in London.
    assert.equal(phaseAt("2026-12-07T00:00:00.000+01:00"), "final");
    // 01:00 in Paris on 7 December is 00:00 in London. Hidden.
    assert.equal(phaseAt("2026-12-07T01:00:00.000+01:00"), null);
    // A British Summer Time instant is converted (UTC+1) and is outside the sale.
    assert.equal(phaseAt("2026-07-01T06:00:00.000Z"), null);
  });
});

describe("preview override", () => {
  it("forces each phase only when preview is allowed", () => {
    const before = "2026-11-19T12:00:00.000Z";
    assert.equal(phaseAt(before, "?banner_preview=launch", true), "launch");
    assert.equal(phaseAt(before, "?banner_preview=midsale", true), "midsale");
    assert.equal(phaseAt(before, "?foo=1&banner_preview=final", true), "final");
  });

  it("lets the query param win over the clock during the sale", () => {
    assert.equal(phaseAt("2026-12-06T12:00:00.000Z", "?banner_preview=launch", true), "launch");
  });

  it("ignores unknown preview values and falls through to the clock", () => {
    assert.equal(phaseAt("2026-11-19T12:00:00.000Z", "?banner_preview=hidden", true), null);
    assert.equal(phaseAt("2026-11-19T12:00:00.000Z", "?banner_preview=LAUNCH", true), null);
    assert.equal(phaseAt("2026-11-28T12:00:00.000Z", "?banner_preview=nope", true), "launch");
  });

  it("has no effect when preview is disabled, including during the sale", () => {
    assert.equal(phaseAt("2026-11-19T12:00:00.000Z", "?banner_preview=launch", false), null);
    assert.equal(phaseAt("2026-11-28T12:00:00.000Z", "?banner_preview=midsale", false), "launch");
    assert.equal(phaseAt("2026-12-06T23:59:59.000Z", "?banner_preview=launch", false), "final");
    assert.equal(phaseAt("2026-12-07T00:00:00.000Z", "?banner_preview=final", false), null);
  });

  it("does not mention the query param in the production script", () => {
    const production = createPromoBannerBootScript(false);
    assert.equal(production.includes("banner_preview"), false);
    assert.equal(production.includes("location.search"), false);
    assert.equal(production.includes("</"), false);
  });
});

describe("banner copy and shop links", () => {
  it("uses the approved sentence for each phase and the matching utm_content", () => {
    assert.deepEqual(
      PROMO_PHASES.map((phase) => [phase.id, phase.utmContent, phase.message]),
      [
        ["launch", "banner_launch", "Half price on all ties and cufflinks, until 6 December."],
        ["midsale", "banner_midsale", "Ties and cufflinks remain half price until 6 December."],
        ["final", "banner_final", "Half price on ties and cufflinks ends Sunday at 23:59."],
      ]
    );

    for (const phase of PROMO_PHASES) {
      assert.equal(
        promoHref(phase.utmContent),
        `https://shop.jankstailoring.com/?utm_source=website&utm_medium=banner&utm_campaign=bf_2026&utm_content=${phase.utmContent}`
      );
    }
  });
});
