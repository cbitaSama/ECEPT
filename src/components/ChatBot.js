// ══════════════════════════════════════════════════════════════
// CHATBOT — Elion AI assistant for ECEPT
// ES5 estricto: solo declaraciones var y function. Nada de ES6+.
// React.createElement vía alias global `e`. Sin JSX.
// Prefijo CB_ en todos los globales. Props: onLoginRequest (fn)
// ══════════════════════════════════════════════════════════════

var CB_MODELS = [
  { id:'gemini-2.5-flash-lite', name:'Flash Lite', desc:'Rápido y eficiente',           cost:1,  icon:'⚡' },
  { id:'gemini-2.5-flash',      name:'Flash 2.5',  desc:'Mejor calidad y razonamiento', cost:3,  icon:'✨' },
  { id:'gemini-2.5-pro',        name:'Pro 2.5',    desc:'Máxima inteligencia',           cost:15, icon:'🧠' }
];

var CB_TIER_MODELS = {
  student: ['gemini-2.5-flash-lite'],
  premium: ['gemini-2.5-flash-lite','gemini-2.5-flash'],
  admin:   ['gemini-2.5-flash-lite','gemini-2.5-flash']
};

var CB_MODEL_INFO = [
  {
    id:'gemini-2.5-flash-lite', icon:'⚡', name:'Flash Lite',
    tagline:'Rápido y eficiente',
    description:'Ideal para preguntas cotidianas, definiciones, repaso rápido.',
    bullets:['Respuestas en segundos','Acceso libre con cuota diaria','1 🪙 por mensaje extra'],
    gradient:'linear-gradient(135deg,rgba(96,165,250,0.15),rgba(96,165,250,0.05))',
    accent:'#60a5fa'
  },
  {
    id:'gemini-2.5-flash', icon:'✨', name:'Flash 2.5',
    tagline:'Mejor calidad y razonamiento',
    description:'Para casos clínicos complejos, análisis comparativos, esquemas detallados.',
    bullets:['Razonamiento más sólido','⭐ Incluido en Premium','3 🪙 por mensaje (sin Premium)'],
    gradient:'linear-gradient(135deg,rgba(167,139,250,0.18),rgba(167,139,250,0.06))',
    accent:'#a78bfa', badge:'POPULAR'
  },
  {
    id:'gemini-2.5-pro', icon:'🧠', name:'Pro 2.5',
    tagline:'Máxima inteligencia',
    description:'Análisis profundo de documentos largos, casos extensos, razonamiento avanzado.',
    bullets:['Razonamiento avanzado','Sin cuota gratis','15 🪙 por mensaje'],
    gradient:'linear-gradient(135deg,rgba(251,191,36,0.18),rgba(251,191,36,0.06))',
    accent:'#fbbf24', badge:'PREMIUM'
  }
];

var CB_styleInjected = false;

var CB_CALLOUTS = {
  '⚠': { bg:'rgba(245,158,11,.1)',    border:'#fbbf24' },
  '💡': { bg:'rgba(52,211,153,.1)',   border:'#34d399' },
  '🚨': { bg:'rgba(239,68,68,.08)',   border:'#ef4444' },
  '📌': { bg:'rgba(99,102,241,.1)',   border:'#818cf8' },
  '🔬': { bg:'rgba(139,92,246,.08)',  border:'#a78bfa' },
  '📊': { bg:'rgba(59,130,246,.08)',  border:'#60a5fa' },
  '🩺': { bg:'rgba(20,184,166,.08)',  border:'#2dd4bf' }
};

function CB_elionAvatar(sz) {
  // Avatar premium: Logo SVG hélice doble en círculo gradiente sutil
  return e('div', { style:{
    width:sz+'px', height:sz+'px', flexShrink:0, borderRadius:'50%',
    background:'linear-gradient(135deg,rgba(96,165,250,0.18),rgba(167,139,250,0.10))',
    border:'1px solid rgba(167,139,250,0.30)',
    display:'flex', alignItems:'center', justifyContent:'center',
    boxShadow:'0 0 12px rgba(167,139,250,0.18)', userSelect:'none', overflow:'hidden'
  }}, e(window.Logo || 'span', { size: Math.round(sz * 0.78), idSuffix:'av_'+sz }));
}

// ── Inline markdown: [link](url), **bold**, `code`, *italic* ─
function CB_parseInline(text) {
  var result = [];
  var remaining = String(text || '');
  var kn = 0;
  while (remaining.length > 0) {
    var m = /\[([^\]]+)\]\(([^)]+)\)|\*\*(.+?)\*\*|`([^`]+)`|\*([^*\n]+)\*/.exec(remaining);
    if (!m) { if (remaining) result.push(remaining); break; }
    if (m.index > 0) result.push(remaining.slice(0, m.index));
    if (m[1] !== undefined) {
      (function(href, label, key) {
        if (href.indexOf('#') === 0) {
          var route = href.slice(1);
          result.push(e('button', { key:key,
            onClick:function(ev) {
              ev.preventDefault(); ev.stopPropagation();
              if (window.CB_go) window.CB_go(route);
              if (window._CB_closePanel) window._CB_closePanel();
            },
            onMouseOver:function(ev) {
              ev.currentTarget.style.background='linear-gradient(135deg,rgba(59,130,246,0.25),rgba(96,165,250,0.15))';
              ev.currentTarget.style.transform='translateY(-1px)';
            },
            onMouseOut:function(ev) {
              ev.currentTarget.style.background='linear-gradient(135deg,rgba(59,130,246,0.15),rgba(96,165,250,0.08))';
              ev.currentTarget.style.transform='translateY(0)';
            },
            style:{
              display:'inline-flex', alignItems:'center', gap:'6px',
              padding:'6px 12px', margin:'2px 4px 2px 0',
              background:'linear-gradient(135deg,rgba(59,130,246,0.15),rgba(96,165,250,0.08))',
              border:'1px solid rgba(96,165,250,0.3)', borderRadius:'999px',
              color:'#60a5fa', fontSize:'12px', fontWeight:500, cursor:'pointer',
              fontFamily:'inherit', transition:'all 200ms ease', whiteSpace:'nowrap'
            }
          }, '🔗 '+label));
        } else {
          result.push(e('a', { key:key, href:href, target:'_blank', rel:'noopener', style:{ color:C.ac2, textDecoration:'underline' } }, label));
        }
      })(m[2], m[1], 'ck'+(kn++));
    } else if (m[3] !== undefined) {
      result.push(e('strong', { key:'ck'+(kn++), style:{fontWeight:700} }, m[3]));
    } else if (m[4] !== undefined) {
      result.push(e('code', { key:'ck'+(kn++), style:{background:'rgba(255,255,255,.1)',padding:'1px 4px',borderRadius:3,fontFamily:'monospace',fontSize:'0.9em'} }, m[4]));
    } else if (m[5] !== undefined) {
      result.push(e('em', { key:'ck'+(kn++), style:{fontStyle:'italic'} }, m[5]));
    } else result.push(m[0]);
    remaining = remaining.slice(m.index + m[0].length);
  }
  return result;
}

// ── Block markdown renderer ───────────────────────────────────
// ── Pro 2.5 export helpers ──
function CB_extractExportMeta(text) {
  if (!text) return null;
  var match = String(text).match(/===EXPORT_DOCUMENT===\s*([\s\S]*?)\s*===END_EXPORT===/);
  if (!match) return null;
  try { return JSON.parse(match[1]); } catch(e) { return null; }
}
function CB_stripExportMeta(text) {
  if (!text) return text;
  return String(text).replace(/===EXPORT_DOCUMENT===[\s\S]*?===END_EXPORT===/, '').trim();
}

function CB_stripMdPlain(text) {
  if (!text) return '';
  return String(text)
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/\*([^*\n]+)\*/g, '$1')
    .replace(/_([^_\n]+)_/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .trim();
}

function CB_extractFlashcardsBlock(text) {
  if (!text) return null;
  var match = String(text).match(/===FLASHCARDS_GEN===\s*([\s\S]*?)\s*===END_FLASHCARDS===/);
  if (!match) return null;
  try {
    var parsed = JSON.parse(match[1]);
    if (!parsed || !Array.isArray(parsed.cards) || parsed.cards.length === 0) return null;
    // Strip markdown defensive — el LLM a veces ignora la regla.
    parsed.deckName = CB_stripMdPlain(parsed.deckName || '');
    parsed.cards = parsed.cards.map(function(c) {
      return {
        q: CB_stripMdPlain(c.q || ''),
        a: CB_stripMdPlain(c.a || ''),
        tag: c.tag ? CB_stripMdPlain(c.tag) : null
      };
    });
    return parsed;
  } catch(e) { return null; }
}
function CB_stripFlashcardsBlock(text) {
  if (!text) return text;
  return String(text).replace(/===FLASHCARDS_GEN===[\s\S]*?===END_FLASHCARDS===/, '').trim();
}

function CB_exportToPDF(content, meta) {
  if (!window.jspdf || !window.jspdf.jsPDF) {
    if (window.ECEPT_toast) window.ECEPT_toast('jsPDF no disponible. Recargá la página.', 'error');
    return;
  }
  var jsPDF = window.jspdf.jsPDF;
  var doc = new jsPDF();
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(meta.title || 'Documento ECEPT', 20, 25, { maxWidth: 170 });
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  // Markdown → texto plano simple
  var plain = String(content || '')
    .replace(/^#+\s+/gm, '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/\[(.+?)\]\((.+?)\)/g, '$1 ($2)')
    .trim();
  var lines = doc.splitTextToSize(plain, 170);
  // Pagination simple
  var y = 38;
  var lineH = 6;
  for (var i = 0; i < lines.length; i++) {
    if (y > 275) { doc.addPage(); y = 20; }
    doc.text(lines[i], 20, y);
    y += lineH;
  }
  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.text('Generado por Elion · ECEPT · ' + new Date().toLocaleDateString('es'), 20, 290);
  var fname = meta.filename || 'documento_ecept.pdf';
  if (!/\.pdf$/i.test(fname)) fname += '.pdf';
  doc.save(fname);
}

// Lazy-load de docx con fallback de CDNs.
var CB_DOCX_LOADING = null;
function CB_loadDocxLib() {
  if (window.docx) return Promise.resolve(window.docx);
  if (CB_DOCX_LOADING) return CB_DOCX_LOADING;
  CB_DOCX_LOADING = new Promise(function(resolve, reject) {
    var urls = [
      'https://unpkg.com/docx@8.5.0/build/index.umd.min.js',
      'https://cdn.jsdelivr.net/npm/docx@8.5.0/build/index.umd.min.js'
    ];
    var idx = 0;
    function tryLoad() {
      if (idx >= urls.length) return reject(new Error('No se pudo cargar docx'));
      var sc = document.createElement('script');
      sc.src = urls[idx];
      sc.async = true;
      sc.onload = function() {
        if (window.docx) { resolve(window.docx); }
        else { idx++; sc.parentNode && sc.parentNode.removeChild(sc); tryLoad(); }
      };
      sc.onerror = function() { idx++; sc.parentNode && sc.parentNode.removeChild(sc); tryLoad(); };
      document.head.appendChild(sc);
    }
    tryLoad();
  });
  return CB_DOCX_LOADING;
}

function CB_exportToDOCX(content, meta) {
  if (window.ECEPT_toast) window.ECEPT_toast('Generando documento Word...', 'info');
  CB_loadDocxLib().then(function(docxLib) {
    CB_doExportToDOCX(content, meta, docxLib);
  }, function() {
    if (window.ECEPT_toast) window.ECEPT_toast('No se pudo cargar el generador de Word. Intentá con PDF.', 'error');
  });
}

// ── Helpers DOCX: parser markdown serio ──────────────────────
function CB_stripInlineMd(text) {
  if (!text) return '';
  return String(text)
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
}

function CB_parseInlineToRuns(text, docxLib) {
  var TextRun = docxLib.TextRun;
  // Strip links → solo texto del label
  var cleaned = String(text || '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  var runs = [];
  // Pattern combinado: bold ** __ | italics * _ | code `
  var re = /(\*\*[^*]+\*\*|__[^_]+__|`[^`]+`|\*[^*\n]+\*|_[^_\n]+_)/g;
  var lastIdx = 0;
  var m;
  while ((m = re.exec(cleaned)) !== null) {
    if (m.index > lastIdx) runs.push(new TextRun({ text: cleaned.slice(lastIdx, m.index) }));
    var token = m[0];
    if (token.indexOf('**') === 0) runs.push(new TextRun({ text: token.slice(2, -2), bold: true }));
    else if (token.indexOf('__') === 0) runs.push(new TextRun({ text: token.slice(2, -2), bold: true }));
    else if (token.indexOf('`') === 0) runs.push(new TextRun({ text: token.slice(1, -1), font: 'Courier New' }));
    else if (token.indexOf('*') === 0) runs.push(new TextRun({ text: token.slice(1, -1), italics: true }));
    else if (token.indexOf('_') === 0) runs.push(new TextRun({ text: token.slice(1, -1), italics: true }));
    lastIdx = m.index + token.length;
  }
  if (lastIdx < cleaned.length) runs.push(new TextRun({ text: cleaned.slice(lastIdx) }));
  if (runs.length === 0) runs.push(new TextRun({ text: cleaned }));
  return runs;
}

function CB_parseMdTable(lines) {
  if (lines.length < 2) return null;
  function splitRow(line) {
    var s = line.trim();
    if (s.indexOf('|') === 0) s = s.slice(1);
    if (s.lastIndexOf('|') === s.length - 1) s = s.slice(0, -1);
    return s.split('|').map(function(c){ return c.trim(); });
  }
  var headers = splitRow(lines[0]);
  var rows = [];
  for (var j = 2; j < lines.length; j++) {
    var cells = splitRow(lines[j]);
    if (cells.length > 0 && cells.some(function(c){ return c.length > 0; })) rows.push(cells);
  }
  return { headers: headers, rows: rows };
}

function CB_buildDocxTable(tableData, docxLib) {
  var Table = docxLib.Table;
  var TableRow = docxLib.TableRow;
  var TableCell = docxLib.TableCell;
  var Paragraph = docxLib.Paragraph;
  var TextRun = docxLib.TextRun;
  var WidthType = docxLib.WidthType;
  var BorderStyle = docxLib.BorderStyle;
  var border = {
    top:    { style: BorderStyle.SINGLE, size: 4, color: 'cccccc' },
    bottom: { style: BorderStyle.SINGLE, size: 4, color: 'cccccc' },
    left:   { style: BorderStyle.SINGLE, size: 4, color: 'cccccc' },
    right:  { style: BorderStyle.SINGLE, size: 4, color: 'cccccc' }
  };
  var headerCells = tableData.headers.map(function(h) {
    return new TableCell({
      children: [new Paragraph({ children: [new TextRun({ text: CB_stripInlineMd(h), bold: true })] })],
      shading: { type: 'solid', color: 'auto', fill: 'F0F0F0' },
      borders: border
    });
  });
  var rows = [new TableRow({ children: headerCells, tableHeader: true })];
  tableData.rows.forEach(function(row) {
    var cells = row.map(function(c) {
      return new TableCell({
        children: [new Paragraph({ children: CB_parseInlineToRuns(c, docxLib) })],
        borders: border
      });
    });
    rows.push(new TableRow({ children: cells }));
  });
  return new Table({ rows: rows, width: { size: 100, type: WidthType.PERCENTAGE } });
}

function CB_doExportToDOCX(content, meta, docxLib) {
  var Document = docxLib.Document;
  var Packer = docxLib.Packer;
  var Paragraph = docxLib.Paragraph;
  var TextRun = docxLib.TextRun;
  var HeadingLevel = docxLib.HeadingLevel;
  var AlignmentType = docxLib.AlignmentType;

  var children = [];

  // Título
  children.push(new Paragraph({
    text: CB_stripInlineMd(meta.title || 'Documento ECEPT'),
    heading: HeadingLevel.TITLE,
    spacing: { after: 240 }
  }));

  var lines = String(content || '').split('\n');
  var i = 0;
  while (i < lines.length) {
    var line = lines[i];
    var trimmed = line.trim();

    // Skip horizontal rules
    if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
      i++;
      continue;
    }

    // Tabla markdown: detectar header + separator
    if (trimmed.indexOf('|') === 0 && i + 1 < lines.length &&
        /^\|[\s:|\-]+\|?\s*$/.test(lines[i + 1].trim())) {
      var tableLines = [];
      while (i < lines.length && lines[i].trim().indexOf('|') === 0) {
        tableLines.push(lines[i]);
        i++;
      }
      var td = CB_parseMdTable(tableLines);
      if (td && td.headers.length > 0) {
        children.push(CB_buildDocxTable(td, docxLib));
        children.push(new Paragraph({ text: '', spacing: { after: 200 } }));
      }
      continue;
    }

    // Code block (skip — agrega como texto plano para no perder)
    if (/^\s*```/.test(line)) {
      i++;
      var codeLines = [];
      while (i < lines.length && !/^\s*```/.test(lines[i])) { codeLines.push(lines[i]); i++; }
      i++; // skip closing ```
      if (codeLines.length > 0) {
        codeLines.forEach(function(cl) {
          children.push(new Paragraph({ children: [new TextRun({ text: cl, font: 'Courier New' })] }));
        });
      }
      continue;
    }

    // Headers
    var hMatch = trimmed.match(/^(#{1,4})\s+(.+)$/);
    if (hMatch) {
      var level = hMatch[1].length;
      var hLevel = HeadingLevel.HEADING_1;
      if (level === 2) hLevel = HeadingLevel.HEADING_2;
      else if (level === 3) hLevel = HeadingLevel.HEADING_3;
      else if (level === 4) hLevel = HeadingLevel.HEADING_4;
      children.push(new Paragraph({
        text: CB_stripInlineMd(hMatch[2]),
        heading: hLevel,
        spacing: { before: 200, after: 120 }
      }));
      i++;
      continue;
    }

    // Bullet
    var bMatch = trimmed.match(/^[\*\-]\s+(.+)$/);
    if (bMatch) {
      children.push(new Paragraph({
        children: CB_parseInlineToRuns(bMatch[1], docxLib),
        bullet: { level: 0 },
        spacing: { after: 80 }
      }));
      i++;
      continue;
    }

    // Numbered list (sin reference numbering avanzado, usa bullet de fallback)
    var nMatch = trimmed.match(/^\d+\.\s+(.+)$/);
    if (nMatch) {
      children.push(new Paragraph({
        children: CB_parseInlineToRuns(nMatch[1], docxLib),
        bullet: { level: 0 },
        spacing: { after: 80 }
      }));
      i++;
      continue;
    }

    // Empty line
    if (trimmed === '') {
      children.push(new Paragraph({ text: '' }));
      i++;
      continue;
    }

    // Párrafo regular
    children.push(new Paragraph({
      children: CB_parseInlineToRuns(trimmed, docxLib),
      spacing: { after: 120 }
    }));
    i++;
  }

  // Footer
  children.push(new Paragraph({
    children: [new TextRun({ text: 'Generado por Elion · ECEPT · ' + new Date().toLocaleDateString('es'), italics: true, size: 18, color: '888888' })],
    alignment: AlignmentType.CENTER,
    spacing: { before: 400 }
  }));

  var doc = new Document({ sections: [{ properties: {}, children: children }] });
  Packer.toBlob(doc).then(function(blob) {
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    var fname = meta.filename || 'documento_ecept.docx';
    if (!/\.docx$/i.test(fname)) fname += '.docx';
    a.download = fname;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function(){ URL.revokeObjectURL(url); }, 200);
  });
}

function CB_exportDocument(content, meta) {
  if (!meta || !meta.format) return;
  if (meta.format === 'pdf') CB_exportToPDF(content, meta);
  else if (meta.format === 'docx') CB_exportToDOCX(content, meta);
  else CB_exportToPDF(content, meta);
}

function CB_renderMarkdown(text) {
  var lines = String(text || '').split('\n');
  var elems = [];
  var i = 0;
  var kn = 0;
  while (i < lines.length) {
    var line = lines[i];

    if (/^\s*```/.test(line)) {
      var codeLines = [];
      i++;
      while (i < lines.length && !/^\s*```/.test(lines[i])) { codeLines.push(lines[i]); i++; }
      elems.push(e('pre', { key:'mk'+(kn++), style:{ background:'#0a0e1f', border:'1px solid '+C.bd, borderRadius:8, padding:12, fontSize:12, fontFamily:'monospace', overflowX:'auto', margin:'8px 0', color:'#e2e8f0', whiteSpace:'pre-wrap', wordBreak:'break-all' } }, codeLines.join('\n')));
      i++; continue;
    }

    if (line.indexOf('### ') === 0) {
      elems.push(e('div', { key:'mk'+(kn++), style:{ color:'#a78bfa', fontSize:14, fontWeight:600, marginTop:12, marginBottom:6 } }, e('span', null, CB_parseInline(line.slice(4)))));
      i++; continue;
    }
    if (line.indexOf('## ') === 0) {
      elems.push(e('div', { key:'mk'+(kn++), style:{ color:'#60a5fa', fontSize:17, fontWeight:700, marginTop:14, marginBottom:8, paddingBottom:4, borderBottom:'1px solid rgba(96,165,250,0.2)' } }, e('span', null, CB_parseInline(line.slice(3)))));
      i++; continue;
    }
    if (line.indexOf('# ') === 0) {
      elems.push(e('div', { key:'mk'+(kn++), style:{ color:C.ac, fontSize:18, fontWeight:700, marginTop:16, marginBottom:8 } }, e('span', null, CB_parseInline(line.slice(2)))));
      i++; continue;
    }

    if (/^\s*---+\s*$/.test(line) || /^\s*\*\*\*+\s*$/.test(line)) {
      elems.push(e('hr', { key:'mk'+(kn++), style:{ border:0, borderTop:'1px solid '+C.bd, margin:'12px 0' } }));
      i++; continue;
    }

    if (line.indexOf('|') !== -1 && i+1 < lines.length && /^\s*\|[\s|:=-]+\|\s*$/.test(lines[i+1])) {
      var headerCells = line.split('|').filter(function(c) { return c.trim() !== ''; }).map(function(c) { return c.trim(); });
      i += 2;
      var tableRows = [];
      while (i < lines.length && lines[i].indexOf('|') !== -1) { tableRows.push(lines[i]); i++; }
      elems.push(e('div', { key:'mk'+(kn++), style:{ overflowX:'auto', margin:'8px 0', borderRadius:8, border:'1px solid '+C.bd, overflow:'hidden' } },
        e('table', { style:{ borderCollapse:'collapse', width:'100%', fontSize:12 } },
          e('thead', null, e('tr', null,
            headerCells.map(function(hc, hi) {
              return e('th', { key:hi, style:{ padding:'8px 10px', background:'rgba(59,130,246,.1)', textAlign:'left', color:'#60a5fa', fontWeight:700, fontSize:11, letterSpacing:1, textTransform:'uppercase' } }, hc);
            })
          )),
          e('tbody', null,
            tableRows.map(function(row, ri) {
              var cells = row.split('|').filter(function(c) { return c.trim() !== ''; }).map(function(c) { return c.trim(); });
              var isLastRow = ri === tableRows.length - 1;
              return e('tr', { key:ri },
                cells.map(function(cell, ci) {
                  return e('td', { key:ci, style:{ padding:'8px 10px', borderBottom:isLastRow?'none':'1px solid '+C.bd, fontSize:13 } }, e('span', null, CB_parseInline(cell)));
                })
              );
            })
          )
        )
      ));
      continue;
    }

    var _calloutKey = null;
    var _calloutEmojis = Object.keys(CB_CALLOUTS);
    for (var _cki = 0; _cki < _calloutEmojis.length; _cki++) {
      if (line.indexOf(_calloutEmojis[_cki]) === 0) { _calloutKey = _calloutEmojis[_cki]; break; }
    }
    if (_calloutKey) {
      var _cs = CB_CALLOUTS[_calloutKey];
      elems.push(e('div', { key:'mk'+(kn++), style:{ background:_cs.bg, borderLeft:'3px solid '+_cs.border, padding:'8px 12px', borderRadius:6, margin:'4px 0' } }, e('span', null, CB_parseInline(line))));
      i++; continue;
    }

    if (line.indexOf('- ') === 0 || line.indexOf('* ') === 0) {
      elems.push(e('div', { key:'mk'+(kn++), style:{ display:'flex', gap:'6px', margin:'2px 0', alignItems:'flex-start' } },
        e('span', { style:{ color:C.ac, flexShrink:0, marginTop:2, fontSize:12 } }, '•'),
        e('span', { style:{ lineHeight:1.55 } }, e('span', null, CB_parseInline(line.slice(2))))
      ));
      i++; continue;
    }

    if (!line.trim()) {
      elems.push(e('div', { key:'mk'+(kn++), style:{ height:6 } }));
      i++; continue;
    }

    if (line.indexOf('📚 En ECEPT:') === 0) {
      var footerText = line.slice('📚 En ECEPT:'.length).trim();
      elems.push(e('div', { key:'mk'+(kn++), style:{ borderTop:'1px solid rgba(96,165,250,0.15)', marginTop:12, paddingTop:10, display:'flex', flexWrap:'wrap', alignItems:'center', gap:4 } },
        e('span', { style:{ fontSize:11, color:'#94a3b8', fontWeight:600, marginRight:4, flexShrink:0 } }, '📚 En ECEPT:'),
        e('span', { style:{ display:'inline-flex', flexWrap:'wrap', gap:4 } }, CB_parseInline(footerText))
      ));
      i++; continue;
    }

    elems.push(e('p', { key:'mk'+(kn++), style:{ margin:'2px 0', lineHeight:1.55 } }, e('span', null, CB_parseInline(line))));
    i++;
  }
  return e('div', { style:{ fontSize:13, color:C.tx, lineHeight:1.55 } }, elems);
}

// ── Main component ────────────────────────────────────────────
function ChatBot(props) {
  var s;
  s=useState(false);                     var CB_open=s[0],            CB_setOpen=s[1];
  s=useState(null);                      var CB_session=s[0],         CB_setSession=s[1];
  s=useState('student');                 var CB_role=s[0],            CB_setRole=s[1];
  s=useState(0);                         var CB_credits=s[0],         CB_setCredits=s[1];
  s=useState(null);                      var CB_uid=s[0],             CB_setUid=s[1];
  s=useState(false);                     var CB_fullscreen=s[0],      CB_setFullscreen=s[1];
  s=useState(typeof window!=='undefined'&&window.innerWidth>=768);
                                         var CB_isDesktop=s[0],       CB_setIsDesktop=s[1];
  s=useState([]);                        var CB_msgs=s[0],            CB_setMsgs=s[1];
  s=useState('');                        var CB_input=s[0],           CB_setInput=s[1];
  s=useState(false);                     var CB_loading=s[0],         CB_setLoading=s[1];
  s=useState('');                        var CB_connErr=s[0],         CB_setConnErr=s[1];
  s=useState(null);                      var CB_quota=s[0],           CB_setQuota=s[1];
  s=useState('gemini-2.5-flash-lite');   var CB_selectedModel=s[0],   CB_setSelectedModel=s[1];
  s=useState([]);                        var CB_pendingFiles=s[0],    CB_setPendingFiles=s[1];
  s=useState(false);                     var CB_inputFocused=s[0],    CB_setInputFocused=s[1];
  // ── New state (25b-D) ──
  s=useState([]);                        var CB_conversations=s[0],   CB_setConversations=s[1];
  s=useState(null);                      var CB_activeConvId=s[0],    CB_setActiveConvId=s[1];
  s=useState(false);                     var CB_loadingConvs=s[0],    CB_setLoadingConvs=s[1];
  s=useState(false);                     var CB_convsLoaded=s[0],     CB_setConvsLoaded=s[1];
  s=useState([]);                        var CB_projects=s[0],        CB_setProjects=s[1];
  s=useState({});                        var CB_expandedProjects=s[0],CB_setExpandedProjects=s[1];
  s=useState(null);                      var CB_projectMenuId=s[0],   CB_setProjectMenuId=s[1];
  s=useState(null);                      var CB_pmEditingProj=s[0],   CB_setPmEditingProj=s[1]; // proj a editar
  s=useState(null);                      var CB_deleteConvConfirm=s[0],CB_setDeleteConvConfirm=s[1];
  s=useState(null);                      var CB_archiveProjConfirm=s[0],CB_setArchiveProjConfirm=s[1];
  s=useState(false);                     var CB_pmOpen=s[0],          CB_setPmOpen=s[1];
  s=useState(null);                      var CB_assignToProj=s[0],    CB_setAssignToProj=s[1]; // conversationId siendo asignada
  s=useState(false);                     var CB_sidebarOpen=s[0],     CB_setSidebarOpen=s[1];
  s=useState('');                        var CB_sidebarQ=s[0],        CB_setSidebarQ=s[1];
  s=useState(null);                      var CB_convMenuId=s[0],      CB_setConvMenuId=s[1];
  s=useState(null);                      var CB_renamingId=s[0],      CB_setRenamingId=s[1];
  s=useState('');                        var CB_renameValue=s[0],     CB_setRenameValue=s[1];
  s=useState(false);                     var CB_modelPickerOpen=s[0], CB_setModelPickerOpen=s[1];
  s=useState(false);                     var CB_msgsTransitioning=s[0], CB_setMsgsTransitioning=s[1];
  s=useState(false);                     var CB_settingsOpen=s[0],    CB_setSettingsOpen=s[1];
  s=useState('');                        var CB_userNotes=s[0],       CB_setUserNotes=s[1];
  s=useState(false);                     var CB_userNotesLoaded=s[0], CB_setUserNotesLoaded=s[1];
  s=useState(false);                     var CB_notesSaving=s[0],     CB_setNotesSaving=s[1];
  s=useState('');                        var CB_notesError=s[0],      CB_setNotesError=s[1];

  var CB_scrollRef = useRef(null);
  var CB_inputRef  = useRef(null);
  var CB_fileInputRef = useRef(null);

  function CB_handleFileSelect(ev) {
    var files = ev.target.files;
    if (!files || files.length === 0) return;
    var allowed = ['application/pdf','image/jpeg','image/jpg','image/png','image/webp'];
    var maxSize = 10 * 1024 * 1024; // 10MB
    var arr = [];
    for (var i = 0; i < files.length && arr.length + CB_pendingFiles.length < 3; i++) {
      var f = files[i];
      if (allowed.indexOf(f.type) === -1) {
        if (window.ECEPT_toast) window.ECEPT_toast(f.name + ': formato no soportado (PDF/JPG/PNG/WEBP)', 'warning');
        continue;
      }
      if (f.size > maxSize) {
        if (window.ECEPT_toast) window.ECEPT_toast(f.name + ': supera 10MB', 'warning');
        continue;
      }
      arr.push(f);
    }
    if (arr.length === 0) { ev.target.value = ''; return; }
    // Leer cada uno como base64
    var promises = arr.map(function(f) {
      return new Promise(function(resolve) {
        var reader = new FileReader();
        reader.onload = function() {
          var result = reader.result || '';
          var commaIdx = String(result).indexOf(',');
          var data = commaIdx >= 0 ? String(result).slice(commaIdx + 1) : '';
          resolve({ name: f.name, mimeType: f.type, size: f.size, data: data });
        };
        reader.onerror = function() { resolve(null); };
        reader.readAsDataURL(f);
      });
    });
    Promise.all(promises).then(function(results) {
      var ok = results.filter(function(x){ return !!x; });
      if (ok.length === 0) return;
      CB_setPendingFiles(function(prev){ return prev.concat(ok); });
      if (window.ECEPT_toast) window.ECEPT_toast(ok.length + (ok.length===1?' archivo agregado':' archivos agregados'), 'success');
    });
    ev.target.value = ''; // reset para permitir re-seleccionar mismo archivo
  }

  function CB_removeFile(idx) {
    CB_setPendingFiles(function(prev) {
      var next = prev.slice();
      next.splice(idx, 1);
      return next;
    });
  }
  var CB_longPressRef = useRef(null);
  var CB_convLoadedRef = useRef(false);
  var CB_skipNextConvLoad = useRef(false);
  var CB_lastMsgRef = useRef(null);  // último user message para Reintentar

  // ── Inject CSS animations once ──
  useEffect(function() {
    if (!CB_styleInjected) {
      var st = document.createElement('style');
      st.textContent =
        '@keyframes CB_dotBounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-5px)}}' +
        '@keyframes CB_panelIn{from{opacity:0;transform:translateX(-30px) scale(0.97)}to{opacity:1;transform:translateX(0) scale(1)}}' +
        '@keyframes CB_panelInMobile{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}' +
        '@keyframes CB_spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}' +
        '@keyframes CB_sidebarIn{from{opacity:0;transform:translateX(-16px)}to{opacity:1;transform:translateX(0)}}' +
        '.CB_convItem:hover{background:rgba(96,165,250,0.08)!important;}';
      document.head.appendChild(st);
      CB_styleInjected = true;
    }
  }, []);

  // ── Scroll lock ──
  useEffect(function() {
    var locked = CB_open && (CB_fullscreen || !CB_isDesktop);
    document.body.style.overflow = locked ? 'hidden' : '';
    return function() { document.body.style.overflow = ''; };
  }, [CB_open, CB_fullscreen, CB_isDesktop]);

  // ── iPad keyboard fix ──
  useEffect(function() {
    if (!CB_open || !window.visualViewport) return;
    function CB_handleViewport() {
      var vv = window.visualViewport;
      var panel = document.getElementById('CB_panel');
      if (!panel) return;
      if (CB_isDesktop && !CB_fullscreen) {
        var kbHeight = window.innerHeight - vv.height;
        panel.style.bottom = (16 + kbHeight) + 'px';
      } else {
        panel.style.height = vv.height + 'px';
      }
    }
    window.visualViewport.addEventListener('resize', CB_handleViewport);
    window.visualViewport.addEventListener('scroll', CB_handleViewport);
    CB_handleViewport();
    return function() {
      window.visualViewport.removeEventListener('resize', CB_handleViewport);
      window.visualViewport.removeEventListener('scroll', CB_handleViewport);
      var panel = document.getElementById('CB_panel');
      if (panel) { panel.style.bottom = ''; panel.style.height = ''; }
    };
  }, [CB_open, CB_isDesktop, CB_fullscreen]);

  // ── Expose close handler for deeplinks ──
  useEffect(function() {
    window._CB_closePanel = function() { CB_setOpen(false); CB_setFullscreen(false); };
    return function() { window._CB_closePanel = null; };
  }, [CB_setOpen, CB_setFullscreen]);

  // ── Auth + resize ──
  useEffect(function() {
    function CB_onResize() { CB_setIsDesktop(window.innerWidth >= 768); }
    window.addEventListener('resize', CB_onResize);

    if (!window.ECEPT_SUPABASE) {
      CB_setSession(false);
      return function() { window.removeEventListener('resize', CB_onResize); };
    }
    try {
      // Load saved model
      try {
        var savedModel = localStorage.getItem('ECEPT_CHAT_MODEL');
        if (savedModel) {
          for (var _smi = 0; _smi < CB_MODELS.length; _smi++) {
            if (CB_MODELS[_smi].id === savedModel) { CB_setSelectedModel(savedModel); break; }
          }
        }
      } catch(e3) {}

      window.ECEPT_SUPABASE.auth.getSession().then(function(res) {
        if (res && res.data && res.data.session) {
          var uid = res.data.session.user.id;
          CB_setSession(true); CB_setUid(uid);
          window.ECEPT_SUPABASE.from('profiles').select('role,credits').eq('id', uid).single()
            .then(function(prof) {
              if (prof && prof.data) {
                CB_setRole(prof.data.role || 'student');
                CB_setCredits(prof.data.credits || 0);
              }
            }).catch(function() { CB_setRole('student'); });
        } else {
          CB_setSession(false);
        }
      }).catch(function() { CB_setSession(false); });
    } catch(e2) { CB_setSession(false); }

    return function() { window.removeEventListener('resize', CB_onResize); };
  }, []);

  // ── React to global auth changes (dispatched by App) ──
  useEffect(function() {
    function CB_onAuth(ev) {
      var newUser = ev && ev.detail && ev.detail.user;
      if (newUser) {
        CB_setSession(true);
        CB_setUid(newUser.id);
        // Reload role + credits para el nuevo user
        if (window.ECEPT_SUPABASE) {
          window.ECEPT_SUPABASE.from('profiles').select('role,credits').eq('id', newUser.id).single()
            .then(function(prof) {
              if (prof && prof.data) {
                CB_setRole(prof.data.role || 'student');
                CB_setCredits(prof.data.credits || 0);
              }
            }).catch(function() {});
        }
        // Forzar reload de conversations en próxima apertura
        CB_convLoadedRef.current = false;
        if (CB_open) {
          // Si el panel ya está abierto, cargar inmediato
          CB_loadConversations();
          CB_convLoadedRef.current = true;
        }
      } else {
        CB_setSession(false);
        CB_setUid(null);
        CB_setConversations([]);
        CB_setMsgs([]);
        CB_setActiveConvId(null);
        CB_convLoadedRef.current = false;
      }
    }
    window.addEventListener('ECEPT_AUTH_CHANGE', CB_onAuth);
    return function() { window.removeEventListener('ECEPT_AUTH_CHANGE', CB_onAuth); };
  }, [CB_open]);

  // ── Load conversations when panel opens ──
  useEffect(function() {
    if (CB_open && CB_session === true && !CB_convLoadedRef.current) {
      CB_convLoadedRef.current = true;
      CB_loadConversations();
      CB_loadProjects();
    }
    if (!CB_open) { CB_convLoadedRef.current = false; }
  }, [CB_open, CB_session]);

  // ── Load messages when active conv changes ──
  useEffect(function() {
    if (!CB_activeConvId) return;
    try { localStorage.setItem('ECEPT_CHAT_LAST_CONV', CB_activeConvId); } catch(e) {}
    // Skip when CB_send just set the ID — messages already in state from optimistic update
    if (CB_skipNextConvLoad.current) { CB_skipNextConvLoad.current = false; return; }
    CB_loadConvMessages(CB_activeConvId);
  }, [CB_activeConvId]);

  // ── Auto-scroll ──
  useEffect(function() {
    if (CB_scrollRef.current) CB_scrollRef.current.scrollTop = CB_scrollRef.current.scrollHeight;
  }, [CB_msgs, CB_loading]);

  // ── Conversation loaders ──
  async function CB_saveGeneratedFlashcards(deckName, cards) {
    if (!window.ECEPT_SUPABASE) return;
    try {
      var sess = await window.ECEPT_SUPABASE.auth.getSession();
      var user = sess && sess.data && sess.data.session && sess.data.session.user;
      if (!user) {
        if (window.ECEPT_toast) window.ECEPT_toast('Iniciá sesión para guardar flashcards', 'warning');
        return;
      }
      // Crear deck custom del user
      var deckRes = await window.ECEPT_SUPABASE.from('decks').insert({
        user_id: user.id,
        name: String(deckName || 'Generadas por Elion').slice(0,80),
        description: 'Generado desde chat con Elion',
        color: '#a78bfa',
        icon: '🎴',
        is_official: false
      }).select().single();
      if (deckRes.error || !deckRes.data) {
        if (window.ECEPT_toast) window.ECEPT_toast('Error creando baraja', 'error');
        return;
      }
      var deck = deckRes.data;
      // Insertar cards
      var rows = cards.slice(0,30).map(function(c) {
        return {
          deck_id: deck.id,
          user_id: user.id,
          card_type: 'basic',
          front: String(c.q || '').slice(0, 1000),
          back: String(c.a || '').slice(0, 2000),
          tags: c.tag ? [String(c.tag).slice(0,40)] : []
        };
      });
      var insRes = await window.ECEPT_SUPABASE.from('flashcards').insert(rows);
      if (insRes.error) {
        if (window.ECEPT_toast) window.ECEPT_toast('Error guardando cards', 'error');
        return;
      }
      if (window.ECEPT_toast) window.ECEPT_toast(rows.length + ' cards guardadas en "' + deck.name + '"', 'success');
    } catch(e) {
      if (window.ECEPT_toast) window.ECEPT_toast('Error inesperado', 'error');
    }
  }

  async function CB_loadProjects() {
    if (!window.ECEPT_SUPABASE) return;
    try {
      var sess = await window.ECEPT_SUPABASE.auth.getSession();
      var token = sess && sess.data && sess.data.session && sess.data.session.access_token;
      if (!token) return;
      var r = await fetch('/api/projects', { headers: { Authorization: 'Bearer ' + token } });
      if (!r.ok) return;
      var data = await r.json();
      CB_setProjects((data && data.projects) || []);
    } catch(e) { /* silent */ }
  }

  async function CB_assignConvToProject(convId, projectId) {
    try {
      var sess = await window.ECEPT_SUPABASE.auth.getSession();
      var token = sess && sess.data && sess.data.session && sess.data.session.access_token;
      if (!token) return;
      await fetch('/api/conversations', {
        method: 'PATCH',
        headers: { 'Content-Type':'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify({ id: convId, project_id: projectId })
      });
      // Optimistic update local
      CB_setConversations(function(prev) {
        return prev.map(function(c) { return c.id === convId ? Object.assign({}, c, { project_id: projectId }) : c; });
      });
      CB_loadProjects();
      if (window.ECEPT_toast) window.ECEPT_toast(projectId ? 'Movida al proyecto' : 'Sin proyecto', 'success');
    } catch(e) {
      if (window.ECEPT_toast) window.ECEPT_toast('Error moviendo conversación', 'error');
    }
  }

  async function CB_loadConversations() {
    CB_setLoadingConvs(true);
    var CB_loadStart = Date.now();
    function CB_finish(fn) {
      var elapsed = Date.now() - CB_loadStart;
      var remaining = Math.max(0, 400 - elapsed);
      setTimeout(fn, remaining);
    }
    try {
      var sess = await window.ECEPT_SUPABASE.auth.getSession();
      var token = sess && sess.data && sess.data.session && sess.data.session.access_token;
      if (!token) { CB_finish(function(){ CB_setLoadingConvs(false); CB_setConvsLoaded(true); }); return; }
      var r = await fetch('/api/conversations', {
        headers: { 'Authorization':'Bearer '+token }
      });
      if (!r.ok) { CB_finish(function(){ CB_setLoadingConvs(false); CB_setConvsLoaded(true); }); return; }
      var convs = await r.json();
      var convsList = Array.isArray(convs) ? convs : [];

      var pendingActiveId = null;
      try {
        var lastId = localStorage.getItem('ECEPT_CHAT_LAST_CONV');
        if (lastId) {
          for (var _i = 0; _i < convsList.length; _i++) {
            if (convsList[_i].id === lastId) { pendingActiveId = lastId; break; }
          }
        }
      } catch(e) {}

      CB_finish(function(){
        CB_setConversations(convsList);
        if (pendingActiveId) CB_setActiveConvId(pendingActiveId);
        CB_setLoadingConvs(false); CB_setConvsLoaded(true);
      });
    } catch(err) {
      console.error('CB_loadConversations:', err.message);
      CB_finish(function(){ CB_setLoadingConvs(false); CB_setConvsLoaded(true); });
    }
  }

  async function CB_loadConvMessages(convId) {
    CB_setMsgsTransitioning(true);
    var t0 = Date.now();
    try {
      var sess = await window.ECEPT_SUPABASE.auth.getSession();
      var token = sess && sess.data && sess.data.session && sess.data.session.access_token;
      if (!token) { CB_setMsgsTransitioning(false); return; }
      var r = await fetch('/api/conversations?id='+convId, {
        headers: { 'Authorization':'Bearer '+token }
      });
      if (!r.ok) { CB_setMsgsTransitioning(false); return; }
      var data = await r.json();
      var mapped = (data.messages || []).map(function(m) {
        return { role:m.role, text:m.content, ts: new Date(m.created_at).getTime(), attachments: m.attachments || null };
      });
      // Min 220ms transitioning para evitar flash
      var elapsed = Date.now() - t0;
      var remaining = Math.max(0, 220 - elapsed);
      setTimeout(function() {
        CB_setMsgs(mapped);
        CB_setMsgsTransitioning(false);
      }, remaining);
    } catch(err) {
      console.error('CB_loadConvMessages:', err.message);
      CB_setMsgsTransitioning(false);
    }
  }

  // Carga preventiva de memoria cuando hay sesión: evita el lag al abrir Settings.
  useEffect(function() {
    if (CB_session !== true || CB_userNotesLoaded) return;
    CB_loadUserNotes();
  }, [CB_session, CB_userNotesLoaded]);

  // Reset de memoria al cerrar sesión.
  useEffect(function() {
    if (CB_session === false) {
      CB_setUserNotes('');
      CB_setUserNotesLoaded(false);
    }
  }, [CB_session]);

  async function CB_loadUserNotes() {
    if (CB_userNotesLoaded) return;
    try {
      var sess = await window.ECEPT_SUPABASE.auth.getSession();
      var token = sess && sess.data && sess.data.session && sess.data.session.access_token;
      if (!token) return;
      var r = await fetch('/api/user-context', {
        headers: { 'Authorization':'Bearer '+token }
      });
      var data = await r.json();
      CB_setUserNotes(data.notes || '');
      CB_setUserNotesLoaded(true);
    } catch(err) {
      console.error('CB_loadUserNotes:', err.message);
    }
  }

  async function CB_saveUserNotes() {
    CB_setNotesSaving(true);
    CB_setNotesError('');
    try {
      var sess = await window.ECEPT_SUPABASE.auth.getSession();
      var token = sess && sess.data && sess.data.session && sess.data.session.access_token;
      if (!token) { CB_setNotesError('Sesión expirada'); CB_setNotesSaving(false); return; }
      var r = await fetch('/api/user-context', {
        method:'PATCH',
        headers:{ 'Content-Type':'application/json', 'Authorization':'Bearer '+token },
        body:JSON.stringify({ notes:CB_userNotes })
      });
      var data = await r.json();
      if (r.status === 503) {
        CB_setNotesError('La memoria estará disponible próximamente.');
      } else if (!r.ok) {
        CB_setNotesError('Error al guardar. Intentá de nuevo.');
      } else {
        CB_setSettingsOpen(false);
      }
    } catch(err) {
      CB_setNotesError('Error de conexión.');
    }
    CB_setNotesSaving(false);
  }

  async function CB_renameConv(convId, title) {
    try {
      var sess = await window.ECEPT_SUPABASE.auth.getSession();
      var token = sess && sess.data && sess.data.session && sess.data.session.access_token;
      if (!token) return;
      await fetch('/api/conversations', {
        method:'PATCH',
        headers:{ 'Content-Type':'application/json', 'Authorization':'Bearer '+token },
        body:JSON.stringify({ id:convId, title:title })
      });
      CB_setConversations(function(prev) {
        return prev.map(function(c) { return c.id===convId ? Object.assign({},c,{title:title}) : c; });
      });
    } catch(err) { console.error('CB_renameConv:', err.message); }
  }

  async function CB_archiveConv(convId) {
    try {
      var sess = await window.ECEPT_SUPABASE.auth.getSession();
      var token = sess && sess.data && sess.data.session && sess.data.session.access_token;
      if (!token) return;
      await fetch('/api/conversations', {
        method:'PATCH',
        headers:{ 'Content-Type':'application/json', 'Authorization':'Bearer '+token },
        body:JSON.stringify({ id:convId, archived:true })
      });
      CB_setConversations(function(prev) { return prev.filter(function(c) { return c.id !== convId; }); });
      if (CB_activeConvId === convId) { CB_setActiveConvId(null); CB_setMsgs([]); }
    } catch(err) { console.error('CB_archiveConv:', err.message); }
  }

  async function CB_newConv(projectId) {
    try {
      var sess = await window.ECEPT_SUPABASE.auth.getSession();
      var token = sess && sess.data && sess.data.session && sess.data.session.access_token;
      if (!token) return;
      var r = await fetch('/api/conversations', {
        method:'POST',
        headers:{ 'Content-Type':'application/json', 'Authorization':'Bearer '+token },
        body:JSON.stringify({ model:CB_selectedModel })
      });
      var conv = await r.json();
      if (conv && conv.id) {
        // Si proyecto especificado, asignar inmediatamente
        if (projectId) {
          await fetch('/api/conversations', {
            method:'PATCH',
            headers:{ 'Content-Type':'application/json', 'Authorization':'Bearer '+token },
            body:JSON.stringify({ id: conv.id, project_id: projectId })
          });
          conv.project_id = projectId;
          CB_setExpandedProjects(function(prev) { var n = Object.assign({}, prev); n[projectId] = true; return n; });
        }
        CB_setConversations(function(prev) { return [conv].concat(prev); });
        CB_setActiveConvId(conv.id);
        CB_setMsgs([]);
        CB_setSidebarOpen(false);
      }
    } catch(err) { console.error('CB_newConv:', err.message); }
  }

  async function CB_deleteConvNow(convId) {
    // Eliminar conversación (soft delete vía DELETE de conversations)
    try {
      var sess = await window.ECEPT_SUPABASE.auth.getSession();
      var token = sess && sess.data && sess.data.session && sess.data.session.access_token;
      if (!token) return;
      await fetch('/api/conversations', {
        method:'DELETE',
        headers:{ 'Content-Type':'application/json', 'Authorization':'Bearer '+token },
        body:JSON.stringify({ id: convId })
      });
      CB_setConversations(function(prev) { return prev.filter(function(c) { return c.id !== convId; }); });
      if (CB_activeConvId === convId) { CB_setActiveConvId(null); CB_setMsgs([]); }
      if (window.ECEPT_toast) window.ECEPT_toast('Conversación eliminada', 'success');
    } catch(err) { if (window.ECEPT_toast) window.ECEPT_toast('Error al eliminar', 'error'); }
  }

  async function CB_archiveProjectNow(projId) {
    try {
      var sess = await window.ECEPT_SUPABASE.auth.getSession();
      var token = sess && sess.data && sess.data.session && sess.data.session.access_token;
      if (!token) return;
      await fetch('/api/projects', {
        method:'DELETE',
        headers:{ 'Content-Type':'application/json', 'Authorization':'Bearer '+token },
        body:JSON.stringify({ id: projId })
      });
      // El backend nullea project_id de las convs. Refresh local:
      CB_setProjects(function(prev) { return prev.filter(function(p) { return p.id !== projId; }); });
      CB_setConversations(function(prev) { return prev.map(function(c) { return c.project_id === projId ? Object.assign({}, c, { project_id: null }) : c; }); });
      if (window.ECEPT_toast) window.ECEPT_toast('Proyecto archivado', 'success');
    } catch(err) { if (window.ECEPT_toast) window.ECEPT_toast('Error archivando', 'error'); }
  }

  // ── Send ──
  async function CB_send() {
    var txt = CB_input.trim();
    if (CB_loading || (!txt && CB_pendingFiles.length === 0)) return;

    var modelName = CB_selectedModel;
    for (var mi = 0; mi < CB_MODELS.length; mi++) {
      if (CB_MODELS[mi].id === CB_selectedModel) { modelName = CB_MODELS[mi].name; break; }
    }

    var history = CB_msgs.slice(-9).map(function(m) { return { role:m.role, content:m.text }; });
    history.push({ role:'user', content:txt });

    // Snapshot de attachments antes de limpiarlos. Incluye name para persistir.
    var pendingAttachments = CB_pendingFiles.map(function(f) {
      return { name: f.name, mimeType: f.mimeType, data: f.data };
    });

    CB_setInput('');
    CB_setPendingFiles([]);
    CB_setLoading(true);
    CB_setConnErr('');
    // Meta-only de attachments para mostrar chips en el bubble (no incluir base64).
    var attachmentsMeta = (CB_pendingFiles || []).map(function(a) {
      return { name: a.name, mimeType: a.mimeType, size: a.size };
    });
    CB_setMsgs(function(prev) { return prev.concat([{ role:'user', text:txt, ts:Date.now(), attachments: attachmentsMeta }]); });
    // Guardar último user msg para Reintentar
    CB_lastMsgRef.current = { txt: txt, model: CB_selectedModel, modelName: modelName };

    function pushAssistantError(text, retryable) {
      CB_setMsgs(function(prev) { return prev.concat([{ role:'assistant', text:text, error:true, retryable: !!retryable, ts:Date.now() }]); });
    }

    try {
      var sess = await window.ECEPT_SUPABASE.auth.getSession();
      var token = sess && sess.data && sess.data.session && sess.data.session.access_token;
      if (!token) {
        pushAssistantError('Sesión expirada. Volvé a iniciar sesión.', false);
        CB_setLoading(false); return;
      }
      var res = await fetch('/api/chat', {
        method:'POST',
        headers:{ 'Content-Type':'application/json', 'Authorization':'Bearer '+token },
        body:JSON.stringify({ messages:history, model:CB_selectedModel, conversationId:CB_activeConvId, attachments: pendingAttachments })
      });
      var data = null;
      try { data = await res.json(); } catch(je) { data = null; }

      if (res.status === 402) {
        var need = data && data.need ? data.need : '';
        var have = data && typeof data.have === 'number' ? data.have : '';
        var creditsMsg = 'Sin créditos para ' + modelName + '.';
        if (need !== '' && have !== '') creditsMsg += ' Necesitás ' + need + ', tenés ' + have + '. Cambiá a Flash Lite o comprá créditos.';
        else creditsMsg += ' Cambiá a Flash Lite o comprá créditos.';
        pushAssistantError(creditsMsg, false);
        CB_setLoading(false); return;
      }

      if (!res.ok || !data || !data.reply) {
        // Mensaje específico según el tipo de error.
        var errMsg = 'Error de conexión. Intentá de nuevo en un momento.';
        var retryable = true;
        var upstream = data && data.upstreamStatus;
        if (data && data.error === 'gemini_error') {
          if (upstream === 429) {
            errMsg = 'El modelo ' + modelName + ' está saturado por uso. Esperá unos segundos e intentá de nuevo, o cambiá a otro modelo.';
          } else if (upstream === 503) {
            errMsg = 'El modelo ' + modelName + ' está temporalmente no disponible. Probá con otro modelo o reintentá en un minuto.';
          } else if (upstream === 0) {
            errMsg = 'No pudimos conectar con la IA. Verificá tu conexión y reintentá.';
          } else {
            errMsg = 'Hubo un problema con la IA (status ' + (upstream || res.status) + '). Reintentá o cambiá de modelo.';
          }
        } else if (res.status === 401) {
          errMsg = 'Sesión expirada. Recargá la página.';
          retryable = false;
        } else if (res.status === 0) {
          errMsg = 'Sin conexión. Verificá tu internet.';
        }
        pushAssistantError(errMsg, retryable);
        CB_setConnErr('Error');
        CB_setLoading(false); return;
      }
      if (data.quota) { CB_setQuota(data.quota); CB_setCredits(data.quota.credits); }
      CB_setMsgs(function(prev) { return prev.concat([{ role:'assistant', text:data.reply, ts:Date.now() }]); });
      // Limpiar lastMsgRef tras éxito (no hay nada que reintentar)
      CB_lastMsgRef.current = null;

      // Handle new conversation created by backend
      if (data.conversationId && data.conversationId !== CB_activeConvId) {
        // Flag prevents the loadConvMessages useEffect from overwriting optimistic messages
        CB_skipNextConvLoad.current = true;
        CB_setActiveConvId(data.conversationId);
        try { localStorage.setItem('ECEPT_CHAT_LAST_CONV', data.conversationId); } catch(e) {}
        // Refresh sidebar after title auto-generation (~1.5s)
        setTimeout(function() { CB_loadConversations(); }, 1500);
      }
    } catch(err) {
      pushAssistantError('Sin conexión. Verificá tu internet y reintentá.', true);
      CB_setConnErr(err.message || 'Error');
    }
    CB_setLoading(false);
  }

  // Reintentar el último mensaje (para errores transitorios).
  function CB_retryLast() {
    if (!CB_lastMsgRef.current || CB_loading) return;
    var last = CB_lastMsgRef.current;
    // Quitar el mensaje user previo + mensaje error del assistant antes de reenviar
    // (CB_send agrega el user msg de nuevo). Búsqueda desde el final.
    CB_setMsgs(function(prev) {
      var out = prev.slice();
      // Pop assistant error
      while (out.length > 0 && out[out.length-1].role === 'assistant' && out[out.length-1].error) out.pop();
      // Pop matching user msg
      if (out.length > 0 && out[out.length-1].role === 'user' && out[out.length-1].text === last.txt) out.pop();
      return out;
    });
    CB_setInput(last.txt);
    setTimeout(function() { CB_send(); }, 50);
  }

  // ── Derived values ──
  var isMobile = !CB_isDesktop;
  var currentModel = null;
  for (var cmIdx = 0; cmIdx < CB_MODELS.length; cmIdx++) {
    if (CB_MODELS[cmIdx].id === CB_selectedModel) { currentModel = CB_MODELS[cmIdx]; break; }
  }
  var modelLabel = currentModel ? (currentModel.icon+' '+currentModel.name) : CB_selectedModel;
  var quotaStr   = CB_quota ? (CB_quota.dailyUsed+'/'+CB_quota.dailyLimit) : '—';
  var quickPrompts = ['Explicame los betabloqueantes','DDx de dolor torácico','Resumen de cetoacidosis diabética'];

  var panelStyle;
  if (isMobile) {
    panelStyle = { position:'fixed', inset:0, background:C.bg, zIndex:9999, display:'flex', flexDirection:'column', overflow:'hidden', animation:'CB_panelInMobile 280ms cubic-bezier(0.32,0.72,0,1)' };
  } else if (CB_fullscreen) {
    panelStyle = { position:'fixed', inset:0, background:C.bg, zIndex:9999, display:'flex', flexDirection:'row', overflow:'hidden', animation:'CB_panelIn 280ms cubic-bezier(0.32,0.72,0,1)' };
  } else {
    panelStyle = {
      position:'fixed', top:24, left:24, bottom:24, width:'460px',
      borderRadius:24,
      background:'linear-gradient(180deg, rgba(13,18,36,0.95) 0%, rgba(10,14,31,0.95) 100%)',
      backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)',
      border:'1px solid rgba(96,165,250,0.20)',
      boxShadow:'0 24px 60px rgba(0,0,0,0.50), 0 0 40px rgba(96,165,250,0.08), inset 0 1px 0 rgba(255,255,255,0.05)',
      zIndex:5000,
      display:'flex', flexDirection:'column', overflow:'hidden',
      animation:'ecept_chatPanelIn 320ms cubic-bezier(0.16,1,0.3,1)'
    };
  }

  var inputContainerStyle = {
    display:'flex', alignItems:'flex-end', gap:8,
    background:C.cd, border:'1px solid '+(CB_inputFocused?'rgba(59,130,246,.4)':C.bd),
    borderRadius:14, padding:'6px 8px 6px 12px',
    transition:'border-color .2s,box-shadow .2s',
    boxShadow:CB_inputFocused?'0 0 0 3px rgba(59,130,246,.1)':'none'
  };

  // ── Sidebar renderer ──
  // Helper: timestamp relativo en español
  function CB_relTime(ts) {
    if (!ts) return '';
    var d = new Date(ts);
    var now = new Date();
    var diffMin = Math.floor((now - d) / 60000);
    if (diffMin < 1) return 'Ahora';
    if (diffMin < 60) return 'Hace ' + diffMin + 'm';
    var diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return 'Hace ' + diffHr + 'h';
    var diffDay = Math.floor(diffHr / 24);
    if (diffDay === 1) return 'Ayer';
    if (diffDay < 7) return 'Hace ' + diffDay + 'd';
    var months = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
    return d.getDate() + ' ' + months[d.getMonth()];
  }

  // Helper: clasificar conversación por antigüedad (HOY / ESTA SEMANA / ANTES)
  function CB_convBucket(ts) {
    if (!ts) return 'antes';
    var d = new Date(ts);
    var now = new Date();
    var sameDay = d.getFullYear()===now.getFullYear() && d.getMonth()===now.getMonth() && d.getDate()===now.getDate();
    if (sameDay) return 'hoy';
    var diffDay = Math.floor((now - d) / 86400000);
    if (diffDay < 7) return 'semana';
    return 'antes';
  }

  // Render con secciones de Proyectos + buckets de tiempo (chats sin proyecto)
  // Recibe convItem y sectionLabel/bucketSection como parámetros (closures de CB_renderSidebar).
  function CB_renderProjectsAndBuckets(convs, bActual, bHoy, bSemana, bAntes, convItem, sectionLabelFn, bucketSectionFn) {
    // Items por proyecto
    var byProject = {};
    convs.forEach(function(c) {
      if (c.project_id) {
        if (!byProject[c.project_id]) byProject[c.project_id] = [];
        byProject[c.project_id].push(c);
      }
    });

    // Filtrar buckets para incluir solo chats SIN project_id
    function withoutProject(arr) { return arr.filter(function(c){ return !c.project_id; }); }
    var bA = withoutProject(bActual);
    var bH = withoutProject(bHoy);
    var bS = withoutProject(bSemana);
    var bAnt = withoutProject(bAntes);

    var projectItemIdx = 0;

    function projItem(conv, projColor) {
      // Reusa convItem (definido en CB_renderSidebar) pero con padding extra
      // a la izquierda. convItem ya incluye el botón ⋮ con todas las acciones.
      var idx = projectItemIdx++;
      return e('div', { key:conv.id, style:{ marginLeft:12 } },
        convItem(conv, idx)
      );
    }

    // Header de proyecto con [+ Nueva] [⋮ Opciones] [▶ toggle]
    function projectSection(proj) {
      var convsHere = byProject[proj.id] || [];
      var expanded = !!CB_expandedProjects[proj.id];
      var menuOpen = CB_projectMenuId === proj.id;
      return e('div', { key: proj.id, style:{ marginBottom:6, position:'relative' } },
        e('div', {
          onClick: function() {
            CB_setExpandedProjects(function(prev) {
              var next = Object.assign({}, prev);
              next[proj.id] = !prev[proj.id];
              return next;
            });
            CB_setProjectMenuId(null);
          },
          style:{
            padding:'9px 8px 9px 12px', borderRadius:10, cursor:'pointer',
            background: 'linear-gradient(135deg, ' + proj.color + '14, rgba(255,255,255,0.02))',
            border: '1px solid ' + proj.color + '28',
            display:'flex', alignItems:'center', gap:6,
            transition:'border-color 180ms ease-out'
          },
          onMouseEnter:function(ev){ ev.currentTarget.style.borderColor=proj.color+'50'; },
          onMouseLeave:function(ev){ ev.currentTarget.style.borderColor=proj.color+'28'; }
        },
          e('span', { style:{ fontSize:14, flexShrink:0 } }, proj.icon || '📁'),
          e('div', { style:{ flex:1, minWidth:0 } },
            e('div', { style:{ fontSize:12, fontWeight:600, color:C.tx, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', letterSpacing:'-0.005em' } }, proj.name),
            e('div', { style:{ fontSize:10, color:'#64748b', marginTop:1 } }, convsHere.length + ' chat' + (convsHere.length===1?'':'s'))
          ),
          // [+] Nueva conv en este proyecto
          e('button', {
            onClick: function(ev) { ev.stopPropagation(); CB_setProjectMenuId(null); CB_newConv(proj.id); },
            title: 'Nueva conversación en este proyecto',
            'aria-label': 'Nueva conversación en proyecto',
            style:{ background:'transparent', border:'none', color:proj.color, fontSize:14, cursor:'pointer', width:24, height:24, display:'flex', alignItems:'center', justifyContent:'center', borderRadius:6, flexShrink:0, fontWeight:700 }
          }, '+'),
          // [⋮] Menú opciones del proyecto
          e('button', {
            onClick: function(ev) { ev.stopPropagation(); CB_setProjectMenuId(menuOpen ? null : proj.id); CB_setConvMenuId(null); },
            title: 'Opciones del proyecto',
            'aria-label': 'Opciones del proyecto',
            style:{ background: menuOpen?'rgba(96,165,250,0.15)':'transparent', border:'none', color:menuOpen?C.ac:'#64748b', fontSize:15, cursor:'pointer', width:24, height:24, display:'flex', alignItems:'center', justifyContent:'center', borderRadius:6, flexShrink:0 }
          }, '⋮'),
          // Toggle expand/collapse
          e('span', { style:{ fontSize:10, color:'#64748b', transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)', transition:'transform 200ms', flexShrink:0, marginLeft:2 } }, '▶')
        ),
        // Dropdown de opciones del proyecto
        menuOpen && e('div', {
          onClick: function(ev) { ev.stopPropagation(); },
          style:{
            position:'absolute', top:'100%', right:6, zIndex:30,
            background:'rgba(17,23,58,0.95)',
            backdropFilter:'blur(12px)', WebkitBackdropFilter:'blur(12px)',
            border:'1px solid rgba(96,165,250,0.20)',
            borderRadius:10, padding:4, minWidth:180,
            boxShadow:'0 8px 24px rgba(0,0,0,0.40)',
            animation:'ecept_modalIn 180ms cubic-bezier(0.16,1,0.3,1)',
            marginTop:4
          }
        },
          e('button', {
            onClick: function(ev) { ev.stopPropagation(); CB_setPmEditingProj(proj); CB_setPmOpen(true); CB_setProjectMenuId(null); },
            style:{ display:'flex', alignItems:'center', gap:8, width:'100%', padding:'9px 12px', background:'none', border:'none', color:C.tx, fontSize:13, cursor:'pointer', textAlign:'left', borderRadius:6, fontFamily:'inherit' }
          }, e('span', null, '✏️'), e('span', null, 'Editar proyecto')),
          e('button', {
            onClick: function(ev) { ev.stopPropagation(); CB_setProjectMenuId(null); CB_newConv(proj.id); },
            style:{ display:'flex', alignItems:'center', gap:8, width:'100%', padding:'9px 12px', background:'none', border:'none', color:C.tx, fontSize:13, cursor:'pointer', textAlign:'left', borderRadius:6, fontFamily:'inherit' }
          }, e('span', null, '➕'), e('span', null, 'Nueva conversación')),
          e('div', { style:{ height:1, background:'rgba(255,255,255,0.05)', margin:'4px 8px' } }),
          e('button', {
            onClick: function(ev) { ev.stopPropagation(); CB_setArchiveProjConfirm(proj); CB_setProjectMenuId(null); },
            style:{ display:'flex', alignItems:'center', gap:8, width:'100%', padding:'9px 12px', background:'none', border:'none', color:'#ef4444', fontSize:13, cursor:'pointer', textAlign:'left', borderRadius:6, fontFamily:'inherit' }
          }, e('span', null, '🗑'), e('span', null, 'Archivar proyecto'))
        ),
        expanded && e('div', { style:{ marginTop:4 } },
          convsHere.length === 0
            ? e('div', { style:{ padding:'8px 12px 8px 24px', fontSize:11, color:'#64748b', fontStyle:'italic' } }, 'Sin conversaciones aún')
            : convsHere.map(function(c){ return projItem(c, proj.color); })
        )
      );
    }

    return e('div', null,
      // Sección Proyectos
      CB_projects.length > 0 && e('div', null,
        sectionLabelFn('📁 Proyectos'),
        CB_projects.map(function(p){ return projectSection(p); })
      ),
      // Botón nuevo proyecto + gestionar
      e('div', { style:{ display:'flex', gap:6, padding:'4px 12px 8px' } },
        e('button', {
          onClick: function() { CB_setPmOpen(true); },
          style:{ flex:1, padding:'7px 10px', background:'rgba(167,139,250,0.10)', border:'1px dashed rgba(167,139,250,0.35)', color:'#a78bfa', fontSize:11, fontWeight:600, cursor:'pointer', borderRadius:8, fontFamily:'inherit' }
        }, CB_projects.length === 0 ? '+ Crear proyecto' : 'Gestionar proyectos')
      ),
      // Buckets de tiempo (chats sin project_id)
      (bA.length + bH.length + bS.length + bAnt.length > 0) && e('div', null,
        CB_projects.length > 0 ? sectionLabelFn('💬 Sueltas') : null,
        bucketSectionFn('✦ Actual', bA),
        bucketSectionFn('Hoy', bH),
        bucketSectionFn('Esta semana', bS),
        bucketSectionFn('Antes', bAnt)
      )
    );
  }

  function CB_renderSidebar(permanent) {
    var sidebarStyle = permanent
      ? { width:300, flexShrink:0, borderRight:'1px solid rgba(96,165,250,0.10)', display:'flex', flexDirection:'column', overflow:'hidden', background:'linear-gradient(180deg,rgba(13,18,36,0.40) 0%,rgba(10,14,31,0.30) 100%)' }
      : { position:'absolute', top:0, left:0, bottom:0, width:300, zIndex:20,
          background:'linear-gradient(180deg,#0d1224 0%,#060a14 100%)',
          borderRight:'1px solid rgba(96,165,250,0.20)',
          display:'flex', flexDirection:'column', overflow:'hidden',
          animation:'ecept_sidebarIn 240ms cubic-bezier(0.16,1,0.3,1)',
          boxShadow:'4px 0 24px rgba(0,0,0,0.4)' };

    var q = (CB_sidebarQ || '').trim().toLowerCase();
    var convs = CB_conversations.filter(function(c) {
      if (!q) return true;
      var t = (c.title || 'Nueva conversación').toLowerCase();
      return t.indexOf(q) >= 0;
    });

    // Particionar en buckets: actual / hoy / semana / antes
    var bActual = [], bHoy = [], bSemana = [], bAntes = [];
    convs.forEach(function(c) {
      if (c.id === CB_activeConvId) { bActual.push(c); return; }
      var b = CB_convBucket(c.updated_at || c.created_at);
      if (b === 'hoy') bHoy.push(c);
      else if (b === 'semana') bSemana.push(c);
      else bAntes.push(c);
    });

    function sectionLabel(text) {
      return e('div', { style:{
        fontSize:10, fontWeight:700, color:'#475569',
        letterSpacing:'0.10em', textTransform:'uppercase',
        padding:'14px 12px 6px'
      }}, text);
    }

    function convItem(conv, idx) {
      var isActive = conv.id === CB_activeConvId;
      var isRenaming = CB_renamingId === conv.id;
      var isMenuOpen = CB_convMenuId === conv.id;
      var msgCount = conv.message_count || conv.msg_count || null;
      var subtitle = (msgCount ? (msgCount + ' mensaje' + (msgCount===1?'':'s') + ' · ') : '') + CB_relTime(conv.updated_at || conv.created_at);

      var itemStyle = isActive
        ? {
            padding:'10px 36px 10px 14px', borderRadius:12, cursor:'pointer',
            background:'linear-gradient(135deg, rgba(96,165,250,0.14), rgba(167,139,250,0.10))',
            border:'1px solid rgba(96,165,250,0.30)',
            boxShadow:'0 0 0 1px rgba(255,255,255,0.04) inset, 0 2px 8px rgba(96,165,250,0.10)',
            position:'relative',
            transition:'all 220ms cubic-bezier(0.16,1,0.3,1)',
            animation:'ecept_fadeSlideUp 280ms cubic-bezier(0.16,1,0.3,1) ' + (idx*30) + 'ms both'
          }
        : {
            padding:'10px 36px 10px 14px', borderRadius:12, cursor:'pointer',
            background:'transparent',
            border:'1px solid transparent',
            position:'relative',
            transition:'all 220ms cubic-bezier(0.16,1,0.3,1)',
            animation:'ecept_fadeSlideUp 280ms cubic-bezier(0.16,1,0.3,1) ' + (idx*30) + 'ms both'
          };

      return e('div', { key:conv.id, style:{ marginBottom:4, position:'relative' } },
        e('div', {
          className:'CB_convItem',
          style:itemStyle,
          onClick: function() {
            if (CB_renamingId === conv.id) return;
            CB_setActiveConvId(conv.id);
            CB_setConvMenuId(null);
            if (!permanent) CB_setSidebarOpen(false);
          },
          onMouseEnter: function(ev) {
            if (isActive) return;
            ev.currentTarget.style.background = 'rgba(96,165,250,0.06)';
            ev.currentTarget.style.borderColor = 'rgba(96,165,250,0.12)';
            ev.currentTarget.style.transform = 'translateX(2px)';
          },
          onMouseLeave: function(ev) {
            if (isActive) return;
            ev.currentTarget.style.background = 'transparent';
            ev.currentTarget.style.borderColor = 'transparent';
            ev.currentTarget.style.transform = 'translateX(0)';
          }
        },
          isRenaming
            ? e('input', {
                autoFocus:true,
                value:CB_renameValue,
                onChange:function(ev) { CB_setRenameValue(ev.target.value); },
                onKeyDown:function(ev) {
                  if (ev.key==='Enter') {
                    var t = CB_renameValue.trim();
                    if (t) CB_renameConv(conv.id, t);
                    CB_setRenamingId(null);
                  } else if (ev.key==='Escape') {
                    CB_setRenamingId(null);
                  }
                },
                onBlur:function() { CB_setRenamingId(null); },
                onClick:function(ev) { ev.stopPropagation(); },
                style:{ width:'100%', background:'rgba(96,165,250,0.10)', border:'1px solid rgba(96,165,250,0.40)', borderRadius:8, color:C.tx, fontSize:13, outline:'none', padding:'6px 10px' }
              })
            : e('div', null,
                e('div', { style:{ fontSize:13, color: isActive ? C.tx : '#cbd5e1', fontWeight: isActive ? 600 : 500, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', lineHeight:1.3, letterSpacing:'-0.01em' } }, conv.title || 'Nueva conversación'),
                e('div', { style:{ fontSize:11, color:'#64748b', marginTop:3, lineHeight:1.3 } }, subtitle)
              )
        ),
        !isRenaming && e('button', {
          onClick:function(ev) { ev.stopPropagation(); CB_setConvMenuId(isMenuOpen ? null : conv.id); },
          'aria-label':'Opciones',
          style:{
            position:'absolute', right:6, top:'50%', transform:'translateY(-50%)',
            width:26, height:26, borderRadius:6, border:'none',
            background: isMenuOpen ? 'rgba(96,165,250,0.18)' : 'transparent',
            color: isMenuOpen ? C.ac : '#64748b',
            cursor:'pointer', fontSize:16, lineHeight:1, padding:0,
            display:'flex', alignItems:'center', justifyContent:'center',
            transition:'background 180ms ease-out'
          }
        }, '⋮'),
        isMenuOpen && e('div', {
          onClick:function(ev) { ev.stopPropagation(); },
          style:{
            position:'absolute', top:'100%', right:4, zIndex:30,
            background:'rgba(17,23,58,0.95)',
            backdropFilter:'blur(12px)', WebkitBackdropFilter:'blur(12px)',
            border:'1px solid rgba(96,165,250,0.20)',
            borderRadius:10, padding:4, minWidth:150,
            boxShadow:'0 8px 24px rgba(0,0,0,0.40)',
            animation:'ecept_modalIn 180ms cubic-bezier(0.16,1,0.3,1)'
          }
        },
          e('button', {
            onClick:function(ev) { ev.stopPropagation(); CB_setRenameValue(conv.title || ''); CB_setRenamingId(conv.id); CB_setConvMenuId(null); },
            style:{ display:'block', width:'100%', padding:'9px 12px', background:'none', border:'none', color:C.tx, fontSize:13, cursor:'pointer', textAlign:'left', borderRadius:6, fontFamily:'inherit' }
          }, '✎ Renombrar'),
          // Mover a proyecto
          CB_projects.length > 0 && e('div', { style:{ borderTop:'1px solid rgba(255,255,255,0.04)', margin:'4px 0', paddingTop:4 } },
            e('div', { style:{ padding:'4px 12px', fontSize:10, color:'#64748b', letterSpacing:'0.10em', textTransform:'uppercase' } }, 'Mover a proyecto'),
            CB_projects.map(function(p) {
              var isHere = conv.project_id === p.id;
              return e('button', { key: p.id,
                onClick:function(ev) { ev.stopPropagation(); CB_assignConvToProject(conv.id, p.id); CB_setConvMenuId(null); },
                style:{ display:'flex', alignItems:'center', gap:8, width:'100%', padding:'7px 12px', background: isHere?'rgba(167,139,250,0.10)':'none', border:'none', color:isHere?p.color:C.tx, fontSize:12, cursor:'pointer', textAlign:'left', borderRadius:6, fontFamily:'inherit' }
              },
                e('span', null, p.icon || '📁'),
                e('span', { style:{ flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' } }, p.name),
                isHere && e('span', { style:{ fontSize:11 } }, '✓')
              );
            }),
            conv.project_id && e('button', {
              onClick:function(ev) { ev.stopPropagation(); CB_assignConvToProject(conv.id, null); CB_setConvMenuId(null); },
              style:{ display:'block', width:'100%', padding:'7px 12px', background:'none', border:'none', color:C.mt, fontSize:11, cursor:'pointer', textAlign:'left', borderRadius:6, fontFamily:'inherit', fontStyle:'italic' }
            }, '↩ Quitar de proyecto')
          ),
          e('button', {
            onClick:function(ev) { ev.stopPropagation(); CB_setDeleteConvConfirm(conv); CB_setConvMenuId(null); },
            style:{ display:'flex', alignItems:'center', gap:8, width:'100%', padding:'9px 12px', background:'none', border:'none', color:'#ef4444', fontSize:13, cursor:'pointer', textAlign:'left', borderRadius:6, fontFamily:'inherit' }
          }, e('span', null, '🗑'), e('span', null, 'Eliminar'))
        )
      );
    }

    var bucketIdx = 0;
    function bucketSection(label, list) {
      if (list.length === 0) return null;
      var items = list.map(function(c) { var n = bucketIdx++; return convItem(c, n); });
      return e('div', null, sectionLabel(label), items);
    }

    var totalConvs = CB_conversations.length;
    var countLabel = totalConvs === 0 ? 'Sin conversaciones aún' : (totalConvs + ' chat' + (totalConvs===1?'':'s'));

    return e('div', {
      id: permanent ? null : 'CB_floatingSidebar',
      style: sidebarStyle,
      onClick: function(ev) { ev.stopPropagation(); }
    },
      // ── Sidebar header ──
      e('div', { style:{ padding:'16px 18px 12px', borderBottom:'1px solid rgba(96,165,250,0.10)', flexShrink:0 } },
        e('div', { style:{ display:'flex', alignItems:'center', gap:10, marginBottom:4 } },
          e('div', { style:{ flex:1, fontSize:16, fontWeight:700, color:C.tx, letterSpacing:'-0.015em' } }, 'Conversaciones'),
          e('button', {
            onClick: CB_newConv,
            'aria-label':'Nueva conversación',
            title:'Nueva conversación',
            style:{ background:'linear-gradient(135deg,#60a5fa,#a78bfa)', border:'none', borderRadius:10, color:'#fff', width:32, height:32, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', fontSize:18, fontWeight:600, flexShrink:0, boxShadow:'0 2px 8px rgba(167,139,250,0.30)', transition:'transform 200ms cubic-bezier(0.34,1.56,0.64,1)' },
            onMouseEnter: function(ev) { ev.currentTarget.style.transform='scale(1.08)'; },
            onMouseLeave: function(ev) { ev.currentTarget.style.transform='scale(1)'; }
          }, '+'),
          // ✕ cerrar sidebar — SOLO si NO es fullscreen permanente
          !permanent && e('button', {
            onClick: function() { CB_setSidebarOpen(false); },
            'aria-label':'Cerrar sidebar',
            title:'Cerrar',
            style:{ background:'transparent', border:'1px solid '+C.bd, borderRadius:10, color:C.mt, width:32, height:32, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', fontSize:14, flexShrink:0, transition:'all 200ms ease-out' },
            onMouseEnter: function(ev) { ev.currentTarget.style.background='rgba(255,255,255,0.04)'; ev.currentTarget.style.borderColor='rgba(96,165,250,0.30)'; },
            onMouseLeave: function(ev) { ev.currentTarget.style.background='transparent'; ev.currentTarget.style.borderColor=C.bd; }
          }, '✕')
        ),
        e('div', { style:{ fontSize:11, color:'#64748b', letterSpacing:'0.04em' } }, countLabel)
      ),

      // ── Search bar ──
      totalConvs > 0 && e('div', { style:{ padding:'10px 14px 8px', flexShrink:0 } },
        e('div', { style:{ position:'relative' } },
          e('span', { 'aria-hidden':'true', style:{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', fontSize:13, color:'#64748b', pointerEvents:'none' } }, '🔍'),
          e('input', {
            type:'text',
            placeholder:'Buscar conversación...',
            value:CB_sidebarQ,
            onChange:function(ev) { CB_setSidebarQ(ev.target.value); },
            style:{
              width:'100%',
              padding:'8px 12px 8px 34px',
              background:'rgba(13,18,36,0.6)',
              border:'1px solid '+C.bd,
              borderRadius:10,
              color:C.tx,
              fontSize:12,
              fontFamily:'inherit',
              outline:'none',
              transition:'border-color 200ms ease-out, box-shadow 200ms ease-out',
              boxSizing:'border-box'
            },
            onFocus:function(ev) { ev.currentTarget.style.borderColor='rgba(96,165,250,0.40)'; ev.currentTarget.style.boxShadow='0 0 0 3px rgba(96,165,250,0.08)'; },
            onBlur:function(ev) { ev.currentTarget.style.borderColor=C.bd; ev.currentTarget.style.boxShadow='none'; }
          })
        )
      ),

      // ── Conversation list ──
      e('div', { style:{ flex:1, overflowY:'auto', padding:'0 10px 12px' } },
        CB_loadingConvs && (window.SkeletonRow ? e('div', { style:{ display:'flex', flexDirection:'column', gap:4, padding:'8px 0' } }, e(window.SkeletonRow), e(window.SkeletonRow), e(window.SkeletonRow), e(window.SkeletonRow)) : e('div', { style:{ color:C.dm, fontSize:12, padding:'12px 8px', textAlign:'center' } }, 'Cargando…')),

        // Empty state — sin conversaciones
        !CB_loadingConvs && totalConvs === 0 && e('div', { style:{ padding:'40px 16px', textAlign:'center' } },
          e('div', { style:{ marginBottom:14, display:'flex', justifyContent:'center' } },
            e(window.Logo || 'div', { size:48, glow:true, idSuffix:'sbempty' })
          ),
          e('div', { style:{ fontSize:14, fontWeight:600, color:C.tx, marginBottom:6, letterSpacing:'-0.01em' } }, 'Empezá tu primera conversación'),
          e('div', { style:{ color:'#64748b', fontSize:11, lineHeight:1.5 } }, 'Las conversaciones se guardan automáticamente.')
        ),

        // Empty state — search sin resultados
        !CB_loadingConvs && totalConvs > 0 && convs.length === 0 && q && e('div', { style:{ padding:'24px 12px', textAlign:'center' } },
          e('div', { style:{ fontSize:24, marginBottom:8, opacity:0.5 } }, '🔍'),
          e('div', { style:{ fontSize:12, color:C.mt } }, 'Sin resultados para "' + CB_sidebarQ + '"')
        ),

        // Sections — Proyectos primero (si hay), después buckets de tiempo de "sueltas"
        convs.length > 0 && CB_renderProjectsAndBuckets(convs, bActual, bHoy, bSemana, bAntes, convItem, sectionLabel, bucketSection)
      )
    );
  }

  // ── Model picker ──
  function CB_renderModelPicker() {
    return ReactDOM.createPortal(
      e('div', {
        style:{ position:'fixed', inset:0, zIndex:10000, background:'rgba(6,10,20,0.85)', backdropFilter:'blur(12px)', WebkitBackdropFilter:'blur(12px)', display:'flex', alignItems:'center', justifyContent:'center', padding:'20px', animation:'ecept_fadeIn 240ms cubic-bezier(0.16,1,0.3,1)' },
        onClick:function(ev) { if(ev.target===ev.currentTarget) CB_setModelPickerOpen(false); }
      },
        e('div', {
          style:{
            width:'100%', maxWidth:540,
            background:'linear-gradient(180deg,rgba(13,18,36,0.96) 0%,rgba(10,14,31,0.96) 100%)',
            backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)',
            border:'1px solid rgba(167,139,250,0.22)',
            borderRadius:24,
            boxShadow:'0 24px 60px rgba(0,0,0,0.50), 0 0 40px rgba(167,139,250,0.08), inset 0 1px 0 rgba(255,255,255,0.05)',
            overflow:'hidden',
            animation:'ecept_modalIn 320ms cubic-bezier(0.16,1,0.3,1)',
            maxHeight:'90vh',
            display:'flex',
            flexDirection:'column'
          }
        },
          // Header del modal
          e('div', { style:{ padding:'28px 28px 20px', textAlign:'center', flexShrink:0 } },
            e('h2', { style:{ margin:'0 0 6px', fontSize:24, fontWeight:800, letterSpacing:'-0.02em', background:'linear-gradient(135deg,#60a5fa,#a78bfa)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', lineHeight:1.15 } }, 'Elegí el modelo de IA'),
            e('p', { style:{ margin:0, fontSize:13, color:C.mt, lineHeight:1.5 } }, 'Cada uno se especializa en algo distinto')
          ),
          // Cards
          e('div', { style:{ padding:'0 24px 16px', display:'flex', flexDirection:'column', gap:12, overflowY:'auto', flex:1 } },
            CB_MODEL_INFO.map(function(info, idx) {
              var isSelected = CB_selectedModel === info.id;
              var tierModels = CB_TIER_MODELS[CB_role] || CB_TIER_MODELS.student;
              var inTier = false;
              for (var _ti = 0; _ti < tierModels.length; _ti++) {
                if (tierModels[_ti] === info.id) { inTier = true; break; }
              }
              var cost = 0;
              for (var _ci = 0; _ci < CB_MODELS.length; _ci++) {
                if (CB_MODELS[_ci].id === info.id) { cost = CB_MODELS[_ci].cost; break; }
              }
              var canAfford = CB_credits >= cost;
              var available = inTier || canAfford || CB_role === 'admin';
              var isPremiumModel = info.id === 'gemini-2.5-pro';
              var locked = !available;

              // Glow del color accent del modelo
              var cardBg = isSelected
                ? info.gradient
                : 'linear-gradient(135deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))';
              var cardBorder = isSelected
                ? info.accent
                : info.accent + '22';
              var cardShadow = isSelected
                ? '0 0 32px ' + info.accent + '33, 0 4px 12px rgba(0,0,0,0.20)'
                : 'none';

              return e('div', {
                key:info.id,
                onClick:function() {
                  if (locked) {
                    if (window.ECEPT_toast) window.ECEPT_toast('Necesitás ' + (cost - CB_credits) + ' créditos más para ' + info.name, 'warning');
                    return;
                  }
                  CB_setSelectedModel(info.id);
                  try { localStorage.setItem('ECEPT_CHAT_MODEL', info.id); } catch(e) {}
                  CB_setModelPickerOpen(false);
                },
                style:{
                  padding:'20px 22px',
                  borderRadius:18,
                  cursor: locked ? 'not-allowed' : 'pointer',
                  background:cardBg,
                  border:'1px solid ' + (isSelected ? cardBorder : (locked ? C.bd : info.accent + '33')),
                  opacity: locked ? 0.55 : 1,
                  transition:'transform 220ms cubic-bezier(0.16,1,0.3,1), border-color 220ms ease-out, box-shadow 220ms ease-out',
                  position:'relative',
                  boxShadow:cardShadow,
                  animation:'ecept_fadeSlideUp 320ms cubic-bezier(0.16,1,0.3,1) ' + (idx * 80) + 'ms both'
                },
                onMouseEnter: function(ev) {
                  if (locked || isSelected) return;
                  ev.currentTarget.style.transform = 'translateY(-2px)';
                  ev.currentTarget.style.borderColor = info.accent + '66';
                  ev.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.30), 0 0 24px ' + info.accent + '20';
                },
                onMouseLeave: function(ev) {
                  if (locked || isSelected) return;
                  ev.currentTarget.style.transform = 'translateY(0)';
                  ev.currentTarget.style.borderColor = info.accent + '33';
                  ev.currentTarget.style.boxShadow = 'none';
                }
              },
                // Top row: icon + nombre + tagline + badge/check
                e('div', { style:{ display:'flex', alignItems:'flex-start', gap:14, marginBottom:10 } },
                  e('div', { style:{
                    fontSize:26,
                    width:48, height:48,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    borderRadius:14,
                    background:isPremiumModel ? 'linear-gradient(135deg, rgba(251,191,36,0.18), rgba(245,158,11,0.10))' : info.accent + '14',
                    border:'1px solid ' + (isPremiumModel ? 'rgba(251,191,36,0.30)' : info.accent + '24'),
                    flexShrink:0
                  }}, info.icon),
                  e('div', { style:{ flex:1, minWidth:0 } },
                    e('div', { style:{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap', marginBottom:2 } },
                      e('span', { style:{ fontSize:16, fontWeight:700, color:isSelected?info.accent:C.tx, letterSpacing:'-0.015em', textTransform:'uppercase' } }, info.name),
                      info.badge && e('span', { style:{ fontSize:9, fontWeight:800, letterSpacing:'0.10em', padding:'3px 8px', borderRadius:6, background:isPremiumModel?'linear-gradient(135deg,#fbbf24,#f59e0b)':info.accent+'24', color:isPremiumModel?'#0a0e1f':info.accent, border:isPremiumModel?'none':'1px solid '+info.accent+'55' } }, info.badge)
                    ),
                    e('div', { style:{ fontSize:13, color:C.mt, lineHeight:1.4 } }, info.tagline)
                  ),
                  // Estado: ✓ activo / 🔒 locked
                  isSelected && e('span', { 'aria-hidden':'true', style:{ fontSize:18, color:info.accent, fontWeight:700, marginLeft:'auto' } }, '✓'),
                  locked && !isSelected && e('span', { 'aria-hidden':'true', style:{ fontSize:14, color:C.dm, marginLeft:'auto' } }, '🔒')
                ),
                // Description
                e('div', { style:{ fontSize:13, color:'#cbd5e1', lineHeight:1.55, marginBottom:14 } }, info.description),
                // Divider
                e('div', { style:{ height:1, background:isSelected?info.accent+'30':'rgba(255,255,255,0.06)', margin:'0 0 12px' } }),
                // Bullets
                e('div', { style:{ display:'flex', flexDirection:'column', gap:6 } },
                  info.bullets.map(function(b, bi) {
                    return e('div', { key:bi, style:{ fontSize:12, color:C.mt, display:'flex', gap:8, lineHeight:1.5 } },
                      e('span', { style:{ color:info.accent, fontSize:11, marginTop:1, flexShrink:0 } }, '•'),
                      e('span', null, b)
                    );
                  })
                ),
                // Locked footer
                locked && e('div', { style:{ marginTop:12, fontSize:12, color:'#fbbf24', display:'flex', alignItems:'center', gap:6 } },
                  e('span', null, '🪙'),
                  e('span', null, 'Necesitás ' + (cost - CB_credits) + ' créditos más')
                )
              );
            })
          ),
          // Footer tip
          e('div', { style:{ padding:'14px 24px 22px', borderTop:'1px solid rgba(255,255,255,0.04)', textAlign:'center', flexShrink:0 } },
            e('div', { style:{ fontSize:12, color:C.mt, lineHeight:1.5 } },
              e('span', null, '💡 '),
              e('span', null, 'Empezá con Flash Lite para lo cotidiano')
            ),
            CB_role === 'student' && e('button', {
              onClick: function() {
                if (window.ECEPT_toast) window.ECEPT_toast('Sistema Premium próximamente', 'info');
              },
              style:{
                marginTop:10,
                background:'none',
                border:'none',
                color:'#a78bfa',
                fontSize:12,
                fontWeight:600,
                cursor:'pointer',
                fontFamily:'inherit',
                padding:'4px 8px',
                letterSpacing:'-0.01em'
              }
            }, 'Mejorá a Premium para acceso completo →'),
            e('button', {
              onClick:function() { CB_setModelPickerOpen(false); },
              style:{ display:'block', margin:'12px auto 0', padding:'9px 22px', borderRadius:10, border:'1px solid '+C.bd, background:'none', color:C.mt, fontSize:13, cursor:'pointer', fontWeight:600, fontFamily:'inherit' }
            }, 'Cerrar')
          )
        )
      ),
      document.body
    );
  }

  // ── Settings modal ──
  function CB_renderSettings() {
    return ReactDOM.createPortal(
      e('div', {
        style:{ position:'fixed', inset:0, zIndex:10000, background:'rgba(6,10,20,0.85)', backdropFilter:'blur(8px)', WebkitBackdropFilter:'blur(8px)', display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' },
        onClick:function(ev) { if(ev.target===ev.currentTarget) CB_setSettingsOpen(false); }
      },
        e('div', { style:{ width:'100%', maxWidth:440, background:'linear-gradient(180deg,#0d1224 0%,#060a14 100%)', border:'1px solid rgba(167,139,250,.25)', borderRadius:20, boxShadow:'0 20px 60px rgba(0,0,0,.6)', overflow:'hidden' } },
          e('div', { style:{ padding:'20px 20px 16px', borderBottom:'1px solid rgba(167,139,250,.15)', display:'flex', alignItems:'center', gap:10 } },
            e('span', { style:{ fontSize:24 } }, '🧠'),
            e('div', null,
              e('h2', { style:{ margin:'0 0 2px', fontSize:16, fontWeight:800, color:C.tx } }, 'Memoria de Elion'),
              e('p', { style:{ margin:0, fontSize:12, color:C.mt } }, 'Elion va a recordar esto en todas tus conversaciones.')
            )
          ),
          e('div', { style:{ padding:'16px 20px' } },
            e('p', { style:{ margin:'0 0 12px', fontSize:12, color:C.mt, lineHeight:1.6 } }, 'Útil para tu especialidad, año de carrera, preferencias.'),
            e('textarea', {
              value:CB_userNotes,
              onChange:function(ev) { CB_setUserNotes(ev.target.value.slice(0,1500)); },
              rows:5,
              placeholder:'Ej: estudio cardio para examen, prefiero casos clínicos breves...',
              style:{ width:'100%', padding:'10px 12px', borderRadius:10, border:'1px solid '+C.bd, background:C.bg, color:C.tx, fontSize:13, outline:'none', boxSizing:'border-box', fontFamily:'inherit', resize:'vertical', lineHeight:1.6 }
            }),
            e('div', { style:{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:6 } },
              e('span', { style:{ fontSize:11, color:C.dm } }, CB_userNotes.length+' / 1500 caracteres'),
              CB_notesError && e('span', { style:{ fontSize:11, color:'#fbbf24' } }, CB_notesError)
            )
          ),
          e('div', { style:{ padding:'8px 16px 16px', display:'flex', gap:8, justifyContent:'flex-end' } },
            e('button', {
              onClick:function() { CB_setSettingsOpen(false); CB_setNotesError(''); },
              style:{ padding:'9px 18px', borderRadius:10, border:'1px solid '+C.bd, background:'none', color:C.mt, fontSize:13, cursor:'pointer', fontWeight:600 }
            }, 'Cancelar'),
            e('button', {
              onClick:CB_saveUserNotes,
              disabled:CB_notesSaving,
              style:{ padding:'9px 20px', borderRadius:10, border:'none', background:'linear-gradient(135deg,#a78bfa,#60a5fa)', color:'#fff', fontSize:13, cursor:CB_notesSaving?'default':'pointer', fontWeight:700, opacity:CB_notesSaving?0.7:1 }
            }, CB_notesSaving ? 'Guardando…' : 'Guardar')
          )
        )
      ),
      document.body
    );
  }

  // ── Main render ───────────────────────────────────────────────
  return e('div', null,

    // Model picker portal
    CB_modelPickerOpen && CB_renderModelPicker(),

    // Projects manager portal
    window.ProjectsManager && e(window.ProjectsManager, {
      open: CB_pmOpen,
      onClose: function() { CB_setPmOpen(false); CB_setPmEditingProj(null); },
      user: props.user,
      editingProject: CB_pmEditingProj,
      onChange: function(list) { CB_setProjects(list); }
    }),

    // Modal: confirmar eliminar conversación
    CB_deleteConvConfirm && ReactDOM.createPortal(
      e('div', {
        style:{ position:'fixed', inset:0, zIndex:10010, background:'rgba(6,10,20,0.85)', backdropFilter:'blur(8px)', WebkitBackdropFilter:'blur(8px)', display:'flex', alignItems:'center', justifyContent:'center', padding:'20px', animation:'ecept_fadeIn 240ms ease-out' },
        onClick: function(ev) { if (ev.target === ev.currentTarget) CB_setDeleteConvConfirm(null); }
      },
        e('div', { style:{ width:'100%', maxWidth:420, background:'linear-gradient(180deg,rgba(13,18,36,0.96),rgba(10,14,31,0.96))', border:'1px solid rgba(239,68,68,0.30)', borderRadius:16, padding:'24px', animation:'ecept_modalIn 280ms cubic-bezier(0.16,1,0.3,1)', boxShadow:'0 20px 48px rgba(0,0,0,0.40)' } },
          e('div', { style:{ fontSize:18, fontWeight:700, color:C.tx, marginBottom:8, letterSpacing:'-0.015em' } }, 'Eliminar conversación'),
          e('div', { style:{ fontSize:13, color:C.mt, marginBottom:20, lineHeight:1.55 } },
            '¿Eliminar "', e('span', { style:{ color:C.tx, fontWeight:600 } }, CB_deleteConvConfirm.title || 'esta conversación'), '"? No se puede deshacer.'
          ),
          e('div', { style:{ display:'flex', gap:10, justifyContent:'flex-end' } },
            e('button', {
              onClick: function() { CB_setDeleteConvConfirm(null); },
              style:{ padding:'10px 18px', borderRadius:10, border:'1px solid '+C.bd, background:'transparent', color:C.tx, fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }
            }, 'Cancelar'),
            e('button', {
              onClick: function() { var id = CB_deleteConvConfirm.id; CB_setDeleteConvConfirm(null); CB_deleteConvNow(id); },
              style:{ padding:'10px 22px', borderRadius:10, border:'none', background:'linear-gradient(135deg,#ef4444,#dc2626)', color:'#fff', fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:'inherit', boxShadow:'0 4px 12px rgba(239,68,68,0.30)' }
            }, 'Eliminar')
          )
        )
      ), document.body
    ),

    // Modal: confirmar archivar proyecto
    CB_archiveProjConfirm && ReactDOM.createPortal(
      e('div', {
        style:{ position:'fixed', inset:0, zIndex:10010, background:'rgba(6,10,20,0.85)', backdropFilter:'blur(8px)', WebkitBackdropFilter:'blur(8px)', display:'flex', alignItems:'center', justifyContent:'center', padding:'20px', animation:'ecept_fadeIn 240ms ease-out' },
        onClick: function(ev) { if (ev.target === ev.currentTarget) CB_setArchiveProjConfirm(null); }
      },
        e('div', { style:{ width:'100%', maxWidth:440, background:'linear-gradient(180deg,rgba(13,18,36,0.96),rgba(10,14,31,0.96))', border:'1px solid rgba(251,191,36,0.30)', borderRadius:16, padding:'24px', animation:'ecept_modalIn 280ms cubic-bezier(0.16,1,0.3,1)', boxShadow:'0 20px 48px rgba(0,0,0,0.40)' } },
          e('div', { style:{ fontSize:18, fontWeight:700, color:C.tx, marginBottom:8, letterSpacing:'-0.015em' } }, 'Archivar proyecto'),
          e('div', { style:{ fontSize:13, color:C.mt, marginBottom:20, lineHeight:1.55 } },
            '¿Archivar "', e('span', { style:{ color:C.tx, fontWeight:600 } }, CB_archiveProjConfirm.name), '"? Las ',
            e('span', { style:{ color:C.tx, fontWeight:600 } }, (CB_archiveProjConfirm.conv_count || 0) + ' conversación' + (CB_archiveProjConfirm.conv_count===1?'':'es')),
            ' del proyecto pasarán a Sueltas. Esta acción no se puede deshacer fácilmente.'
          ),
          e('div', { style:{ display:'flex', gap:10, justifyContent:'flex-end' } },
            e('button', {
              onClick: function() { CB_setArchiveProjConfirm(null); },
              style:{ padding:'10px 18px', borderRadius:10, border:'1px solid '+C.bd, background:'transparent', color:C.tx, fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }
            }, 'Cancelar'),
            e('button', {
              onClick: function() { var id = CB_archiveProjConfirm.id; CB_setArchiveProjConfirm(null); CB_archiveProjectNow(id); },
              style:{ padding:'10px 22px', borderRadius:10, border:'none', background:'linear-gradient(135deg,#fbbf24,#f59e0b)', color:'#0a0e1f', fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:'inherit', boxShadow:'0 4px 12px rgba(251,191,36,0.25)' }
            }, 'Archivar')
          )
        )
      ), document.body
    ),

    // Settings portal
    CB_settingsOpen && CB_renderSettings(),

    // ── Floating button ──
    // Reescrito: Logo fill width/height del button, zIndex 1; dot SOLO si
    // logged in. Sin dot gris cuando no hay sesión.
    !CB_open && e('button', {
      onClick: function() {
        if (CB_session === false) { if (typeof props.onLoginRequest === 'function') props.onLoginRequest(); }
        else { CB_setOpen(true); CB_setConnErr(''); }
      },
      'aria-label': CB_session === true ? 'Abrir asistente Elion' : 'Iniciar sesión para chatear',
      style:{
        position:'fixed', bottom:24, right:24,
        width:60, height:60, minWidth:44, minHeight:44,
        padding:0, overflow:'visible',
        borderRadius:'50%',
        background:'linear-gradient(135deg,#60a5fa 0%,#a78bfa 100%)',
        border:'none', color:'#fff', cursor:'pointer',
        boxShadow:'0 8px 24px rgba(167,139,250,0.40), 0 0 24px rgba(96,165,250,0.30)',
        zIndex:9000,
        display:'flex', alignItems:'center', justifyContent:'center',
        transition:'transform 240ms cubic-bezier(0.32,0.72,0,1), box-shadow 240ms ease-out',
        animation:'ecept_scaleIn 360ms cubic-bezier(0.34,1.56,0.64,1) 600ms both'
      },
      onMouseEnter: function(ev) {
        ev.currentTarget.style.transform = 'scale(1.06)';
        ev.currentTarget.style.boxShadow = '0 12px 32px rgba(167,139,250,0.50), 0 0 32px rgba(96,165,250,0.40)';
      },
      onMouseLeave: function(ev) {
        ev.currentTarget.style.transform = 'scale(1)';
        ev.currentTarget.style.boxShadow = '0 8px 24px rgba(167,139,250,0.40), 0 0 24px rgba(96,165,250,0.30)';
      }
    },
      // Logo: ocupa el button completo, drop-shadow doble para destacar contra
      // el gradient. zIndex 1.
      e('div', {
        style:{
          position:'relative', zIndex:1,
          width:'100%', height:'100%',
          display:'flex', alignItems:'center', justifyContent:'center',
          filter:'drop-shadow(0 0 4px rgba(255,255,255,0.30)) drop-shadow(0 1px 2px rgba(0,0,0,0.30))'
        }
      },
        e(window.Logo || 'span', { size: 36, animated: true, idSuffix:'fab' })
      ),
      // Dot verde SOLO si logged in. Sin sesión = sin dot.
      CB_session === true && e('span', { 'aria-hidden':'true', style:{
        position:'absolute', bottom:4, right:4, width:12, height:12,
        borderRadius:'50%', background:'#34d399',
        border:'2px solid #060a14',
        boxShadow:'0 0 8px rgba(52,211,153,0.6)',
        animation:'ecept_pulseDot 2s ease-in-out infinite',
        pointerEvents:'none', zIndex:2
      }})
    ),

    // ── Backdrop ──
    CB_open && (isMobile || CB_fullscreen) && e('div', {
      onClick: function() { CB_setOpen(false); CB_setFullscreen(false); CB_setSidebarOpen(false); },
      style:{ position:'fixed', inset:0, background:'rgba(0,0,0,.6)', zIndex:9998 }
    }),

    // Sidebar overlay backdrop (floating desktop mode) — click fuera del sidebar lo cierra.
    // Filtro e.target===currentTarget para que clicks DENTRO del sidebar (que se renderiza ENCIMA via zIndex 20 dentro del panel) no cierren la sidebar.
    // pointerEvents 'none' en el backdrop fuera del panel evita interferir con el click outside flow del panel principal.
    // Ahora: backdrop con zIndex MENOR al panel (4990) — sólo aparece para visualizar overlay, no captura clicks. El cierre lo gestiona onClick del panel.

    // ── Ambient glow detrás del panel floating (desktop) ──
    CB_open && CB_isDesktop && !CB_fullscreen && e('div', { 'aria-hidden':'true', style:{
      position:'fixed', top:0, left:0, width:'520px', height:'100vh',
      background:'radial-gradient(ellipse at left, rgba(167,139,250,0.08), transparent 60%)',
      pointerEvents:'none', zIndex:4999,
      animation:'ecept_fadeIn 400ms ease-out'
    }}),

    // ── Panel ──
    // onClick: cierra menús abiertos. Si el sidebar floating está abierto y click NO ocurrió dentro del sidebar (ni en su descendant), cierra el sidebar.
    CB_open && e('div', {
      id:'CB_panel',
      style:Object.assign({},panelStyle,{position:'fixed'}),
      onClick:function(ev) {
        CB_setConvMenuId(null);
        // Click outside del sidebar floating en desktop: cerrar.
        if (CB_isDesktop && !CB_fullscreen && CB_sidebarOpen) {
          // Buscar si el click ocurrió dentro de un elemento con id 'CB_floatingSidebar' o el toggle
          var el = ev.target;
          var inSidebar = false;
          while (el && el !== ev.currentTarget) {
            if (el.id === 'CB_floatingSidebar' || (el.getAttribute && el.getAttribute('data-sidebar-toggle') === '1')) {
              inSidebar = true; break;
            }
            el = el.parentNode;
          }
          if (!inSidebar) CB_setSidebarOpen(false);
        }
      }
    },

      // Permanent sidebar (fullscreen desktop)
      CB_isDesktop && CB_fullscreen && CB_renderSidebar(true),

      // Overlay sidebar (floating desktop)
      CB_isDesktop && !CB_fullscreen && CB_sidebarOpen && CB_renderSidebar(false),

      // Mobile sidebar (full overlay modal)
      isMobile && CB_sidebarOpen && ReactDOM.createPortal(
        e('div', { style:{ position:'fixed', inset:0, zIndex:10001, background:'rgba(6,10,20,0.95)', display:'flex', flexDirection:'column' } },
          CB_renderSidebar(true),
          e('button', {
            onClick:function() { CB_setSidebarOpen(false); },
            style:{ position:'absolute', top:14, right:14, background:'none', border:'none', color:C.mt, fontSize:22, cursor:'pointer', padding:8 }
          }, '×')
        ),
        document.body
      ),

      // Main column
      e('div', { style:{ flex:1, display:'flex', flexDirection:'column', minWidth:0, overflow:'hidden' } },

        // ── Header ──
        e('div', { style:{ padding:'14px 16px', background:'linear-gradient(180deg,rgba(59,130,246,.08),transparent)', borderBottom:'1px solid rgba(59,130,246,.15)', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 } },
          e('div', { style:{ display:'flex', alignItems:'center', gap:8, overflow:'hidden', minWidth:0 } },
            // Sidebar toggle
            e('button', {
              onClick:function(ev) { ev.stopPropagation(); CB_setSidebarOpen(function(o) { return !o; }); },
              title:'Conversaciones',
              'data-sidebar-toggle':'1',
              style:{ background:'none', border:'none', color: CB_sidebarOpen ? C.ac : C.mt, fontSize:15, cursor:'pointer', minWidth:32, minHeight:32, display:'flex', alignItems:'center', justifyContent:'center', borderRadius:8, flexShrink:0 }
            }, '📋'),
            e('div', { style:{ width:36, height:36, borderRadius:'50%', background:'linear-gradient(135deg,rgba(96,165,250,0.18),rgba(167,139,250,0.10))', border:'1px solid rgba(167,139,250,0.30)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, boxShadow:'0 0 12px rgba(167,139,250,0.20)' } }, e(window.Logo || 'span', { size: 26, idSuffix:'cbhdr' })),
            e('div', { style:{ display:'flex', flexDirection:'column', gap:4, overflow:'hidden', minWidth:0 } },
              e('div', { style:{ fontWeight:700, fontSize:15, lineHeight:'1.2', background:'linear-gradient(135deg,#60a5fa,#a78bfa)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', whiteSpace:'nowrap' } }, 'Elion'),
              // Pill clickeable: muestra modelo + quota + créditos. Hover state evidencia interacción.
              e('button', {
                onClick:function(ev) { ev.stopPropagation(); CB_setModelPickerOpen(true); },
                title:'Cambiar modelo de IA',
                'aria-label':'Cambiar modelo de IA',
                style:{
                  background:'rgba(96,165,250,0.08)',
                  border:'1px solid rgba(96,165,250,0.20)',
                  borderRadius:999,
                  padding:'5px 12px',
                  color:'#94a3b8',
                  fontSize:11,
                  fontWeight:500,
                  cursor:'pointer',
                  fontFamily:'inherit',
                  display:'inline-flex',
                  alignItems:'center',
                  gap:6,
                  flexWrap:'nowrap',
                  overflow:'hidden',
                  maxWidth:'100%',
                  transition:'background 200ms ease-out, border-color 200ms ease-out, color 200ms ease-out',
                  alignSelf:'flex-start'
                },
                onMouseEnter:function(ev) {
                  ev.currentTarget.style.background='rgba(96,165,250,0.16)';
                  ev.currentTarget.style.borderColor='rgba(96,165,250,0.40)';
                  ev.currentTarget.style.color='#cbd5e1';
                },
                onMouseLeave:function(ev) {
                  ev.currentTarget.style.background='rgba(96,165,250,0.08)';
                  ev.currentTarget.style.borderColor='rgba(96,165,250,0.20)';
                  ev.currentTarget.style.color='#94a3b8';
                }
              },
                e('span', { style:{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' } }, modelLabel),
                e('span', { style:{ color:'#475569' } }, '·'),
                e('span', { style:{ whiteSpace:'nowrap' } }, quotaStr),
                e('span', { style:{ color:'#475569' } }, '·'),
                e('span', { style:{ whiteSpace:'nowrap' } }, '🪙'+CB_credits),
                CB_userNotes && CB_userNotes.trim() && e('span', { title:'Memoria activa', style:{ fontSize:11, color:'#a78bfa' } }, '🧠'),
                e('span', { style:{ fontSize:9, opacity:0.6, marginLeft:1 } }, '▼')
              ),
              // C4: pill indicador de proyecto (si la conv pertenece a uno)
              (function(){
                if (!CB_activeConvId) return null;
                var activeConv = CB_conversations.find ? CB_conversations.find(function(c){ return c.id === CB_activeConvId; }) : null;
                if (!activeConv) {
                  for (var ci=0; ci<CB_conversations.length; ci++) { if (CB_conversations[ci].id === CB_activeConvId) { activeConv = CB_conversations[ci]; break; } }
                }
                if (!activeConv) return null;
                var proj = null;
                if (activeConv.project_id) {
                  for (var pi=0; pi<CB_projects.length; pi++) { if (CB_projects[pi].id === activeConv.project_id) { proj = CB_projects[pi]; break; } }
                }
                if (proj) {
                  return e('button', {
                    onClick: function(ev) { ev.stopPropagation(); CB_setPmOpen(true); },
                    title: 'Proyecto: ' + proj.name,
                    style:{ alignSelf:'flex-start', marginTop:4, background: proj.color + '20', border:'1px solid ' + proj.color + '40', borderRadius:999, padding:'3px 10px', color: proj.color, fontSize:10, fontWeight:600, cursor:'pointer', fontFamily:'inherit', display:'inline-flex', alignItems:'center', gap:4, maxWidth:'100%' }
                  },
                    e('span', null, proj.icon || '📁'),
                    e('span', { style:{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' } }, proj.name)
                  );
                }
                return null;
              })()
            )
          ),
          e('div', { style:{ display:'flex', alignItems:'center', gap:2, flexShrink:0 } },
            // ⚙️ Settings (memoria + config)
            e('button', {
              onClick:function(ev) { ev.stopPropagation(); CB_loadUserNotes(); CB_setSettingsOpen(true); },
              title:'Memoria y configuración',
              'aria-label':'Memoria y configuración',
              style:{ background:'none', border:'none', color:C.mt, fontSize:15, cursor:'pointer', minWidth:32, minHeight:32, display:'flex', alignItems:'center', justifyContent:'center', borderRadius:8 }
            }, '⚙️'),
            // ⛶ Fullscreen toggle (solo desktop)
            CB_isDesktop && e('button', {
              onClick: function() { CB_setFullscreen(function(f) { return !f; }); },
              title: CB_fullscreen ? 'Salir de pantalla completa' : 'Pantalla completa',
              'aria-label': CB_fullscreen ? 'Salir de pantalla completa' : 'Pantalla completa',
              style:{ background:'none', border:'none', color:C.mt, fontSize:15, cursor:'pointer', minWidth:32, minHeight:32, display:'flex', alignItems:'center', justifyContent:'center', borderRadius:8 }
            }, CB_fullscreen ? '↙' : '⛶'),
            // ✕ Cerrar chat completo (siempre)
            e('button', {
              onClick: function() {
                CB_setOpen(false);
                CB_setFullscreen(false);
                CB_setSidebarOpen(false);
              },
              title: 'Cerrar chat',
              'aria-label':'Cerrar chat',
              style:{ background:'none', border:'none', color:C.mt, fontSize:20, cursor:'pointer', minWidth:32, minHeight:32, display:'flex', alignItems:'center', justifyContent:'center', borderRadius:8 }
            }, '×')
          )
        ),

        // ── Content ──
        CB_session === null
          ? e('div', { style:{ flex:1, display:'flex', alignItems:'center', justifyContent:'center' } },
              e('div', { style:{ color:C.dm, fontSize:13 } }, 'Verificando sesión...')
            )
          : CB_session === false
          ? e('div', { style:{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:24, gap:12 } },
              e('div', { style:{ fontSize:32, marginBottom:4 } }, '🔒'),
              e('div', { style:{ color:C.tx, fontSize:14, fontWeight:600, textAlign:'center' } }, 'Necesitás una cuenta'),
              e('div', { style:{ color:C.mt, fontSize:13, textAlign:'center', lineHeight:1.5 } }, 'El asistente está disponible para usuarios registrados.'),
              e('button', {
                onClick: function() { CB_setOpen(false); if (typeof props.onLoginRequest === 'function') props.onLoginRequest(); },
                style:{ minHeight:44, padding:'12px 20px', borderRadius:10, background:C.ac, color:'#fff', border:'none', cursor:'pointer', fontSize:14, fontWeight:700 }
              }, 'Crear cuenta / Iniciar sesión')
            )
          : e(F, null,
              e('div', { ref:CB_scrollRef, style:{ flex:1, overflowY:'auto', padding:16, display:'flex', flexDirection:'column', gap:14 } },

                // Empty state — primera vez (sin conversaciones previas) → presentación de Elion
                // Gate todos los empty states hasta que conversations carguen.
                // Esto elimina el flash 'capabilities → ECEPT' al inicio.
                CB_convsLoaded && CB_msgs.length === 0 && !CB_loading && CB_conversations.length === 0 && window.ElionIntro
                  && e(window.ElionIntro, {
                    onPromptSelect: function(p) {
                      CB_setInput(p);
                      if (CB_inputRef.current) CB_inputRef.current.focus();
                    }
                  }),

                // Empty state — conversación nueva (ya tiene historial previo) → versión simple
                CB_convsLoaded && CB_msgs.length === 0 && !CB_loading && CB_conversations.length > 0 && e('div', {
                  style:{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', flex:1, gap:14, minHeight:200, paddingTop:32 }
                },
                  e('div', { style:{ marginBottom: 4 } }, e(window.Logo || 'span', { size: 64, animated: true, glow: true, idSuffix:'empty' })),
                  e('div', { style:{ fontWeight:800, fontSize:24, letterSpacing:'-0.02em', background:'linear-gradient(135deg,#60a5fa,#a78bfa)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', lineHeight:1.1 } }, '¿Cómo te ayudo?'),
                  e('div', { style:{ color:C.mt, fontSize:13, marginTop:-2, marginBottom:8 } }, 'Nueva conversación'),
                  e('div', { style:{ display:'flex', flexDirection:'column', gap:8, width:'100%', maxWidth:340 } },
                    quickPrompts.map(function(qp, qi) {
                      return e('button', {
                        key:qi,
                        onClick: function() { CB_setInput(qp); if (CB_inputRef.current) CB_inputRef.current.focus(); },
                        style:{
                          minHeight:44, padding:'12px 16px', borderRadius:12,
                          background:'linear-gradient(135deg, rgba(96,165,250,0.08), rgba(167,139,250,0.05))',
                          border:'1px solid rgba(96,165,250,0.20)',
                          color:'#e2e8f0', fontSize:13, cursor:'pointer',
                          textAlign:'left', lineHeight:1.45, fontFamily:'inherit',
                          transition:'all 220ms cubic-bezier(0.16,1,0.3,1)',
                          animation:'ecept_fadeSlideUp 320ms cubic-bezier(0.16,1,0.3,1) '+(120+qi*70)+'ms both'
                        },
                        onMouseEnter: function(ev) {
                          ev.currentTarget.style.borderColor = 'rgba(96,165,250,0.42)';
                          ev.currentTarget.style.transform = 'translateY(-1px)';
                        },
                        onMouseLeave: function(ev) {
                          ev.currentTarget.style.borderColor = 'rgba(96,165,250,0.20)';
                          ev.currentTarget.style.transform = 'translateY(0)';
                        }
                      }, qp);
                    })
                  )
                ),

                // Transición fluida entre conversaciones: skeleton breve mientras cambia
                CB_msgsTransitioning && e('div', { style:{ display:'flex', flexDirection:'column', gap:14, opacity:0.6 } },
                  window.SkeletonRow && e(window.SkeletonRow),
                  window.SkeletonRow && e(window.SkeletonRow),
                  window.SkeletonRow && e(window.SkeletonRow)
                ),

                !CB_msgsTransitioning && CB_msgs.map(function(m, i) {
                  var isUser = m.role === 'user';
                  return e('div', { key:i, style:{ display:'flex', flexDirection:'column', alignItems:isUser?'flex-end':'flex-start', gap:4, animation:'ecept_messageIn 320ms cubic-bezier(0.32,0.72,0,1)' } },
                    isUser
                      ? e('div', { style:{ maxWidth:'85%', padding:'13px 18px', borderRadius:'20px 20px 6px 20px', background:'linear-gradient(135deg,rgba(59,130,246,.20),rgba(96,165,250,.10))', border:'1px solid rgba(96,165,250,.28)', color:C.tx, fontSize:14, lineHeight:1.55, wordBreak:'break-word', whiteSpace:'pre-wrap', boxShadow:'0 1px 2px rgba(0,0,0,0.2)' } },
                          // Chips de adjuntos arriba del texto del mensaje.
                          m.attachments && m.attachments.length > 0 && e('div', { style:{ display:'flex', flexWrap:'wrap', gap:6, marginBottom: m.text ? 8 : 0 } },
                            m.attachments.map(function(a, ai) {
                              var icon = a.mimeType && a.mimeType.indexOf('image/') === 0 ? '🖼' : '📄';
                              return e('div', { key: ai, style:{ display:'inline-flex', alignItems:'center', gap:6, padding:'6px 10px', background:'rgba(96,165,250,0.18)', border:'1px solid rgba(96,165,250,0.32)', borderRadius:10, fontSize:11, color:'#cbd5e1' } },
                                e('span', null, icon),
                                e('span', { style:{ maxWidth:180, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' } }, a.name || 'archivo')
                              );
                            })
                          ),
                          m.text
                        )
                      : (function(){
                          var exportMeta = !m.error ? CB_extractExportMeta(m.text) : null;
                          var flashcardsBlock = !m.error ? CB_extractFlashcardsBlock(m.text) : null;
                          var displayText = m.text;
                          if (exportMeta) displayText = CB_stripExportMeta(displayText);
                          if (flashcardsBlock) displayText = CB_stripFlashcardsBlock(displayText);
                          return e('div', { style:{ display:'flex', alignItems:'flex-start', gap:10, maxWidth:'92%' } },
                            CB_elionAvatar(30),
                            e('div', { style:{ padding:'14px 18px', borderRadius:'20px 20px 20px 6px', background:m.error?'rgba(239,68,68,.08)':'linear-gradient(180deg,#0d1224 0%,#0a0e1f 100%)', border:'1px solid '+(m.error?'rgba(239,68,68,.25)':'#1a2040'), boxShadow:m.error?'none':'0 2px 8px rgba(0,0,0,0.25), 0 1px 2px rgba(0,0,0,0.15)', color:m.error?'#ef4444':C.tx, fontSize:14, lineHeight:1.55, wordBreak:'break-word' } },
                            m.error ? e('span', null, m.text) : CB_renderMarkdown(displayText),
                            // Flashcards generadas: panel con preview + botón guardar
                            flashcardsBlock && e('div', { style:{
                              marginTop:'14px',
                              padding:'14px 16px',
                              background:'linear-gradient(135deg, rgba(167,139,250,0.14), rgba(96,165,250,0.08))',
                              border:'1px solid rgba(167,139,250,0.32)',
                              borderRadius:14,
                              display:'flex',
                              flexDirection:'column',
                              gap:10
                            } },
                              e('div', null,
                                e('div', { style:{ fontSize:13, fontWeight:700, color:'#a78bfa', letterSpacing:'-0.01em', display:'flex', alignItems:'center', gap:6 } },
                                  e('span', null, '🎴'),
                                  e('span', null, 'Generé ' + flashcardsBlock.cards.length + ' flashcards'),
                                  flashcardsBlock.deckName && e('span', { style:{ color:C.mt, fontWeight:500 } }, '— ' + flashcardsBlock.deckName)
                                ),
                                // Preview de las primeras 3 preguntas
                                e('div', { style:{ marginTop:8, fontSize:11, color:C.mt, lineHeight:1.5 } },
                                  flashcardsBlock.cards.slice(0,3).map(function(c, ci) {
                                    return e('div', { key:ci, style:{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' } }, '• ' + (c.q || ''));
                                  }),
                                  flashcardsBlock.cards.length > 3 && e('div', { style:{ color:C.dm, fontStyle:'italic' } }, '... +' + (flashcardsBlock.cards.length - 3) + ' más')
                                )
                              ),
                              e('button', {
                                onClick: function() { CB_saveGeneratedFlashcards(flashcardsBlock.deckName, flashcardsBlock.cards); },
                                style:{
                                  alignSelf:'flex-start',
                                  background:'linear-gradient(135deg,#60a5fa,#a78bfa)',
                                  color:'#fff', border:'none',
                                  padding:'9px 16px', borderRadius:10,
                                  fontSize:12, fontWeight:700,
                                  cursor:'pointer', fontFamily:'inherit',
                                  boxShadow:'0 4px 12px rgba(167,139,250,0.30)'
                                }
                              }, '🎴 Guardar en baraja nueva')
                            ),
                            // Pro 2.5: botón download premium si hay export meta
                            exportMeta && e('div', { style:{
                              marginTop:'14px',
                              padding:'12px 16px',
                              background:'linear-gradient(135deg, rgba(251,191,36,0.12), rgba(251,191,36,0.05))',
                              border:'1px solid rgba(251,191,36,0.30)',
                              borderRadius:12,
                              display:'flex',
                              alignItems:'center',
                              justifyContent:'space-between',
                              gap:12,
                              flexWrap:'wrap'
                            } },
                              e('div', { style:{ minWidth:0, flex:1 } },
                                e('div', { style:{ fontSize:13, fontWeight:700, color:'#fbbf24', letterSpacing:'-0.01em', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' } }, '📄 ' + (exportMeta.title || 'Documento')),
                                e('div', { style:{ fontSize:11, color:'#94a3b8', marginTop:2, letterSpacing:'0.04em' } }, 'Documento ' + String(exportMeta.format || 'pdf').toUpperCase() + ' listo para descargar')
                              ),
                              e('button', {
                                onClick: function() { CB_exportDocument(displayText, exportMeta); },
                                style:{
                                  background:'linear-gradient(135deg,#fbbf24,#f59e0b)',
                                  color:'#0a0e1f',
                                  border:'none',
                                  padding:'10px 18px',
                                  borderRadius:10,
                                  fontSize:13,
                                  fontWeight:700,
                                  cursor:'pointer',
                                  fontFamily:'inherit',
                                  letterSpacing:'-0.01em',
                                  boxShadow:'0 4px 12px rgba(251,191,36,0.25)',
                                  transition:'transform 200ms cubic-bezier(0.16,1,0.3,1)',
                                  flexShrink:0
                                },
                                onMouseEnter: function(ev) { ev.currentTarget.style.transform = 'translateY(-1px)'; },
                                onMouseLeave: function(ev) { ev.currentTarget.style.transform = 'translateY(0)'; }
                              }, '📥 Descargar')
                            ),
                            // Botón Reintentar inline para errores transitorios (último error, no loading)
                            m.error && m.retryable && i === CB_msgs.length - 1 && !CB_loading && CB_lastMsgRef.current && e('button', {
                              onClick: CB_retryLast,
                              style:{
                                display:'inline-flex', alignItems:'center', gap:6,
                                marginTop:10,
                                background:'rgba(96,165,250,0.14)',
                                border:'1px solid rgba(96,165,250,0.35)',
                                color:'#60a5fa',
                                padding:'6px 14px',
                                borderRadius:8,
                                fontSize:12,
                                fontWeight:600,
                                cursor:'pointer',
                                fontFamily:'inherit',
                                transition:'background 200ms ease-out'
                              },
                              onMouseEnter: function(ev) { ev.currentTarget.style.background='rgba(96,165,250,0.22)'; },
                              onMouseLeave: function(ev) { ev.currentTarget.style.background='rgba(96,165,250,0.14)'; }
                            }, '↻ Reintentar')
                          )
                        );
                        })()
                  );
                }),

                CB_loading && e('div', { style:{ display:'flex', alignItems:'flex-start', gap:8 } },
                  CB_elionAvatar(28),
                  e('div', { style:{ padding:'14px 16px', borderRadius:'4px 18px 18px 18px', background:'#0d1224', border:'1px solid #1a2040', display:'flex', alignItems:'center', gap:5 } },
                    e('span', { style:{ display:'inline-block', fontSize:8, color:C.dm, animation:'CB_dotBounce .8s ease-in-out infinite', animationDelay:'0s' } }, '●'),
                    e('span', { style:{ display:'inline-block', fontSize:8, color:C.dm, animation:'CB_dotBounce .8s ease-in-out infinite', animationDelay:'.15s' } }, '●'),
                    e('span', { style:{ display:'inline-block', fontSize:8, color:C.dm, animation:'CB_dotBounce .8s ease-in-out infinite', animationDelay:'.3s' } }, '●')
                  )
                )
              ),

              e('div', { style:{ padding:'12px 14px', borderTop:'1px solid rgba(59,130,246,.1)', background:C.bg, flexShrink:0 } },
                // Hidden file input (clickeado por el botón 📎)
                e('input', {
                  ref: CB_fileInputRef,
                  type: 'file',
                  accept: '.pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp',
                  multiple: true,
                  style: { display: 'none' },
                  onChange: CB_handleFileSelect
                }),
                // Chips de archivos pendientes (encima del textarea)
                CB_pendingFiles.length > 0 && e('div', {
                  style:{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:8 }
                },
                  CB_pendingFiles.map(function(f, fi) {
                    var sizeKb = Math.round(f.size / 1024);
                    return e('div', { key: fi, style:{
                      display:'inline-flex', alignItems:'center', gap:6,
                      padding:'5px 4px 5px 10px',
                      background:'rgba(96,165,250,0.10)',
                      border:'1px solid rgba(96,165,250,0.25)',
                      borderRadius: 999,
                      fontSize: 11,
                      color: C.tx,
                      maxWidth: 240
                    }},
                      e('span', { 'aria-hidden':'true', style:{ fontSize:12 } }, f.mimeType.indexOf('pdf')>=0 ? '📄' : '🖼️'),
                      e('span', { style:{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:140 } }, f.name),
                      e('span', { style:{ color:'#64748b', fontSize:10 } }, sizeKb < 1024 ? (sizeKb+'KB') : ((sizeKb/1024).toFixed(1)+'MB')),
                      e('button', {
                        onClick: function() { CB_removeFile(fi); },
                        'aria-label': 'Quitar archivo',
                        style:{ background:'transparent', border:'none', color:C.mt, cursor:'pointer', width:20, height:20, borderRadius:'50%', display:'inline-flex', alignItems:'center', justifyContent:'center', fontSize:12, padding:0, fontFamily:'inherit' }
                      }, '×')
                    );
                  })
                ),
                e('div', { style:inputContainerStyle },
                  e('button', {
                    onClick: function() { if (CB_fileInputRef.current) CB_fileInputRef.current.click(); },
                    disabled: CB_pendingFiles.length >= 3,
                    title: CB_pendingFiles.length >= 3 ? 'Máximo 3 archivos' : 'Adjuntar archivo (PDF, JPG, PNG, WEBP)',
                    'aria-label': 'Adjuntar archivo',
                    style:{ width:32, height:32, flexShrink:0, background:'none', border:'none', color: CB_pendingFiles.length >= 3 ? '#475569' : C.mt, fontSize:18, cursor: CB_pendingFiles.length >= 3 ? 'not-allowed' : 'pointer', display:'flex', alignItems:'center', justifyContent:'center', opacity: CB_pendingFiles.length >= 3 ? 0.4 : 0.85, padding:0, transition:'opacity 200ms ease-out, color 200ms ease-out' },
                    onMouseEnter: function(ev) { if (CB_pendingFiles.length < 3) { ev.currentTarget.style.opacity = '1'; ev.currentTarget.style.color = '#60a5fa'; } },
                    onMouseLeave: function(ev) { ev.currentTarget.style.opacity = '0.85'; ev.currentTarget.style.color = C.mt; }
                  }, '📎'),
                  e('textarea', {
                    ref:CB_inputRef,
                    value:CB_input, rows:1,
                    onFocus: function() { CB_setInputFocused(true); },
                    onBlur:  function() { CB_setInputFocused(false); },
                    onChange:function(ev) {
                      CB_setInput(ev.target.value);
                      ev.target.style.height='auto';
                      ev.target.style.height=Math.min(ev.target.scrollHeight,96)+'px';
                    },
                    onKeyDown:function(ev) { if (ev.key==='Enter'&&!ev.shiftKey) { ev.preventDefault(); CB_send(); } },
                    placeholder:'Preguntale lo que sea a Elion...',
                    disabled:CB_loading,
                    enterKeyHint:'send',
                    'aria-label':'Mensaje',
                    style:{ flex:1, minHeight:36, maxHeight:96, padding:'8px 4px', border:'none', background:'transparent', color:C.tx, fontSize:14, outline:'none', resize:'none', lineHeight:'1.4', fontFamily:'inherit', overflowY:'auto' }
                  }),
                  e('button', {
                    onClick:CB_send,
                    disabled:CB_loading||(!CB_input.trim()&&CB_pendingFiles.length===0),
                    'aria-label':CB_loading?'Cargando':'Enviar',
                    style:{ width:40, height:40, flexShrink:0, borderRadius:'50%', border:'none', background:(CB_loading||(!CB_input.trim()&&CB_pendingFiles.length===0))?'#1a2040':'linear-gradient(135deg,#60a5fa,#a78bfa)', color:'#fff', cursor:(CB_loading||(!CB_input.trim()&&CB_pendingFiles.length===0))?'default':'pointer', fontSize:15, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', transition:'all 240ms cubic-bezier(0.34,1.56,0.64,1)', padding:0, boxShadow:(CB_loading||(!CB_input.trim()&&CB_pendingFiles.length===0))?'none':'0 4px 12px rgba(167,139,250,0.30)' }
                  }, CB_loading
                    ? e('span', { style:{ display:'inline-block', animation:'CB_spin .8s linear infinite' } }, '⟳')
                    : '➤'
                  )
                )
              )
            )
      )
    )
  );
}
window.ChatBot = ChatBot;
