/**
 * Date-gated Black Friday banner for ties and cufflinks.
 *
 * The schedule is evaluated in the visitor's browser, not at build time.
 * Pages on this site are static / ISR, so a phase chosen while Next.js is
 * rendering would be frozen into the cached HTML and shown for the wrong
 * week. A short revalidate would also miss the 07:00:00 and 23:59:59
 * boundaries by up to the revalidation window.
 *
 * The markup for every phase is always in the HTML (hidden). A tiny blocking
 * script, generated from the same schedule below, sets `data-promo-banner`
 * on <html> before the body is parsed. CSS then shows exactly one bar and
 * reserves its height. While the attribute is absent the bar is
 * `display: none` and `--promo-banner-offset` stays 0, so nothing is
 * reserved and there is no hydration mismatch: React never renders a
 * different tree for the phase.
 */

export const PROMO_PHASES = [
  {
    id: "launch",
    utmContent: "banner_launch",
    message: "Half price on all ties and cufflinks, until 6 December.",
    /** Inclusive, Europe/London. */
    start: "2026-11-27T07:00:00",
    /** Exclusive, Europe/London. */
    end: "2026-11-30T07:00:00",
  },
  {
    id: "midsale",
    utmContent: "banner_midsale",
    message: "Ties and cufflinks remain half price until 6 December.",
    start: "2026-11-30T07:00:00",
    end: "2026-12-05T07:00:00",
  },
  {
    id: "final",
    utmContent: "banner_final",
    message: "Half price on ties and cufflinks ends Sunday at 23:59.",
    start: "2026-12-05T07:00:00",
    /**
     * Exclusive end at the instant 7 December 00:00:00 Europe/London.
     * The whole second of 6 December 23:59:59 is still the final phase.
     */
    end: "2026-12-07T00:00:00",
  },
] as const;

export type PromoPhaseId = (typeof PROMO_PHASES)[number]["id"];

export function promoHref(utmContent: string): string {
  return `https://shop.jankstailoring.com/?utm_source=website&utm_medium=banner&utm_campaign=bf_2026&utm_content=${utmContent}`;
}

/**
 * Blocking inline script. `allowPreview` is baked in at build time from
 * `VERCEL_ENV !== "production"`. Production HTML never reads the query
 * string, so `?banner_preview=` cannot force a phase on the live site.
 */
export function createPromoBannerBootScript(allowPreview: boolean): string {
  const schedule = JSON.stringify(
    PROMO_PHASES.map(({ id, start, end }) => ({ id, start, end }))
  );

  // Only non-production builds consult the query string. The phase list is
  // inlined as JSON from PROMO_PHASES so the script and the links cannot drift.
  const previewBlock = allowPreview
    ? `var requested=new URLSearchParams(location.search).get("banner_preview");
if(requested==="launch"||requested==="midsale"||requested==="final")phase=requested;`
    : "";

  return `(function(){
try{
var phases=${schedule};
var phase=null;
${previewBlock}
if(!phase){
var stamp=londonStamp(new Date());
for(var i=0;i<phases.length;i++){
if(stamp>=phases[i].start&&stamp<phases[i].end){phase=phases[i].id;break;}
}
}
if(phase)document.documentElement.setAttribute("data-promo-banner",phase);
}catch(e){}
function londonStamp(date){
var fmt=new Intl.DateTimeFormat("en-GB",{timeZone:"Europe/London",year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit",hourCycle:"h23"});
var bag={year:"",month:"",day:"",hour:"",minute:"",second:""};
var parts=fmt.formatToParts(date);
for(var i=0;i<parts.length;i++){
if(bag[parts[i].type]!==undefined)bag[parts[i].type]=parts[i].value;
}
var year=bag.year,month=bag.month,day=bag.day,hour=bag.hour;
if(hour==="24"){
hour="00";
var next=new Date(Date.UTC(Number(year),Number(month)-1,Number(day))+86400000);
year=String(next.getUTCFullYear());
month=String(next.getUTCMonth()+1).padStart(2,"0");
day=String(next.getUTCDate()).padStart(2,"0");
}
return year+"-"+month+"-"+day+"T"+hour+":"+bag.minute+":"+bag.second;
}
})();`;
}
