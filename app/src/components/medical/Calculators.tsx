import { useMemo, useState } from "react";
import Callout from "@/components/ui/Callout";

// ════════════════════════════════════════════════════════════════
// Calculadoras médicas — reutilizables entre Trauma y Emergencias.
// Diseño touch-friendly: targets 44px+, sin sliders nativos buggy
// en iOS, todo botones discretos.
// ════════════════════════════════════════════════════════════════

// ── Glasgow ─────────────────────────────────────────────────────
const GLASGOW = {
  ocular: [
    { v: 4, label: "Espontánea" },
    { v: 3, label: "A la voz" },
    { v: 2, label: "Al dolor" },
    { v: 1, label: "Sin respuesta" },
  ],
  verbal: [
    { v: 5, label: "Orientado" },
    { v: 4, label: "Confuso" },
    { v: 3, label: "Palabras inapropiadas" },
    { v: 2, label: "Sonidos incomprensibles" },
    { v: 1, label: "Sin respuesta" },
  ],
  motora: [
    { v: 6, label: "Obedece órdenes" },
    { v: 5, label: "Localiza el dolor" },
    { v: 4, label: "Retira al dolor" },
    { v: 3, label: "Flexión anormal (decort.)" },
    { v: 2, label: "Extensión (descerebración)" },
    { v: 1, label: "Sin respuesta" },
  ],
};

export function GlasgowCalculator() {
  const [o, setO] = useState(4);
  const [v, setV] = useState(5);
  const [m, setM] = useState(6);
  const total = o + v + m;
  const sev = total >= 13 ? "Leve" : total >= 9 ? "Moderado" : "Grave";
  const sevColor = total >= 13 ? "#34d399" : total >= 9 ? "#fbbf24" : "#ef4444";

  return (
    <article className="p-5 rounded-2xl bg-grad-surface border border-white/[0.06]">
      <header className="mb-4 flex items-center justify-between">
        <h3 className="font-display font-bold text-[17px] tracking-tight">Glasgow Coma Scale</h3>
        <div className="text-right">
          <div className="font-mono font-extrabold text-[28px]" style={{ color: sevColor }}>
            {total}<span className="text-[14px] text-ink-dim font-medium">/15</span>
          </div>
          <div className="text-[11px] uppercase tracking-wider font-semibold" style={{ color: sevColor }}>
            {sev}
          </div>
        </div>
      </header>

      <GlasgowGroup title="Apertura ocular (E)" max={4} value={o} setValue={setO} opts={GLASGOW.ocular} />
      <GlasgowGroup title="Respuesta verbal (V)" max={5} value={v} setValue={setV} opts={GLASGOW.verbal} />
      <GlasgowGroup title="Respuesta motora (M)" max={6} value={m} setValue={setM} opts={GLASGOW.motora} />

      <div className="mt-4 text-[12px] text-ink-muted leading-relaxed">
        Severidad: <strong className="text-success">≥13 leve</strong> · <strong className="text-warning">9-12 moderado</strong> · <strong className="text-danger">≤8 grave (intubar)</strong>.
      </div>
    </article>
  );
}

function GlasgowGroup({
  title,
  value,
  setValue,
  opts,
}: {
  title: string;
  max: number;
  value: number;
  setValue: (v: number) => void;
  opts: { v: number; label: string }[];
}) {
  return (
    <div className="mb-4 last:mb-0">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[12px] text-ink-muted font-medium">{title}</span>
        <span className="font-mono font-semibold text-[14px] text-primary-hi">{value}</span>
      </div>
      <div className="grid grid-cols-1 gap-1.5">
        {opts.map((o) => (
          <button
            key={o.v}
            onClick={() => setValue(o.v)}
            className={`flex items-center gap-2 px-3 h-10 rounded-lg text-[13px] text-left transition border min-h-10 ${
              value === o.v
                ? "bg-primary/15 text-ink border-primary-hi/40"
                : "bg-white/[0.02] text-ink-muted border-white/[0.05] hover:bg-white/[0.05]"
            }`}
          >
            <span className="font-mono font-semibold w-5 shrink-0">{o.v}</span>
            <span className="flex-1">{o.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Parkland ────────────────────────────────────────────────────
export function ParklandCalculator() {
  const [peso, setPeso] = useState(70);
  const [scq, setScq] = useState(30);
  const total = useMemo(() => 4 * peso * scq, [peso, scq]);
  const first8 = total / 2;
  const next16 = total / 2;

  return (
    <article className="p-5 rounded-2xl bg-grad-surface border border-white/[0.06]">
      <header className="mb-4">
        <h3 className="font-display font-bold text-[17px] tracking-tight">Parkland — reposición de líquidos</h3>
        <p className="text-[12.5px] text-ink-dim mt-0.5">
          4 mL × peso (kg) × %SCQ. Ringer lactato. 50% en las primeras 8h desde la quemadura, 50% en
          las siguientes 16h.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <NumField label="Peso (kg)" value={peso} setValue={setPeso} min={1} max={250} />
        <NumField label="SCQ (%)" value={scq} setValue={setScq} min={1} max={100} />
      </div>

      <div className="grid grid-cols-3 gap-2">
        <Stat label="Total 24h" value={`${total.toLocaleString()} mL`} accent="#a78bfa" />
        <Stat label="Primeras 8h" value={`${first8.toLocaleString()} mL`} accent="#fbbf24" hint={`${Math.round(first8 / 8).toLocaleString()} mL/h`} />
        <Stat label="Siguientes 16h" value={`${next16.toLocaleString()} mL`} accent="#34d399" hint={`${Math.round(next16 / 16).toLocaleString()} mL/h`} />
      </div>

      <div className="mt-4">
        <Callout tone="yellow">
          Meta diuresis: <strong>adulto 0.5-1 mL/kg/h</strong> · <strong>niño 1-1.5 mL/kg/h</strong> · <strong>eléctrica 1-2 mL/kg/h</strong> (riesgo de rabdomiólisis).
        </Callout>
      </div>
    </article>
  );
}

function NumField({
  label,
  value,
  setValue,
  min,
  max,
}: {
  label: string;
  value: number;
  setValue: (v: number) => void;
  min: number;
  max: number;
}) {
  return (
    <div>
      <label className="text-[11px] uppercase tracking-wider text-ink-dim font-medium block mb-1">{label}</label>
      <div className="flex items-center gap-1 bg-white/[0.04] border border-white/[0.06] rounded-xl p-1">
        <button
          onClick={() => setValue(Math.max(min, value - 1))}
          className="w-10 h-10 rounded-lg bg-white/[0.04] text-ink-muted hover:text-ink hover:bg-white/[0.08] font-bold"
          aria-label={`Reducir ${label}`}
        >
          −
        </button>
        <input
          type="number"
          inputMode="numeric"
          value={value}
          onChange={(e) => {
            const n = Number(e.target.value);
            if (Number.isFinite(n)) setValue(Math.min(max, Math.max(min, n)));
          }}
          className="flex-1 h-10 text-center bg-transparent text-[16px] font-mono font-semibold outline-none"
        />
        <button
          onClick={() => setValue(Math.min(max, value + 1))}
          className="w-10 h-10 rounded-lg bg-white/[0.04] text-ink-muted hover:text-ink hover:bg-white/[0.08] font-bold"
          aria-label={`Aumentar ${label}`}
        >
          +
        </button>
      </div>
    </div>
  );
}

function Stat({ label, value, accent, hint }: { label: string; value: string; accent: string; hint?: string }) {
  return (
    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
      <div className="text-[10px] uppercase tracking-wider text-ink-dim font-medium mb-1">{label}</div>
      <div className="font-display font-bold text-[16px] tracking-tight" style={{ color: accent }}>
        {value}
      </div>
      {hint && <div className="text-[11px] text-ink-muted mt-0.5">{hint}</div>}
    </div>
  );
}

// ── ETT (tubo endotraqueal pediátrico) ──────────────────────────
export function ETTCalculator() {
  const [edad, setEdad] = useState(8);
  // Fórmula clásica: con manguito = (edad/4)+3.5 ; sin manguito = (edad/4)+4
  const conM = (edad / 4 + 3.5).toFixed(1);
  const sinM = (edad / 4 + 4).toFixed(1);
  const prof = (3 * Number(sinM)).toFixed(1);

  return (
    <article className="p-5 rounded-2xl bg-grad-surface border border-white/[0.06]">
      <header className="mb-4">
        <h3 className="font-display font-bold text-[17px] tracking-tight">Tubo endotraqueal — pediátrico</h3>
        <p className="text-[12.5px] text-ink-dim mt-0.5">Fórmula de Cole (años ≥1). Adultos: 7.0-7.5 ♀ / 7.5-8.0 ♂.</p>
      </header>

      <NumField label="Edad (años)" value={edad} setValue={setEdad} min={1} max={18} />

      <div className="grid grid-cols-3 gap-2 mt-4">
        <Stat label="Sin manguito" value={`${sinM} mm`} accent="#60a5fa" />
        <Stat label="Con manguito" value={`${conM} mm`} accent="#a78bfa" />
        <Stat label="Profundidad" value={`${prof} cm`} accent="#34d399" hint="comisura labial" />
      </div>
    </article>
  );
}
