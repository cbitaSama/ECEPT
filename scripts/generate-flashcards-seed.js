#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────
// scripts/generate-flashcards-seed.js
//
// Generates seed SQL for official Salud Mental II flashcard data.
// Reads source files via Node vm (no browser needed, no npm deps).
// UUIDs are deterministic (UUID v5) — re-running yields identical IDs.
//
// Output : scripts/seed-flashcards.sql  (DO NOT commit this file)
// Usage  : node scripts/generate-flashcards-seed.js
// ─────────────────────────────────────────────────────────────
'use strict';

const path   = require('path');
const fs     = require('fs');
const vm     = require('vm');
const crypto = require('crypto');

// ── UUID v5 (RFC 4122, no external deps) ─────────────────────

const UUID_DNS = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';

function uuidToBytes(str) {
  const hex = str.replace(/-/g, '');
  const b = Buffer.alloc(16);
  for (let i = 0; i < 16; i++) b[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  return b;
}

function bytesToUuid(b) {
  const h = b.toString('hex');
  return `${h.slice(0,8)}-${h.slice(8,12)}-${h.slice(12,16)}-${h.slice(16,20)}-${h.slice(20,32)}`;
}

function uuidv5(namespace, name) {
  const ns   = uuidToBytes(namespace);
  const data = Buffer.from(name, 'utf8');
  const hash = crypto.createHash('sha1').update(Buffer.concat([ns, data])).digest();
  hash[6] = (hash[6] & 0x0f) | 0x50; // version 5
  hash[8] = (hash[8] & 0x3f) | 0x80; // variant RFC 4122
  return bytesToUuid(hash.slice(0, 16));
}

// Stable project-level namespace (derived from DNS namespace)
const ECEPT_NS = uuidv5(UUID_DNS, 'ecept.salud-mental.v1');

// ── Load source files via vm ──────────────────────────────────
//
// The source files are plain ES5 — they just define globals and
// reference each other. We evaluate them in a shared vm context
// so that C (palette) is visible when DECKS is evaluated, and
// DECKS is visible when EXTRA_CARDS is evaluated.

const SM_DIR = path.join(__dirname, '..', 'src', 'components', 'salud_mental');

function evalFile(file, ctx) {
  const filePath = path.join(SM_DIR, file);
  const code     = fs.readFileSync(filePath, 'utf8');
  try {
    vm.runInContext(code, ctx);
  } catch (err) {
    console.error(`ERROR evaluating ${file}:`, err.message);
    process.exit(1);
  }
}

// Build sandbox: provide JS builtins that vm isolates might miss
const ctx = vm.createContext({
  parseInt, parseFloat, isNaN, isFinite,
  Array, Object, String, Number, Boolean,
  Date, RegExp, Error, Math, JSON,
  Infinity, NaN,
});

evalFile('01-palette.js', ctx); // defines: C, ax
evalFile('10-decks.js',   ctx); // defines: DECKS, DECK_GROUPS  (uses C)
evalFile('40-extras.js',  ctx); // defines: EXTRA_CARDS, EXTRA_QUIZ (uses DECKS)

const DECKS       = ctx.DECKS;
const EXTRA_CARDS = ctx.EXTRA_CARDS;

if (!DECKS || typeof DECKS !== 'object') {
  console.error('ERROR: DECKS not found after evaluating source files.');
  process.exit(1);
}
if (!EXTRA_CARDS || typeof EXTRA_CARDS !== 'object') {
  console.error('ERROR: EXTRA_CARDS not found after evaluating source files.');
  process.exit(1);
}

// ── Topic order ───────────────────────────────────────────────

const TOPIC_ORDER = [
  'psicosis', 'anxiety', 'toc', 'trauma', 'somaticos',
  'tca', 'sueno', 'personalidad', 'impulsos', 'depresivos',
];

// ── SQL helpers ───────────────────────────────────────────────

function sqlStr(s) {
  if (s === null || s === undefined) return 'NULL';
  return `'${String(s).replace(/'/g, "''")}'`;
}

function sqlArr(arr) {
  const items = (Array.isArray(arr) ? arr : [])
    .map(t => `'${String(t).replace(/'/g, "''")}'`);
  return `ARRAY[${items.join(', ')}]`;
}

// ── Build deck and card rows ──────────────────────────────────

const deckRows = [];
const cardRows = [];

for (const topicId of TOPIC_ORDER) {
  const deck = DECKS[topicId];
  if (!deck) {
    console.warn(`WARN: topic '${topicId}' not found in DECKS — skipped`);
    continue;
  }

  const deckId = uuidv5(ECEPT_NS, `deck:${topicId}`);
  const { label, icon, color } = deck.meta;

  deckRows.push({ id: deckId, name: label, color, icon });

  const baseCards  = Array.isArray(deck.flash)            ? deck.flash            : [];
  const extraCards = Array.isArray(EXTRA_CARDS[topicId])  ? EXTRA_CARDS[topicId]  : [];
  const allCards   = baseCards.concat(extraCards);

  let skipped = 0;
  allCards.forEach((card, idx) => {
    if (!card.q || !card.r) {
      console.warn(`WARN: ${topicId}[${idx}] missing q/r — skipped`);
      skipped++;
      return;
    }
    cardRows.push({
      id:      uuidv5(ECEPT_NS, `card:${topicId}:${idx}`),
      deck_id: deckId,
      front:   card.q,
      back:    card.r,
      tags:    [topicId, 'salud_mental'],
    });
  });

  const total = allCards.length - skipped;
  process.stdout.write(
    `  ${topicId.padEnd(14)} ${String(baseCards.length).padStart(3)} base + ` +
    `${String(extraCards.length).padStart(2)} extra = ${String(total).padStart(3)} cards\n`
  );
}

// ── Generate SQL ──────────────────────────────────────────────

const BATCH_SIZE = 50;
const lines = [];

lines.push(`-- ============================================================`);
lines.push(`-- ECEPT · Salud Mental II — Seed oficial`);
lines.push(`-- Generated : ${new Date().toISOString()}`);
lines.push(`-- Decks     : ${deckRows.length}`);
lines.push(`-- Flashcards: ${cardRows.length}`);
lines.push(`-- IDs       : deterministic UUID v5 (ns = ${ECEPT_NS})`);
lines.push(`-- Re-run    : safe — ON CONFLICT (id) DO UPDATE`);
lines.push(`-- ============================================================`);
lines.push('');
lines.push('BEGIN;');
lines.push('');

// ── Decks ──────────────────────────────────────────────────────
lines.push('-- ── DECKS ──────────────────────────────────────────────────');
lines.push('INSERT INTO public.decks');
lines.push('  (id, name, description, color, icon, is_official, user_id, created_at)');
lines.push('VALUES');
deckRows.forEach((d, i) => {
  const comma = i < deckRows.length - 1 ? ',' : '';
  lines.push(
    `  (${sqlStr(d.id)}, ${sqlStr(d.name)}, NULL, ` +
    `${sqlStr(d.color)}, ${sqlStr(d.icon)}, TRUE, NULL, now())${comma}`
  );
});
lines.push('ON CONFLICT (id) DO UPDATE SET');
lines.push('  name  = EXCLUDED.name,');
lines.push('  color = EXCLUDED.color,');
lines.push('  icon  = EXCLUDED.icon;');
lines.push('');

// ── Flashcards (batched) ───────────────────────────────────────
lines.push('-- ── FLASHCARDS ─────────────────────────────────────────────');
for (let start = 0; start < cardRows.length; start += BATCH_SIZE) {
  const batch    = cardRows.slice(start, start + BATCH_SIZE);
  const batchNum = Math.floor(start / BATCH_SIZE) + 1;
  const rangeEnd = Math.min(start + BATCH_SIZE, cardRows.length);

  lines.push(`-- Batch ${batchNum} (rows ${start + 1}–${rangeEnd})`);
  lines.push('INSERT INTO public.flashcards');
  lines.push('  (id, deck_id, card_type, front, back, tags, is_official, user_id, created_at)');
  lines.push('VALUES');
  batch.forEach((c, bi) => {
    const comma = bi < batch.length - 1 ? ',' : '';
    lines.push(
      `  (${sqlStr(c.id)}, ${sqlStr(c.deck_id)}, 'basic', ` +
      `${sqlStr(c.front)}, ${sqlStr(c.back)}, ${sqlArr(c.tags)}, ` +
      `TRUE, NULL, now())${comma}`
    );
  });
  lines.push('ON CONFLICT (id) DO UPDATE SET');
  lines.push('  front = EXCLUDED.front,');
  lines.push('  back  = EXCLUDED.back,');
  lines.push('  tags  = EXCLUDED.tags;');
  lines.push('');
}

lines.push('COMMIT;');
lines.push('');

const sql = lines.join('\n');

// ── Write output ──────────────────────────────────────────────

const OUT_PATH = path.join(__dirname, 'seed-flashcards.sql');
fs.writeFileSync(OUT_PATH, sql, 'utf8');

console.log('');
console.log('✓  Seed SQL written');
console.log(`   Decks     : ${deckRows.length}`);
console.log(`   Flashcards: ${cardRows.length}`);
console.log(`   Output    : ${OUT_PATH}`);
console.log('');

// ── Preview first 30 lines ────────────────────────────────────

const preview = sql.split('\n').slice(0, 30);
const base    = path.basename(OUT_PATH);
console.log(`── First 30 lines of ${base} ─${'─'.repeat(Math.max(0, 44 - base.length))}`);
preview.forEach((line, idx) => {
  console.log(`${String(idx + 1).padStart(3)}  ${line}`);
});
console.log('');
