/**
 * ── MEASUREMENT & STYLE PROFILE CONFIGURATION ───────────────────────────────
 *
 * This is the master list of every measurement and style choice captured in
 * a client's profile — transcribed from JANKS's own production order sheet
 * ("Men's Jacket/Trousers Order Form(2025)"), so it matches what a maker
 * actually needs to cut and construct a garment.
 *
 * To change a category name, add or remove an option, or add a new
 * measurement point — edit this file. The admin pages render entirely from
 * what's listed here, so nothing else needs to change.
 *
 * Each style category is a set of lettered options, same as the source
 * sheet (A, B, C…). One is usually marked as the default — the option most
 * clients choose, pre-selected when starting a new profile.
 * ───────────────────────────────────────────────────────────────────────────
 */

export interface StyleOption {
  code: string; // "A", "B", "C"...
  label: string;
  /** Reference illustration from JANKS's production order sheet, where one exists */
  image?: string;
  isDefault?: boolean;
  /** Needs a photo/sketch attached rather than being fully specified by words */
  needsReference?: boolean;
  /** Costs more than the standard price — shown as a note, not hidden */
  extraCharge?: boolean;
}

export interface StyleCategory {
  id: string;
  label: string;
  options: StyleOption[];
}

export interface MeasurementPoint {
  id: string;
  label: string;
  /** Whether this garment's measurement table has a "finished" column too (most do) */
  hasFinished?: boolean;
}

const opts = (raw: string[]): StyleOption[] =>
  raw.map((text) => {
    const m = text.match(/^([A-Z])\s*-\s*(.+)$/);
    const code = m ? m[1] : "A";
    let label = m ? m[2] : text;
    const isDefault = /\(default\)/i.test(label) || /\(Default\s*\)/.test(label);
    const needsReference = /provide pictures|attach pictures?|special design/i.test(label);
    const extraCharge = /extra charge/i.test(label);
    label = label.replace(/\s*\((?:default|Default\s*)\)/i, "").trim();
    return { code, label, ...(isDefault && { isDefault: true }), ...(needsReference && { needsReference: true }), ...(extraCharge && { extraCharge: true }) };
  });

// Reference illustrations, transcribed from JANKS's production order sheet
// (one small line-art icon per option, where the sheet had one). Not every
// option has an illustration — the sheet didn't draw one for all of them.
const OPTION_IMAGES: Record<string, Record<string, Record<string, string>>> = {
 "jacket": {
  "fit": {
   "A": "/style-reference/jacket/fit-A.png",
   "B": "/style-reference/jacket/fit-B.png",
   "C": "/style-reference/jacket/fit-C.png",
   "D": "/style-reference/jacket/fit-D.png"
  },
  "craftsmanship": {
   "A": "/style-reference/jacket/craftsmanship-A.png",
   "B": "/style-reference/jacket/craftsmanship-B.png"
  },
  "liningStyle": {
   "A": "/style-reference/jacket/liningStyle-A.png",
   "B": "/style-reference/jacket/liningStyle-B.png"
  },
  "lapelStyle": {
   "B": "/style-reference/jacket/lapelStyle-B.png",
   "D": "/style-reference/jacket/lapelStyle-D.png",
   "F": "/style-reference/jacket/lapelStyle-F.png",
   "C": "/style-reference/jacket/lapelStyle-C.png",
   "G": "/style-reference/jacket/lapelStyle-G.png"
  },
  "placket": {
   "E": "/style-reference/jacket/placket-E.png",
   "A": "/style-reference/jacket/placket-A.png",
   "B": "/style-reference/jacket/placket-B.png",
   "F": "/style-reference/jacket/placket-F.png",
   "D": "/style-reference/jacket/placket-D.png",
   "C": "/style-reference/jacket/placket-C.png"
  },
  "pickStitching": {
   "A": "/style-reference/jacket/pickStitching-A.png",
   "B": "/style-reference/jacket/pickStitching-B.png"
  },
  "bottom": {
   "A": "/style-reference/jacket/bottom-A.png",
   "C": "/style-reference/jacket/bottom-C.png",
   "B": "/style-reference/jacket/bottom-B.png"
  },
  "vents": {
   "A": "/style-reference/jacket/vents-A.png",
   "B": "/style-reference/jacket/vents-B.png",
   "C": "/style-reference/jacket/vents-C.png",
   "D": "/style-reference/jacket/vents-D.png"
  },
  "sleeveButtonholeStyle": {
   "I": "/style-reference/jacket/sleeveButtonholeStyle-I.png",
   "H": "/style-reference/jacket/sleeveButtonholeStyle-H.png",
   "G": "/style-reference/jacket/sleeveButtonholeStyle-G.png",
   "C": "/style-reference/jacket/sleeveButtonholeStyle-C.png",
   "D": "/style-reference/jacket/sleeveButtonholeStyle-D.png",
   "F": "/style-reference/jacket/sleeveButtonholeStyle-F.png",
   "E": "/style-reference/jacket/sleeveButtonholeStyle-E.png",
   "B": "/style-reference/jacket/sleeveButtonholeStyle-B.png",
   "A": "/style-reference/jacket/sleeveButtonholeStyle-A.png",
   "K": "/style-reference/jacket/sleeveButtonholeStyle-K.png"
  },
  "lapelButtonhole": {
   "A": "/style-reference/jacket/lapelButtonhole-A.png",
   "B": "/style-reference/jacket/lapelButtonhole-B.png",
   "C": "/style-reference/jacket/lapelButtonhole-C.png",
   "D": "/style-reference/jacket/lapelButtonhole-D.png",
   "F": "/style-reference/jacket/lapelButtonhole-F.png",
   "H": "/style-reference/jacket/lapelButtonhole-H.png",
   "G": "/style-reference/jacket/lapelButtonhole-G.png",
   "E": "/style-reference/jacket/lapelButtonhole-E.png"
  },
  "sleeveButtonhole": {
   "A": "/style-reference/jacket/sleeveButtonhole-A.png",
   "B": "/style-reference/jacket/sleeveButtonhole-B.png"
  },
  "placketButtonholes": {
   "A": "/style-reference/jacket/placketButtonholes-A.png",
   "B": "/style-reference/jacket/placketButtonholes-B.png"
  },
  "shoulder": {
   "A": "/style-reference/jacket/shoulder-A.png",
   "B": "/style-reference/jacket/shoulder-B.png",
   "C": "/style-reference/jacket/shoulder-C.png",
   "D": "/style-reference/jacket/shoulder-D.png"
  },
  "tuxedoSatinPosition": {
   "B": "/style-reference/jacket/tuxedoSatinPosition-B.png",
   "C": "/style-reference/jacket/tuxedoSatinPosition-C.png",
   "A": "/style-reference/jacket/tuxedoSatinPosition-A.png",
   "D": "/style-reference/jacket/tuxedoSatinPosition-D.png",
   "F": "/style-reference/jacket/tuxedoSatinPosition-F.png",
   "E": "/style-reference/jacket/tuxedoSatinPosition-E.png"
  },
  "chestPocket": {
   "B": "/style-reference/jacket/chestPocket-B.png",
   "A": "/style-reference/jacket/chestPocket-A.png",
   "C": "/style-reference/jacket/chestPocket-C.png"
  },
  "frontPocket": {
   "G": "/style-reference/jacket/frontPocket-G.png",
   "A": "/style-reference/jacket/frontPocket-A.png",
   "B": "/style-reference/jacket/frontPocket-B.png",
   "C": "/style-reference/jacket/frontPocket-C.png",
   "D": "/style-reference/jacket/frontPocket-D.png",
   "F": "/style-reference/jacket/frontPocket-F.png",
   "I": "/style-reference/jacket/frontPocket-I.png",
   "E": "/style-reference/jacket/frontPocket-E.png"
  },
  "canvasStructure": {
   "A": "/style-reference/jacket/canvasStructure-A.png",
   "B": "/style-reference/jacket/canvasStructure-B.png",
   "C": "/style-reference/jacket/canvasStructure-C.png",
   "D": "/style-reference/jacket/canvasStructure-D.png"
  }
 },
 "trousers": {
  "beltLoops": {
   "A": "/style-reference/trousers/beltLoops-A.png",
   "B": "/style-reference/trousers/beltLoops-B.png",
   "C": "/style-reference/trousers/beltLoops-C.png",
   "D": "/style-reference/trousers/beltLoops-D.png"
  },
  "waistbandStyle": {
   "A": "/style-reference/trousers/waistbandStyle-A.png",
   "B": "/style-reference/trousers/waistbandStyle-B.png",
   "C": "/style-reference/trousers/waistbandStyle-C.png",
   "D": "/style-reference/trousers/waistbandStyle-D.png"
  },
  "waistbandExtension": {
   "A": "/style-reference/trousers/waistbandExtension-A.png",
   "B": "/style-reference/trousers/waistbandExtension-B.png",
   "C": "/style-reference/trousers/waistbandExtension-C.png",
   "D": "/style-reference/trousers/waistbandExtension-D.png"
  },
  "backPockets": {
   "A": "/style-reference/trousers/backPockets-A.png",
   "B": "/style-reference/trousers/backPockets-B.png",
   "C": "/style-reference/trousers/backPockets-C.png",
   "D": "/style-reference/trousers/backPockets-D.png",
   "E": "/style-reference/trousers/backPockets-E.png",
   "F": "/style-reference/trousers/backPockets-F.png",
   "G": "/style-reference/trousers/backPockets-G.png"
  },
  "pantsBottom": {
   "A": "/style-reference/trousers/pantsBottom-A.png",
   "B": "/style-reference/trousers/pantsBottom-B.png",
   "C": "/style-reference/trousers/pantsBottom-C.png",
   "D": "/style-reference/trousers/pantsBottom-D.png",
   "E": "/style-reference/trousers/pantsBottom-E.png"
  },
  "pantsLining": {
   "A": "/style-reference/trousers/pantsLining-A.png",
   "C": "/style-reference/trousers/pantsLining-C.png"
  },
  "pleats": {
   "A": "/style-reference/trousers/pleats-A.png"
  },
  "sidePocket": {
   "D": "/style-reference/trousers/sidePocket-D.png",
   "C": "/style-reference/trousers/sidePocket-C.png",
   "E": "/style-reference/trousers/sidePocket-E.png",
   "A": "/style-reference/trousers/sidePocket-A.png",
   "B": "/style-reference/trousers/sidePocket-B.png",
   "F": "/style-reference/trousers/sidePocket-F.png"
  },
  "watchPocket": {
   "A": "/style-reference/trousers/watchPocket-A.png"
  },
  "tuxedoSatinWaistband": {
   "Y": "/style-reference/trousers/tuxedoSatinWaistband-Y.png"
  },
  "tuxedoSatinTape": {
   "Y": "/style-reference/trousers/tuxedoSatinTape-Y.png"
  },
  "tuxedoAntiSlipTape": {
   "Y": "/style-reference/trousers/tuxedoAntiSlipTape-Y.png"
  }
 },
 "vest": {
  "chestPocket": {
   "B": "/style-reference/vest/chestPocket-B.png"
  },
  "backMaterial": {
   "A": "/style-reference/vest/backMaterial-A.png",
   "B": "/style-reference/vest/backMaterial-B.png"
  },
  "lapelStyle": {
   "A": "/style-reference/vest/lapelStyle-A.png",
   "B": "/style-reference/vest/lapelStyle-B.png",
   "G": "/style-reference/vest/lapelStyle-G.png",
   "H": "/style-reference/vest/lapelStyle-H.png",
   "E": "/style-reference/vest/lapelStyle-E.png",
   "C": "/style-reference/vest/lapelStyle-C.png",
   "D": "/style-reference/vest/lapelStyle-D.png"
  },
  "placket": {
   "A": "/style-reference/vest/placket-A.png",
   "B": "/style-reference/vest/placket-B.png",
   "G": "/style-reference/vest/placket-G.png",
   "F": "/style-reference/vest/placket-F.png"
  },
  "frontPocket": {
   "A": "/style-reference/vest/frontPocket-A.png",
   "B": "/style-reference/vest/frontPocket-B.png",
   "C": "/style-reference/vest/frontPocket-C.png",
   "D": "/style-reference/vest/frontPocket-D.png"
  },
  "vestBottom": {
   "A": "/style-reference/vest/vestBottom-A.png",
   "B": "/style-reference/vest/vestBottom-B.png"
  },
  "backBelt": {
   "A": "/style-reference/vest/backBelt-A.png",
   "B": "/style-reference/vest/backBelt-B.png"
  }
 }
};

/** Attaches each option's reference image, if the source sheet had one. */
function withImages(garment: string, categoryId: string, options: StyleOption[]): StyleOption[] {
  const forCategory = OPTION_IMAGES[garment]?.[categoryId];
  if (!forCategory) return options;
  return options.map((o) => (forCategory[o.code] ? { ...o, image: forCategory[o.code] } : o));
}

// ── JACKET / TUXEDO ─────────────────────────────────────────────────────────

export const JACKET_CATEGORIES: StyleCategory[] = [
  { id: "fit", label: "Fit Requirement", options: withImages("jacket", "fit", opts(["A-Tight Fit", "B-Slim Fit (default)", "C-Regular", "D-Loose"])) },
  { id: "craftsmanship", label: "Craftsmanship", options: withImages("jacket", "craftsmanship", opts(["A-Half Canvas", "B-Full Canvas"])) },
  { id: "liningStyle", label: "Lining Style", options: withImages("jacket", "liningStyle", opts(["A-Fully Lining (default)", "B-Half Lining", "C-No Lining"])) },
  { id: "shoulder", label: "Shoulder", options: withImages("jacket", "shoulder", opts(["A-Standard Padded (default)", "B-Pleated & No Padded", "C-Roped Shoulders", "D-Natural (No Padded & No Pleated)"])) },
  { id: "canvasStructure", label: "Canvas Structure", options: withImages("jacket", "canvasStructure", opts(["A-Normal Canvas", "B-Soft Canvas", "C-Super Soft Canvas", "D-Unstructured (Nothing)"])) },
  {
    id: "lapelStyle", label: "Lapel Style", options: withImages("jacket", "lapelStyle", opts([
      "A-Notch Lapel", "B-Peak Lapel (Classic Slight Curves)", "C-Peak Lapel (No Curve)", "D-Peak Lapel (Wide Curve)",
      "E-Middle Round Shawl Lapel (provide pictures)", "F-Below Round Shawl Lapel (provide pictures)",
      "G-Narrow Shawl Lapel (provide pictures)", "H-Special Design (attach pictures)",
    ])),
  },
  { id: "lapelWidth", label: "Lapel Width", options: withImages("jacket", "lapelWidth", opts(["A-2.8in (7cm)", "B-3in (8cm)", "C-3.5in (9cm)", "D-4in (10cm)", "E-4.3in (11cm)", "F-4.7in (12cm)", "G-5.1in (13cm)"])) },
  { id: "pickStitching", label: "Pick Stitching", options: withImages("jacket", "pickStitching", opts(["A-Tone Fabric Colour (0.15cm)", "B-No Stitching"])) },
  { id: "chestPocket", label: "Chest Pocket", options: withImages("jacket", "chestPocket", opts(["A-Curved (default)", "B-Straight", "C-Patch", "D-No Pocket"])) },
  {
    id: "placket", label: "Placket / Buttoning", options: withImages("jacket", "placket", opts([
      "A-Single 2 Buttons (default)", "B-Single 1 Button", "C-Double Breasted 6 Roll 2 Buttons (mock 2 top buttons)",
      "D-Double Breasted 4 Roll 2 Buttons", "E-Double Breasted 2 Roll 1 Button", "F-Double Breasted 4 Roll 1 Button (mock 2 top buttons)",
      "G-Double Breasted 6 Roll 3 Buttons",
    ])),
  },
  { id: "bottom", label: "Bottom", options: withImages("jacket", "bottom", opts(["A-Standard Rounded Bottom", "B-Squared Bottom", "C-Big Rounded Bottom"])) },
  {
    id: "frontPocket", label: "Front Pocket", options: withImages("jacket", "frontPocket", opts([
      "A-2 Pockets & Flaps", "B-2 Pockets (double piping) & No Flaps", "C-2 Pockets (single piping) & No Flaps",
      "D-3 Pockets (with flaps)", "E-3 Pockets (double piping)", "F-Fashion Patch Pockets", "G-Regular Patch Pockets",
      "H-Accordion Pleats Patch Pockets", "I-2 Patch Pockets & 1 Small Patch Pocket",
    ])),
  },
  // Small secondary category sitting beside Front Pocket on the source sheet
  // (unlabelled there — named for what it actually describes: the pocket
  // flap's edge). Rename here if a clearer name is preferred.
  { id: "pocketFlapEdge", label: "Pocket Flap Edge", options: withImages("jacket", "pocketFlapEdge", opts(["A-Straight (default)", "B-Slanted Pocket (1.5cm)"])) },
  { id: "vents", label: "Vent Options", options: withImages("jacket", "vents", opts(["A-Double Vents", "B-Double Vents + Anti-Fork Belt", "C-No Vent", "D-Single Vent"])) },
  { id: "placketButtonholes", label: "Placket Buttonholes", options: withImages("jacket", "placketButtonholes", opts(["A-Machine Function Buttonholes", "B-Handmade Function Buttonholes (extra charge)"])) },
  {
    id: "sleeveButtonholeStyle", label: "Sleeve Buttonhole Style", options: withImages("jacket", "sleeveButtonholeStyle", opts([
      "A-4 Normal Buttons (default)", "B-4 Stacked Buttons", "C-4 Slanted & Normal Buttons", "D-4 Slanted & Stacked Buttons",
      "E-5 Normal Buttons", "F-5 Stacked Buttons", "G-5 Slanted & Normal Buttons", "H-5 Slanted & Stacked Buttons",
      "I-No Buttons", "J-Turn-up Round (1.8in)", "K-Turn-up Square (1.8in)",
    ])),
  },
  { id: "sleeveButtonhole", label: "Sleeve Buttonhole", options: withImages("jacket", "sleeveButtonhole", opts(["A-Machine Function Buttonhole (default)", "B-Machine Fake Buttonhole", "C-No Buttonhole", "D-Handmade Function Buttonhole (extra charge)"])) },
  {
    id: "lapelButtonhole", label: "Lapel Buttonhole (left)", options: withImages("jacket", "lapelButtonhole", opts([
      "A-Machine Function Buttonhole (default)", "B-Machine Fake Buttonhole", "C-No Buttonhole", "D-Handmade Function Buttonhole (extra charge)",
      "E-05 Handmade Milanese (extra charge)", "F-06 Handmade Milanese (extra charge)", "G-10 Handmade Milanese (extra charge)",
      "H-08 Handmade Milanese (extra charge)", "I-02 Handmade Milanese (extra charge)", "J-01 Handmade Milanese (extra charge)",
    ])),
  },
  { id: "tuxedoSatinPosition", label: "Tuxedo Satin Position", options: withImages("jacket", "tuxedoSatinPosition", opts(["A-Lapel", "B-Lapel + Pocket Piping", "C-Lapel + Pocket Piping + Chest Pocket", "D-Collar + Lapel", "E-Collar + Lapel + Pocket Piping", "F-Collar + Lapel + Chest Pocket + Pocket Piping"])) },
  { id: "sweatPads", label: "Sweat Pads", options: [{ code: "Y", label: "Yes" }, { code: "N", label: "No" }] },
];

export const JACKET_MEASUREMENTS: MeasurementPoint[] = [
  { id: "frontLength", label: "Front Length", hasFinished: true },
  { id: "backLength", label: "Back Length", hasFinished: true },
  { id: "fullShoulder", label: "Full Shoulder", hasFinished: true },
  { id: "sleeveLength", label: "Sleeve Length", hasFinished: true },
  { id: "chest", label: "Chest", hasFinished: true },
  { id: "stomach", label: "Stomach (Thinnest)", hasFinished: true },
  { id: "belly", label: "Belly (Fullest)", hasFinished: true },
  { id: "hips", label: "Hips (Fullest)", hasFinished: true },
  { id: "biceps", label: "Biceps (Relaxed)", hasFinished: true },
  { id: "wrist", label: "Wrist", hasFinished: true },
  { id: "neck", label: "Neck", hasFinished: true },
];

// ── TROUSERS ─────────────────────────────────────────────────────────────────

export const TROUSER_CATEGORIES: StyleCategory[] = [
  { id: "sidePocket", label: "Side Pocket Style", options: withImages("trousers", "sidePocket", opts(["A-Slant Pockets (default)", "B-Slant Pockets + Inside Phone Pocket", "C-Side Pocket (double piping)", "D-Side Pocket (single piping)", "E-Side Pocket (seam)", "F-Jeans Pockets"])) },
  { id: "pleats", label: "Pleats", options: withImages("trousers", "pleats", opts(["A-No Pleats (default)", "B-Single Pleats (outward)", "C-Double Pleats (outward)", "D-Point Pleats (face to face)"])) },
  { id: "waistbandStyle", label: "Waistband Style", options: withImages("trousers", "waistbandStyle", opts(["A-Sharp Waistband Extension", "B-Square Waistband Extension", "C-Rounded Waistband Extension", "D-No Waistband Extension"])) },
  { id: "waistbandExtension", label: "Waistband Extension", options: withImages("trousers", "waistbandExtension", opts(["A-Belt Loops (default)", "B-Side Adjusters 1.6in (4cm)", "C-Side Adjusters 2in (5.5cm)", "D-Gurkha Waist 2in (5.5cm)", "E-Special Design (attach pictures)"])) },
  { id: "beltLoops", label: "Belt Loops", options: withImages("trousers", "beltLoops", opts(["A-6 Belt Loops (default)", "B-8 Belt Loops", "C-No Belt Loops", "D-1 Belt Loop"])) },
  { id: "watchPocket", label: "Watch Pocket", options: withImages("trousers", "watchPocket", opts(["A-No Watch Pocket", "B-Watch Pocket With Curved Flap"])) },
  { id: "pantsLining", label: "Pants Lining", options: withImages("trousers", "pantsLining", opts(["A-Front Half Lining (default)", "B-Front & Back Half Lining", "C-Full Lining", "D-No Lining"])) },
  {
    id: "backPockets", label: "Back Pockets", options: withImages("trousers", "backPockets", opts([
      "A-Double Piping Pockets + Buttonholes + Buttons (default)", "B-Single Piping Pocket + Buttonhole + Button",
      "C-Double Piping Pockets (no buttons)", "D-Single Piping Pocket (no buttons)",
      "E-Double Piping Pockets + Peach Pockets + Buttonholes + Buttons",
      "F-Right Double Pocket + Peach Flap, No Left Pocket", "G-Left Double Pocket + Peach Flap, No Right Pocket",
    ])),
  },
  { id: "pantsBottom", label: "Pants Bottom", options: withImages("trousers", "pantsBottom", opts(["A-Inner Hem 6cm (default)", "B-Pant Cuffs 4cm", "C-Pant Cuffs 5cm", "D-Horseshoe Cuffs", "E-Unfinished Cuffs"])) },
  { id: "suspendersInside", label: "Suspenders Inside", options: [{ code: "Y", label: "Yes" }, { code: "N", label: "No" }] },
  { id: "sideAdjusters", label: "Side Adjusters", options: [{ code: "Y", label: "Yes" }, { code: "N", label: "No" }] },
  { id: "tuxedoSatinWaistband", label: "Tuxedo: Satin Waistband", options: withImages("trousers", "tuxedoSatinWaistband", [{ code: "Y", label: "Yes (specify colour in notes)" }, { code: "N", label: "No" }]) },
  { id: "tuxedoSatinTape", label: "Tuxedo: Satin Side Tape (1.5cm)", options: withImages("trousers", "tuxedoSatinTape", [{ code: "Y", label: "Yes (specify colour in notes)" }, { code: "N", label: "No" }]) },
  { id: "tuxedoAntiSlipTape", label: "Tuxedo: Anti-Slip Tape", options: withImages("trousers", "tuxedoAntiSlipTape", [{ code: "Y", label: "Yes - Black" }, { code: "N", label: "No" }]) },
];

export const PANTS_MEASUREMENTS: MeasurementPoint[] = [
  { id: "outseam", label: "Pant Length (Outseam)", hasFinished: true },
  { id: "waist", label: "Waist", hasFinished: true },
  { id: "hips", label: "Hips (Fullest)", hasFinished: true },
  { id: "thigh", label: "Thigh (Fullest)", hasFinished: true },
  { id: "crotch", label: "Crotch", hasFinished: true },
  { id: "knee", label: "Knee", hasFinished: true },
  { id: "calf", label: "Calf (Fullest)", hasFinished: true },
  { id: "cuff", label: "Cuff (Ankle)", hasFinished: true },
];

// ── VEST / WAISTCOAT ─────────────────────────────────────────────────────────

export const VEST_CATEGORIES: StyleCategory[] = [
  {
    id: "lapelStyle", label: "Lapel Style", options: withImages("vest", "lapelStyle", opts([
      "A-\"V\"", "B-\"U\"", "C-Middle Shawl Lapel", "D-Big Shawl Lapel", "E-Point Shawl Lapel",
      "F-Notch Lapel", "G-Peak Lapel", "H-Shawl Lapel with \"U\"", "I-Special Design (attach pictures)",
    ])),
  },
  { id: "chestPocket", label: "Chest Pocket", options: withImages("vest", "chestPocket", opts(["A-No Pocket", "B-Straight Pocket"])) },
  {
    id: "placket", label: "Placket Options", options: withImages("vest", "placket", opts([
      "A-Single Breasted 3 Buttons", "B-Single Breasted 4 Buttons", "C-Single Breasted 5 Buttons", "D-Single Breasted 6 Buttons",
      "E-Double Breasted 6 Buttons", "F-Double Breasted 6 Buttons with Slant Placket", "G-Double Breasted 5 Buttons",
      "H-Special Design (attach pictures)",
    ])),
  },
  { id: "frontPocket", label: "Front Pocket", options: withImages("vest", "frontPocket", opts(["A-Single Piping Pocket (2.5cm)", "B-Double Piping Pockets (0.5cm)", "C-Patch Pockets", "D-Pockets & Flaps", "E-No Pockets"])) },
  { id: "vestBottom", label: "Vest Bottom", options: withImages("vest", "vestBottom", opts(["A-Sharp Bottom", "B-Straight Bottom", "E-Special Design (attach pictures)"])) },
  { id: "backMaterial", label: "Back Material", options: withImages("vest", "backMaterial", opts(["A-Same as Lining", "B-Fabric Back"])) },
  { id: "backBelt", label: "Back Belt", options: withImages("vest", "backBelt", opts(["A-Belt (default)", "B-No Belt"])) },
];

export const VEST_MEASUREMENTS: MeasurementPoint[] = [
  { id: "chest", label: "Chest", hasFinished: true },
  { id: "stomach", label: "Stomach (Thinnest)", hasFinished: true },
  { id: "belly", label: "Belly (Fullest)", hasFinished: true },
  { id: "bottom", label: "Bottom", hasFinished: true },
];

// ── BODY SHAPE ───────────────────────────────────────────────────────────────
// Transcribed from the hidden "BS" reference sheet, which held the full
// dropdown for each part (this sheet has no reference photos, unlike the
// garment sections, so these options render as plain letter badges).
//
// The same sheet also has a second table — 42 numeric pattern-adjustment
// increments in centimetres, for the person cutting the pattern rather than
// the client (e.g. "Back neck scoop: -0.3cm … -1.2cm"). That's a different,
// more technical thing and isn't included here.
//
// Reuses StyleCategory/opts() so each part can go through the same
// interactive StylePicker as the garment style choices.

export const BODY_SHAPE_PARTS: StyleCategory[] = [
  { id: "build", label: "Body Shape", options: opts(["A-Unsure", "B-Regular", "C-Athletic", "D-Slightly Fat", "E-Very Fat", "F-Super Fat", "G-Slightly Thin", "H-Super Thin"]) },
  { id: "posture", label: "Posture", options: opts(["A-Unsure", "B-Regular", "C-Slightly Forward", "D-Very Forward", "E-Slightly Backward", "F-Very Backward"]) },
  { id: "head", label: "Head", options: opts(["A-Unsure", "B-Regular", "C-Slightly Forward", "D-Very Forward", "E-Slightly Backward", "F-Very Backward"]) },
  { id: "neck", label: "Neck", options: opts(["A-Unsure", "B-Regular", "C-Slightly Thick", "D-Very Thick", "E-Slightly Thin", "F-Very Thin"]) },
  { id: "leftShoulder", label: "Left Shoulder", options: opts(["A-Unsure", "B-Regular", "C-Slightly Sloping", "D-Normal Sloping", "E-Very Sloping", "F-Slightly Square", "G-Square", "H-Very High Square"]) },
  { id: "rightShoulder", label: "Right Shoulder", options: opts(["A-Unsure", "B-Regular", "C-Slightly Sloping", "D-Normal Sloping", "E-Very Sloping", "F-Slightly Square", "G-Square", "H-Very High Square"]) },
  // Source sheet has a typo here — the last option is lettered "F" a second
  // time (should be H). Corrected below so every option has a unique code.
  { id: "forwardShoulder", label: "Forward Shoulder", options: opts(["A-Unsure", "B-Regular", "C-Slightly Forward", "D-Normal Forward", "E-Very Forward", "F-Slightly Backward", "G-Normal Backward", "H-Very Backward"]) },
  { id: "armForwardBackward", label: "Arm Forward / Backward", options: opts(["A-Unsure", "B-Regular", "C-Slightly Backward", "D-Normal Backward", "E-Very Backward", "F-Slightly Forward", "G-Normal Forward", "H-Very Forward"]) },
  { id: "chest", label: "Chest", options: opts(["A-Unsure", "B-Regular", "C-Athletic", "D-Super Athletic", "E-Slightly Outward", "F-Very Outward", "G-Slightly Concave Chest", "H-Very Concave Chest"]) },
  { id: "hunchback", label: "Hunchback", options: opts(["A-Unsure", "B-Regular", "C-Slightly Hunched", "D-Super Hunched"]) },
  { id: "roundConcaveBack", label: "Round / Concave Back", options: opts(["A-Unsure", "B-Regular", "C-Slightly Round Back", "D-Super Round Back", "E-Slightly Concave Back", "F-Super Concave Back"]) },
  { id: "shoulderBladeLeft", label: "Shoulder Blade (Left)", options: opts(["A-Unsure", "B-Regular", "C-Slightly Convex Scapula", "D-Very Convex Scapula"]) },
  { id: "shoulderBladeRight", label: "Shoulder Blade (Right)", options: opts(["A-Unsure", "B-Regular", "C-Slightly Convex Scapula", "D-Very Convex Scapula"]) },
  { id: "stomach", label: "Stomach", options: opts(["A-Unsure", "B-Regular", "C-Slightly Big Belly", "D-Big Belly", "E-Super Big Belly"]) },
  { id: "concaveBackWaist", label: "Concave Back Waist", options: opts(["A-Unsure", "B-Regular", "C-Slightly Concave Back Waist", "D-Concave Back Waist", "E-Very Concave Back Waist"]) },
  { id: "hips", label: "Hips", options: opts(["A-Unsure", "B-Regular", "C-Slightly Upturned Hips", "D-Very Upturned Hips", "E-Slightly Low Hips", "F-Very Low Hips", "G-Slightly Flat", "H-Very Flat"]) },
  { id: "armholeDepth", label: "Armhole Depth", options: opts(["A-Unsure", "B-Regular", "C-Up 0.3cm", "D-Up 0.6cm", "E-Up 0.8cm", "F-Up 1cm", "G-Up 1.2cm", "H-Up 1.4cm", "I-Up 1.8cm", "J-Down 0.3cm", "K-Down 0.6cm", "L-Down 1cm", "M-Down 1.2cm", "N-Down 1.4cm", "O-Down 1.8cm"]) },
  { id: "thigh", label: "Thigh", options: opts(["A-Unsure", "B-Regular", "C-Slightly Thick", "D-Very Thick", "E-Slightly Thin", "F-Very Thin"]) },
];

// ── MONOGRAM / EMBROIDERY ─────────────────────────────────────────────────────

export const EMBROIDERY_POSITIONS = ["Inside left pocket", "Cuff", "Under collar", "Other (specify in notes)"];

// ── GARMENT TABS ─────────────────────────────────────────────────────────────

export const GARMENTS = [
  { id: "jacket", label: "Jacket / Tuxedo", categories: JACKET_CATEGORIES, measurements: JACKET_MEASUREMENTS },
  { id: "trousers", label: "Trousers", categories: TROUSER_CATEGORIES, measurements: PANTS_MEASUREMENTS },
  { id: "vest", label: "Vest / Waistcoat", categories: VEST_CATEGORIES, measurements: VEST_MEASUREMENTS },
] as const;

export type GarmentId = (typeof GARMENTS)[number]["id"];
