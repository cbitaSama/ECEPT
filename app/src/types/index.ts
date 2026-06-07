// ════════════════════════════════════════════════════════════════
// ECEPT — schemas de contenido médico
// ════════════════════════════════════════════════════════════════
// Espejo 1:1 de las shapes documentadas en el system prompt del proyecto.
// Los nombres cortos (n, cc, dx, ex, tx, px, pe, qz) se mantienen para no
// reescribir la data; toda la app trabaja con estos tipos.
// ════════════════════════════════════════════════════════════════

/** Sub-sección dentro de una enfermedad: clínica, dx, exámenes, etc. */
export type SectionKey = "cc" | "dx" | "ex" | "tx" | "px" | "pe";

/** Cuadro clínico — título + puntos clave. */
export interface CuadroClinico {
  t: string;
  p: string[];
}

/** Bloque de diagnóstico: criterios + diferenciales + nota. */
export interface Diagnostico {
  cr: { c: string; d: string }[];
  df: string[];
  nt?: string;
}

/** Exámenes complementarios — laboratorio + imagen. */
export interface Examenes {
  l: string[];
  im: string;
}

/** Tratamiento por escalones. */
export interface Tratamiento {
  p: string;
  q: string;
  b: string;
  m: string;
}

/** Pronóstico — evolución, factores, complicaciones. */
export interface Pronostico {
  e: string;
  f: string[];
  co: string[];
}

/** Pregunta del pool de quiz por enfermedad. */
export interface QuizItem {
  p: string;
  o: string[];
  r: number;
  x: string;
}

/** Enfermedad — unidad atómica de los módulos clínicos (reuma, etc.). */
export interface Disease {
  id: string;
  n: string;
  s: string; // sección
  cc: CuadroClinico;
  dx: Diagnostico;
  ex: Examenes;
  tx: Tratamiento;
  px: Pronostico;
  pe: string[];
  qz: QuizItem[];
}

/** Sección dentro de un módulo (agrupa enfermedades por tema). */
export interface ModuleSection {
  id: string;
  n: string;
  i: string;
  d: string;
}

/** Triada / pirámide diagnóstica. */
export interface Triada {
  ct: string;
  nm: string;
  en: string;
  cp: string[];
  cl: string;
  ic: string;
  dt: string;
}

/** Analito de laboratorio. */
export interface LabAnalyte {
  name: string;
  range: string;
  note?: string;
  up?: string[];
  down?: string[];
}

/** Bloque de Labs (grupo de analitos). */
export interface LabBloque {
  id: string;
  label: string;
  icon: string;
  accent: string;
  subtitle: string;
  analytes: LabAnalyte[];
}

/** Bloque trauma — los 11 tipos definidos. */
export type TraumaBlock =
  | { type: "parrafo"; texto: string }
  | { type: "subtitulo"; texto: string }
  | { type: "lista"; items: string[]; ordered?: boolean }
  | { type: "tabla"; headers: string[]; rows: string[][]; hi?: number[]; compact?: boolean }
  | { type: "callout"; tone: string; title?: string; intro?: string; texto?: string; items?: string[] }
  | { type: "pearl"; texto: string }
  | { type: "danger"; texto: string }
  | { type: "trap"; texto: string }
  | { type: "kv"; items: { k: string; v: string }[] }
  | { type: "cards"; layout: string; items: any[] }
  | { type: "widget"; name: string }
  | { type: "link"; to: string; label: string };

/** Entrada del vocabulario. */
export interface VocabEntry {
  cat: string;
  t: "p" | "s" | "w"; // prefijo / sufijo / palabra
  tx: string;
  or: string;
  sig: string;
  ej: string[];
  tip?: string;
  piece?: string;
}

/** Manifiesto de módulo para el shell. */
export interface ModuleManifest {
  id: string;
  /** Slug en la URL: /modulo/<slug> */
  slug: string;
  /** Nombre humano en Latam Spanish */
  name: string;
  /** Resumen corto (1 frase) que se muestra en la tarjeta del home */
  tagline: string;
  /** Emoji icónico (se usa como avatar de la tarjeta) */
  icon: string;
  /** Acento de color de marca para el módulo (token o hex) */
  accent: string;
  /** Tags de búsqueda */
  tags: string[];
  /** Etiqueta de scope: clinico | basico | herramienta */
  kind: "clinico" | "basico" | "herramienta";
}
