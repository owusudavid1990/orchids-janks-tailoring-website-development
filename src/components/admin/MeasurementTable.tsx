"use client";

import type { MeasurementPoint } from "@/config/measurement-profile";

export interface MeasurementValue {
  body?: number;
  finished?: number;
}

interface Props {
  points: MeasurementPoint[];
  values: Record<string, MeasurementValue>;
  unit: "cm" | "in";
  onChange: (pointId: string, field: "body" | "finished", value: number | undefined) => void;
}

export function MeasurementTable({ points, values, unit, onChange }: Props) {
  return (
    <div className="border border-white/10">
      <div className="grid grid-cols-[1fr_110px_110px] bg-white/[0.03] text-[10px] tracking-[0.12em] uppercase text-white/40">
        <div className="px-4 py-2.5">Body Part</div>
        <div className="px-3 py-2.5 text-center border-l border-white/10">Body ({unit})</div>
        <div className="px-3 py-2.5 text-center border-l border-white/10">Finished ({unit})</div>
      </div>
      <div className="divide-y divide-white/5">
        {points.map((p) => {
          const v = values[p.id] ?? {};
          return (
            <div key={p.id} className="grid grid-cols-[1fr_110px_110px] items-center">
              <div className="px-4 py-2 text-[13px] text-white/75">{p.label}</div>
              <div className="border-l border-white/10">
                <input
                  type="number"
                  inputMode="decimal"
                  step="0.1"
                  value={v.body ?? ""}
                  onChange={(e) => onChange(p.id, "body", e.target.value === "" ? undefined : parseFloat(e.target.value))}
                  placeholder="—"
                  className="w-full bg-transparent text-center text-[13px] text-white px-2 py-2 focus:outline-none focus:bg-white/5 placeholder:text-white/20"
                />
              </div>
              <div className="border-l border-white/10">
                {p.hasFinished ? (
                  <input
                    type="number"
                    inputMode="decimal"
                    step="0.1"
                    value={v.finished ?? ""}
                    onChange={(e) => onChange(p.id, "finished", e.target.value === "" ? undefined : parseFloat(e.target.value))}
                    placeholder="—"
                    className="w-full bg-transparent text-center text-[13px] text-white px-2 py-2 focus:outline-none focus:bg-white/5 placeholder:text-white/20"
                  />
                ) : (
                  <div className="text-center text-white/15 text-[13px] py-2">—</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
