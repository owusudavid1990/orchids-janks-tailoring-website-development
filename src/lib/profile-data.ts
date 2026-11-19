/**
 * The shape of a saved measurement profile — shared between the client
 * editor page (which writes it) and the Excel export (which reads it), so
 * the two can never drift apart. This is exactly what's stored in
 * crm_profile_versions.data.
 */

export interface MeasurementValue {
  body?: number;
  finished?: number;
}

export interface GarmentData {
  style: Record<string, string>;
  measurements: Record<string, MeasurementValue>;
}

export interface ProfileData {
  unit: "cm" | "in";
  jacket: GarmentData;
  trousers: GarmentData;
  vest: GarmentData;
  bodyShape: Record<string, string>;
  embroidery: { enabled: boolean; words: string; position: string; font: string; color: string };
  specialRequirements: string;
}

export const emptyGarment = (): GarmentData => ({ style: {}, measurements: {} });

export const emptyProfile = (): ProfileData => ({
  unit: "cm",
  jacket: emptyGarment(),
  trousers: emptyGarment(),
  vest: emptyGarment(),
  bodyShape: {},
  embroidery: { enabled: false, words: "", position: "", font: "", color: "" },
  specialRequirements: "",
});

/** Fills in any garment/embroidery keys missing from a partial saved profile. */
export function normaliseProfile(partial: Partial<ProfileData> | null | undefined): ProfileData {
  const base = emptyProfile();
  if (!partial) return base;
  return {
    ...base,
    ...partial,
    jacket: { ...emptyGarment(), ...partial.jacket },
    trousers: { ...emptyGarment(), ...partial.trousers },
    vest: { ...emptyGarment(), ...partial.vest },
    embroidery: { ...base.embroidery, ...partial.embroidery },
  };
}
