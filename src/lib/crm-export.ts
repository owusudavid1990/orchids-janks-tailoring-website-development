/**
 * Builds Excel workbooks from client and profile data — the CRM's data
 * going back out to the format it originated from, so a profile can be
 * printed, emailed to a maker, or filed exactly as JANKS's own order sheet
 * always worked.
 */

import ExcelJS from "exceljs";
import { GARMENTS, BODY_SHAPE_PARTS, type StyleCategory } from "@/config/measurement-profile";
import type { ProfileData } from "@/lib/profile-data";
import type { ClientRecord } from "@/lib/crm-store";

const GOLD = "FFC9A962";
const CHARCOAL = "FF1A1A1A";
const CREAM = "FFFAF9F7";
const LIGHT_GREY = "FFF2F0EB";

function findLabel(category: StyleCategory, code: string | undefined): string {
  if (!code) return "";
  return category.options.find((o) => o.code === code)?.label ?? code;
}

/** Header band used at the top of every sheet — JANKS letterhead in miniature. */
function addLetterhead(ws: ExcelJS.Worksheet, title: string, subtitle: string, lastCol: string) {
  ws.mergeCells(`A1:${lastCol}1`);
  const t = ws.getCell("A1");
  t.value = "JANKS TAILORING";
  t.font = { name: "Georgia", size: 16, bold: true, color: { argb: CHARCOAL } };
  t.alignment = { vertical: "middle" };
  ws.getRow(1).height = 26;

  ws.mergeCells(`A2:${lastCol}2`);
  const s = ws.getCell("A2");
  s.value = "Confidence In Gentility · London · jankstailoring@gmail.com";
  s.font = { size: 9, italic: true, color: { argb: "FF6B6B6B" } };

  ws.mergeCells(`A4:${lastCol}4`);
  const h = ws.getCell("A4");
  h.value = title;
  h.font = { name: "Georgia", size: 14, bold: true, color: { argb: CHARCOAL } };
  ws.getRow(4).height = 22;

  if (subtitle) {
    ws.mergeCells(`A5:${lastCol}5`);
    const sub = ws.getCell("A5");
    sub.value = subtitle;
    sub.font = { size: 10, color: { argb: "FF6B6B6B" } };
  }
}

function sectionHeader(ws: ExcelJS.Worksheet, text: string, lastCol: string) {
  const row = ws.addRow([text]);
  ws.mergeCells(`A${row.number}:${lastCol}${row.number}`);
  row.font = { bold: true, size: 12, color: { argb: "FFFFFFFF" } };
  row.getCell(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: CHARCOAL } };
  row.height = 20;
  row.alignment = { vertical: "middle" };
  return row;
}

function tableHeaderRow(ws: ExcelJS.Worksheet, cells: string[]) {
  const row = ws.addRow(cells);
  row.eachCell((cell) => {
    cell.font = { bold: true, size: 10, color: { argb: CHARCOAL } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: LIGHT_GREY } };
    cell.border = { bottom: { style: "thin", color: { argb: "FFD0CCC0" } } };
  });
  return row;
}

// ── Single client: full profile as an order sheet ───────────────────────────

export async function buildClientWorkbook(
  client: ClientRecord,
  profile: ProfileData,
  updatedAt: string
): Promise<ExcelJS.Buffer> {
  const wb = new ExcelJS.Workbook();
  wb.creator = "JANKS Tailoring";
  wb.created = new Date();

  const ws = wb.addWorksheet("Order", { properties: { defaultColWidth: 16 } });
  ws.columns = [{ width: 30 }, { width: 16 }, { width: 16 }, { width: 4 }, { width: 30 }, { width: 16 }, { width: 16 }];

  const clientName = `${client.first_name} ${client.last_name ?? ""}`.trim();
  addLetterhead(ws, "Bespoke Order — Measurements & Style", clientName, "G");
  ws.addRow([]);

  // Client details
  sectionHeader(ws, "Client Details", "G");
  const details: [string, string][] = [
    ["Name", clientName],
    ["Email", client.email ?? "—"],
    ["Phone", client.phone ?? "—"],
    ["Height", client.height_cm ? `${client.height_cm} cm` : "—"],
    ["Weight", client.weight_kg ? `${client.weight_kg} kg` : "—"],
    ["Unit used in this profile", profile.unit === "cm" ? "Centimetres" : "Inches"],
    ["Profile last updated", new Date(updatedAt).toLocaleString("en-GB")],
  ];
  for (const [label, value] of details) {
    const row = ws.addRow([label, value]);
    row.getCell(1).font = { bold: true, size: 10, color: { argb: "FF6B6B6B" } };
    row.getCell(2).font = { size: 10 };
  }
  ws.addRow([]);

  // Each garment: measurements table, then style choices table
  for (const garment of GARMENTS) {
    const gdata = profile[garment.id];
    const hasAnything =
      Object.keys(gdata.style).length > 0 || Object.keys(gdata.measurements).length > 0;

    sectionHeader(ws, garment.label.toUpperCase(), "G");

    if (!hasAnything) {
      const row = ws.addRow(["Not started"]);
      row.getCell(1).font = { italic: true, size: 10, color: { argb: "FF999999" } };
      ws.addRow([]);
      continue;
    }

    // Measurements, two garments side by side isn't necessary here — full width
    const measured = garment.measurements.filter((m) => gdata.measurements[m.id]?.body != null || gdata.measurements[m.id]?.finished != null);
    if (measured.length > 0) {
      const hdr = tableHeaderRow(ws, ["Measurement", `Body (${profile.unit})`, `Finished (${profile.unit})`]);
      hdr.getCell(4).value = null;
      for (const m of measured) {
        const v = gdata.measurements[m.id] ?? {};
        ws.addRow([m.label, v.body ?? "", m.hasFinished ? v.finished ?? "" : "—"]);
      }
      ws.addRow([]);
    }

    // Style choices
    const chosen = garment.categories.filter((c) => gdata.style[c.id]);
    if (chosen.length > 0) {
      const hdr = tableHeaderRow(ws, ["Style Choice", "Selection"]);
      hdr.getCell(3).value = null;
      for (const cat of chosen) {
        const code = gdata.style[cat.id];
        ws.addRow([cat.label, `${code} — ${findLabel(cat, code)}`]);
      }
      ws.addRow([]);
    }
  }

  // Embroidery
  if (profile.embroidery.enabled) {
    sectionHeader(ws, "MONOGRAM / EMBROIDERY", "G");
    ws.addRow(["Words", profile.embroidery.words || "—"]);
    ws.addRow(["Position", profile.embroidery.position || "—"]);
    ws.addRow(["Colour", profile.embroidery.color || "—"]);
    ws.addRow(["Font", profile.embroidery.font || "—"]);
    ws.addRow([]);
  }

  // Body shape
  const shapeNotes = BODY_SHAPE_PARTS.filter((p) => profile.bodyShape[p.id]);
  if (shapeNotes.length > 0) {
    sectionHeader(ws, "BODY SHAPE", "G");
    const hdr = tableHeaderRow(ws, ["Area", "Description"]);
    hdr.getCell(3).value = null;
    for (const part of shapeNotes) {
      const code = profile.bodyShape[part.id];
      ws.addRow([part.label, `${code} — ${findLabel(part, code)}`]);
    }
    ws.addRow([]);
  }

  // Special requirements
  if (profile.specialRequirements?.trim()) {
    sectionHeader(ws, "SPECIAL REQUIREMENTS", "G");
    const row = ws.addRow([profile.specialRequirements]);
    ws.mergeCells(`A${row.number}:G${row.number}`);
    row.getCell(1).alignment = { wrapText: true, vertical: "top" };
    row.height = Math.max(20, Math.ceil(profile.specialRequirements.length / 90) * 15);
    ws.addRow([]);
  }

  ws.addRow([]);
  const footer = ws.addRow(["JANKS TAILORING LTD · Registered in England and Wales · Company No. 16870658"]);
  ws.mergeCells(`A${footer.number}:G${footer.number}`);
  footer.font = { size: 8, color: { argb: "FF999999" } };

  return wb.xlsx.writeBuffer();
}

// ── All clients: one row per client, for a quick overview ──────────────────

export interface ClientListRow {
  client: ClientRecord;
  profileUpdatedAt: string | null;
  jacketFields: number;
  trousersFields: number;
  vestFields: number;
}

export async function buildClientsListWorkbook(rows: ClientListRow[]): Promise<ExcelJS.Buffer> {
  const wb = new ExcelJS.Workbook();
  wb.creator = "JANKS Tailoring";
  wb.created = new Date();

  const ws = wb.addWorksheet("Clients");
  ws.columns = [
    { header: "First Name", key: "first", width: 16 },
    { header: "Last Name", key: "last", width: 16 },
    { header: "Email", key: "email", width: 26 },
    { header: "Phone", key: "phone", width: 16 },
    { header: "Height (cm)", key: "height", width: 12 },
    { header: "Weight (kg)", key: "weight", width: 12 },
    { header: "Jacket Fields Set", key: "jacket", width: 15 },
    { header: "Trousers Fields Set", key: "trousers", width: 16 },
    { header: "Vest Fields Set", key: "vest", width: 13 },
    { header: "Profile Last Saved", key: "updated", width: 20 },
    { header: "Client Since", key: "created", width: 18 },
  ];
  ws.getRow(1).eachCell((cell) => {
    cell.font = { bold: true, size: 10, color: { argb: "FFFFFFFF" } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: CHARCOAL } };
  });
  ws.getRow(1).height = 20;

  for (const r of rows) {
    ws.addRow({
      first: r.client.first_name,
      last: r.client.last_name ?? "",
      email: r.client.email ?? "",
      phone: r.client.phone ?? "",
      height: r.client.height_cm ?? "",
      weight: r.client.weight_kg ?? "",
      jacket: r.jacketFields,
      trousers: r.trousersFields,
      vest: r.vestFields,
      updated: r.profileUpdatedAt ? new Date(r.profileUpdatedAt).toLocaleDateString("en-GB") : "No profile saved",
      created: new Date(r.client.created_at).toLocaleDateString("en-GB"),
    });
  }

  ws.autoFilter = { from: "A1", to: `K${rows.length + 1}` };
  return wb.xlsx.writeBuffer();
}
