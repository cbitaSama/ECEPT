import { MODULES } from "@/modules/manifest";

// ════════════════════════════════════════════════════════════════
// Índice de búsqueda global — construido lazy en el primer search.
// Indexa diseases (reuma), triadas, vocab terms, labs analytes,
// receptor subtypes, mediadores. Cada entrada apunta al módulo
// correspondiente con un hint visible.
// ════════════════════════════════════════════════════════════════

export interface SearchEntry {
  title: string;
  subtitle?: string;
  module: string;
  moduleSlug: string;
  accent: string;
  href: string;
  haystack: string;
}

let _index: SearchEntry[] | null = null;

export async function getSearchIndex(): Promise<SearchEntry[]> {
  if (_index) return _index;
  const out: SearchEntry[] = [];

  // Carga lazy — no inflar el initial bundle.
  const [reuma, triadas, vocab, labs, receptores, mediadores, inmuno, generalidades, epi, cirugia, emergencias, anatomia] =
    await Promise.all([
      import("@/data/reuma"),
      import("@/data/triadas"),
      import("@/data/vocabulario"),
      import("@/data/labs"),
      import("@/data/receptores"),
      import("@/data/mediadores"),
      import("@/data/inmuno"),
      import("@/data/generalidades"),
      import("@/data/epidemiologia"),
      import("@/data/cirugia"),
      import("@/data/emergencias"),
      import("@/data/anatomia"),
    ]);

  function findMeta(slug: string) {
    return MODULES.find((m) => m.slug === slug)!;
  }

  // ── Módulos en sí (al menos siempre matchean su nombre)
  for (const m of MODULES) {
    out.push({
      title: m.name,
      subtitle: m.tagline,
      module: "Módulo",
      moduleSlug: m.slug,
      accent: m.accent,
      href: `/modulo/${m.slug}`,
      haystack: (m.name + " " + m.tagline + " " + (m.tags || []).join(" ")).toLowerCase(),
    });
  }

  // ── Reuma — diseases
  const reumaMeta = findMeta("reuma");
  for (const d of (reuma as any).RD as any[]) {
    out.push({
      title: d.n,
      subtitle: d.cc?.t,
      module: "Reuma · enfermedad",
      moduleSlug: "reuma",
      accent: reumaMeta.accent,
      href: `/modulo/reuma`,
      haystack: [d.n, d.cc?.t, ...(d.cc?.p || []), ...(d.pe || [])].filter(Boolean).join(" ").toLowerCase(),
    });
  }

  // ── Triadas
  const triadasMeta = findMeta("triadas");
  for (const t of (triadas as any).TR as any[]) {
    out.push({
      title: t.nm,
      subtitle: t.en,
      module: "Tríada",
      moduleSlug: "triadas",
      accent: t.cl || triadasMeta.accent,
      href: "/modulo/triadas",
      haystack: [t.nm, t.en, t.dt, ...(t.cp || [])].filter(Boolean).join(" ").toLowerCase(),
    });
  }

  // ── Vocabulario
  const vocabMeta = findMeta("vocabulario");
  for (const v of (vocab as any).VOCAB_VOC as any[]) {
    out.push({
      title: v.tx,
      subtitle: v.sig,
      module: "Vocabulario",
      moduleSlug: "vocabulario",
      accent: vocabMeta.accent,
      href: "/modulo/vocabulario",
      haystack: [v.tx, v.sig, v.or, ...(v.ej || [])].filter(Boolean).join(" ").toLowerCase(),
    });
  }

  // ── Labs (analitos)
  const labsMeta = findMeta("labs");
  for (const sec of (labs as any).LAB_SECTIONS as any[]) {
    for (const a of sec.analytes || []) {
      out.push({
        title: a.name,
        subtitle: `${sec.label} · ${a.range}`,
        module: "Lab · analito",
        moduleSlug: "labs",
        accent: sec.accent || labsMeta.accent,
        href: "/modulo/labs",
        haystack: [a.name, a.range, a.note, ...(a.up || []), ...(a.down || [])].filter(Boolean).join(" ").toLowerCase(),
      });
    }
  }

  // ── Receptores
  const recMeta = findMeta("receptores");
  for (const f of (receptores as any).RECEPTOR_FAMILIES as any[]) {
    for (const sub of f.receptors || []) {
      out.push({
        title: `${sub.symbol || ""} ${sub.name || ""}`.trim(),
        subtitle: `${f.name || f.n} · ${sub.net || ""}`,
        module: "Receptor",
        moduleSlug: "receptores",
        accent: sub.color || recMeta.accent,
        href: "/modulo/receptores",
        haystack: [sub.name, sub.symbol, f.name, sub.net, sub.clinical, (sub.drugs || []).map((d: any) => d.n).join(" ")].filter(Boolean).join(" ").toLowerCase(),
      });
    }
  }

  // ── Mediadores
  const medMeta = findMeta("mediadores");
  for (const m of ((mediadores as any).MED_LIST as any[]) || []) {
    out.push({
      title: m.n,
      subtitle: m.r,
      module: "Mediador",
      moduleSlug: "mediadores",
      accent: medMeta.accent,
      href: "/modulo/mediadores",
      haystack: [m.n, m.r, m.o, m.f, ...(m.k || [])].filter(Boolean).join(" ").toLowerCase(),
    });
  }

  // ── Inmuno conceptos
  const inmunoMeta = findMeta("inmuno");
  for (const it of (((inmuno as any).INT?.s) || []) as any[]) {
    out.push({
      title: it.t,
      subtitle: it.x,
      module: "Inmuno",
      moduleSlug: "inmuno",
      accent: inmunoMeta.accent,
      href: "/modulo/inmuno",
      haystack: [it.t, it.x, ...(it.p || [])].filter(Boolean).join(" ").toLowerCase(),
    });
  }

  // ── Coagulación
  const genMeta = findMeta("generalidades");
  for (const f of ((generalidades as any).COAG_FACTORES as any[]) || []) {
    out.push({
      title: `Factor ${f.num} · ${f.nombre}`,
      subtitle: f.alt || (f.vk ? "Vitamina K dependiente" : undefined),
      module: "Coagulación",
      moduleSlug: "generalidades",
      accent: genMeta.accent,
      href: "/modulo/generalidades",
      haystack: [f.num, f.nombre, f.alt].filter(Boolean).join(" ").toLowerCase(),
    });
  }

  // ── Epi — estudios/sesgos/medidas
  const epiMeta = findMeta("epidemiologia");
  const epiArrays = [
    { key: "ESTUDIOS", label: "Estudio" },
    { key: "SESGOS", label: "Sesgo" },
    { key: "MEDIDAS_EPI", label: "Medida" },
    { key: "PIRAMIDE", label: "Nivel evidencia" },
  ];
  for (const { key, label } of epiArrays) {
    const arr = (epi as any)[key];
    if (!Array.isArray(arr)) continue;
    for (const it of arr) {
      const title = it.nombre || it.tipo || it.nm || it.name || it.t;
      if (!title) continue;
      out.push({
        title,
        subtitle: it.desc || it.def,
        module: `Epi · ${label.toLowerCase()}`,
        moduleSlug: "epidemiologia",
        accent: epiMeta.accent,
        href: "/modulo/epidemiologia",
        haystack: [title, it.desc, it.def, it.ejemplo].filter(Boolean).join(" ").toLowerCase(),
      });
    }
  }

  // ── Cirugía / Emergencias / Anatomía (titulos para que aparezcan)
  for (const c of ((cirugia as any).ABD_DATA as any[]) || []) {
    out.push({
      title: c.name,
      subtitle: c.def,
      module: "Cirugía",
      moduleSlug: "cirugia",
      accent: c.color || findMeta("cirugia").accent,
      href: "/modulo/cirugia",
      haystack: [c.name, c.def, ...(c.cl || []).map((x: any) => `${x.type} ${x.desc}`)].filter(Boolean).join(" ").toLowerCase(),
    });
  }
  for (const p of ((emergencias as any).QUEM_PASOS as any[]) || []) {
    out.push({
      title: `Paso ${p.n} · ${p.t}`,
      subtitle: p.alerta,
      module: "Emergencias",
      moduleSlug: "emergencias",
      accent: p.col || findMeta("emergencias").accent,
      href: "/modulo/emergencias",
      haystack: [p.t, p.alerta, ...(p.items || [])].filter(Boolean).join(" ").toLowerCase(),
    });
  }
  for (const n of ((anatomia as any).NERVES as any[]) || []) {
    out.push({
      title: n.name,
      subtitle: n.lesion ? `Lesión: ${n.lesion}` : n.nivelShort,
      module: "Par craneal",
      moduleSlug: "anatomia",
      accent: n.color || findMeta("anatomia").accent,
      href: "/modulo/anatomia",
      haystack: [n.name, n.latin, n.funcion, n.lesion, ...(n.tipos || [])].filter(Boolean).join(" ").toLowerCase(),
    });
  }

  _index = out;
  return out;
}

// Función simple de match — soporta tokens separados por espacios.
export function searchInIndex(index: SearchEntry[], q: string): SearchEntry[] {
  const terms = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [];
  return index
    .map((e) => {
      let score = 0;
      for (const t of terms) {
        if (!e.haystack.includes(t)) return null;
        if (e.title.toLowerCase().includes(t)) score += 5;
        else score += 1;
      }
      return { ...e, _score: score };
    })
    .filter((x): x is SearchEntry & { _score: number } => x !== null)
    .sort((a, b) => b._score - a._score)
    .slice(0, 80);
}
