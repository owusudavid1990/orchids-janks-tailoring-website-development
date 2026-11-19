import { PROMO_PHASES, createPromoBannerBootScript, promoHref } from "@/lib/promo-banner";

/**
 * Full-width announcement bar. Server-rendered on every page.
 *
 * The phase is chosen by the blocking script in the root layout, not here.
 * This component always emits the same three links, so a cached static page
 * cannot get stuck on the wrong message and React hydrates a stable tree.
 * CSS shows the one link whose phase matches `html[data-promo-banner]`.
 */
export function PromoBanner() {
  return (
    <>
      {PROMO_PHASES.map((phase) => (
        <a
          key={phase.id}
          className="promo-banner"
          data-phase={phase.id}
          href={promoHref(phase.utmContent)}
        >
          {phase.message}
        </a>
      ))}
    </>
  );
}

/** True on local dev and Vercel preview. False on production builds. */
export function promoBannerPreviewEnabled(): boolean {
  return process.env.VERCEL_ENV !== "production";
}

export function promoBannerBootScript(): string {
  return createPromoBannerBootScript(promoBannerPreviewEnabled());
}
