/* wordDecoder — morpheme-decomposition + date-deterministic word-of-day.
   Ported verbatim from artifacts/vocabulario_medico_v4.html (lines 660-729).
   Exposes 4 functions:
     vocabNormalize(s)         — accent-strip + lowercase + non-alpha drop
     vocabCleanPart(tx)        — normalize + strip leading/trailing hyphens
     vocabDecomposeWord(input) — greedy longest-match against VOCAB_VOC
     vocabWordOfDay()          — deterministic picker using today's date

   Names are prefixed with "vocab" to avoid collisions in the
   concatenated global-scope bundle (existing app already has search
   helpers, quiz helpers, etc.). */

function vocabNormalize(s) {
  return s.toLowerCase()
    .replace(/[áàä]/g, "a")
    .replace(/[éèë]/g, "e")
    .replace(/[íìï]/g, "i")
    .replace(/[óòö]/g, "o")
    .replace(/[úùü]/g, "u")
    .replace(/ñ/g, "n")
    .replace(/[^a-z]/g, "");
}

function vocabCleanPart(tx) {
  return vocabNormalize(tx.replace(/^-/, "").replace(/-$/, ""));
}

function vocabDecomposeWord(input) {
  var word = vocabNormalize(input);
  if (!word || word.length < 3) return null;

  /* Build list of all matchable pieces (prefixes, suffixes, roots) */
  var pieces = [];
  VOCAB_VOC.forEach(function(v) {
    /* Handle compound entries like "cole- / colecisto-" */
    var variants = v.tx.split("/").map(function(x) {
      return vocabCleanPart(x.trim());
    });
    variants.forEach(function(p) {
      if (p.length >= 2) pieces.push({p: p, v: v, t: v.t});
    });
  });

  /* Dedupe and sort by length desc (longest match first) */
  var seen = {};
  pieces = pieces.filter(function(x) {
    if (seen[x.p]) return false;
    seen[x.p] = true;
    return true;
  }).sort(function(a, b) { return b.p.length - a.p.length; });

  /* Greedy left-to-right scan */
  var result = [];
  var pos = 0;
  var remaining = word;
  var safety = 0;
  while (remaining.length > 0 && safety < 40) {
    safety++;
    var matched = null;
    for (var i = 0; i < pieces.length; i++) {
      if (remaining.indexOf(pieces[i].p) === 0) {
        matched = pieces[i];
        break;
      }
    }
    if (matched) {
      result.push({piece: matched.p, voc: matched.v, start: pos});
      remaining = remaining.slice(matched.p.length);
      pos += matched.p.length;
    } else {
      /* Shift 1 char and continue (gap = connector like 'o' / 'i') */
      remaining = remaining.slice(1);
      pos++;
    }
  }
  return result;
}

function vocabWordOfDay() {
  var d = new Date();
  /* Deterministic hash from YYYY-MM-DD; changes at local midnight */
  var seed = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
  /* Mix with a prime (Knuth's multiplicative hash) to spread distribution */
  var idx = (seed * 2654435761) % VOCAB_VOC.length;
  if (idx < 0) idx += VOCAB_VOC.length;
  return VOCAB_VOC[idx];
}
