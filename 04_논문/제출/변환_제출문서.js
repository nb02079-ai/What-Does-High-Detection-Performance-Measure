// 마크다운 → 국내 학술지 일반 서식(A4 2단) docx 변환기 (2026-10-02)
const fs = require('fs');
const path = require('path');
const D = require('docx');
const { Document, Packer, Paragraph, TextRun, ImageRun, Table, TableRow, TableCell, WidthType,
  AlignmentType, SectionType, Footer, PageNumber, ShadingType, BorderStyle, LevelFormat, HeadingLevel } = D;

const FIGDIR = '/mnt/user-data/outputs/paper/figures';
const MM = 56.7;                         // 1mm = 56.7 DXA
const PAGE = { width: 11906, height: 16838 };
const MARGIN = { top: Math.round(25 * MM), bottom: Math.round(25 * MM), left: Math.round(20 * MM), right: Math.round(20 * MM) };
const FULL_W = PAGE.width - MARGIN.left - MARGIN.right;          // 본문 전체 폭 (약 170mm)
const GAP = Math.round(8 * MM);
const COL_W = Math.floor((FULL_W - GAP) / 2);                     // 한 단 폭 (약 81mm)
const FONT = { ascii: 'Times New Roman', hAnsi: 'Times New Roman', eastAsia: '바탕', cs: 'Times New Roman' };
const AUTHOR = '이도형';
const DATE = '2026년 10월 3일';
const HFONT = { ascii: 'Arial', hAnsi: 'Arial', eastAsia: '맑은 고딕', cs: 'Arial' };

// ---------- 인라인 서식 ----------
function inline(text, base = {}) {
  text = text.replace(/\\\|/g, '|');
  const runs = [];
  const re = /(\*\*[^*]+?\*\*|`[^`]+`|\*[^*\s][^*]*?\*)/g;
  let last = 0, m;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) runs.push(new TextRun({ text: text.slice(last, m.index), ...base }));
    const t = m[0];
    if (t.startsWith('**')) runs.push(new TextRun({ text: t.slice(2, -2), bold: true, ...base }));
    else if (t.startsWith('`')) runs.push(new TextRun({ text: t.slice(1, -1), font: 'Consolas', ...base, size: base.size ? base.size - 2 : 17 }));
    else runs.push(new TextRun({ text: t.slice(1, -1), italics: true, ...base }));
    last = m.index + t.length;
  }
  if (last < text.length) runs.push(new TextRun({ text: text.slice(last), ...base }));
  return runs;
}

// ---------- 블록 파싱 ----------
function parseBlocks(md) {
  const L = md.split('\n'); const blocks = []; let i = 0;
  while (i < L.length) {
    const l = L[i];
    if (!l.trim() || /^-{3,}\s*$/.test(l.trim())) { i++; continue; }
    if (/^#{1,4} /.test(l)) { const lv = l.match(/^#+/)[0].length; blocks.push({ t: 'h', lv, text: l.replace(/^#+ /, '') }); i++; continue; }
    if (l.startsWith('![](')) { blocks.push({ t: 'img', src: l.match(/\(([^)]+)\)/)[1] }); i++; continue; }
    if (l.startsWith('|')) { const rows = []; while (i < L.length && L[i].startsWith('|')) { rows.push(L[i]); i++; } blocks.push({ t: 'table', rows }); continue; }
    if (/^- /.test(l)) { const items = []; while (i < L.length && /^- /.test(L[i])) { items.push(L[i].slice(2)); i++; } blocks.push({ t: 'list', items }); continue; }
    if (l.startsWith('>')) { const q = []; while (i < L.length && L[i].startsWith('>')) { q.push(L[i].replace(/^>\s?/, '')); i++; } blocks.push({ t: 'quote', lines: q }); continue; }
    const p = []; while (i < L.length && L[i].trim() && !/^(#{1,4} |\||!\[\]|- |>|-{3,}\s*$)/.test(L[i])) { p.push(L[i]); i++; }
    blocks.push({ t: 'p', text: p.join(' ') });
  }
  return blocks;
}

// ---------- 요소 생성 ----------
const SZ = { body: 19, small: 16, cell: 15, cellApp: 14 };
function para(text, o = {}) {
  return new Paragraph({ alignment: o.align ?? AlignmentType.JUSTIFIED, spacing: { after: o.after ?? 60, before: o.before ?? 0, line: o.line ?? 320 },
    indent: o.indent ? { firstLine: o.indent } : undefined, keepNext: o.keepNext, children: inline(text, { size: o.size ?? SZ.body, ...(o.run || {}) }) });
}
function heading(b) {
  const size = { 1: 22, 2: 20, 3: 19, 4: 19 }[b.lv];
  return new Paragraph({ heading: [HeadingLevel.HEADING_1, HeadingLevel.HEADING_2, HeadingLevel.HEADING_3, HeadingLevel.HEADING_4][b.lv - 1],
    spacing: { before: b.lv === 1 ? 240 : 160, after: 100 }, keepNext: true,
    children: [new TextRun({ text: b.text, bold: true, size, font: HFONT, color: '000000' })] });
}
function splitRow(r) { return r.trim().replace(/^\|/, '').replace(/\|$/, '').split(/(?<!\\)\|/).map(c => c.trim()); }
function isWideTable(b) {
  const rows = b.rows.filter(r => !/^\|[\s\-|:]+\|$/.test(r)).map(splitRow);
  const nc = rows[0].length; const maxRow = Math.max(...rows.map(r => r.join('').length));
  return nc >= 4 || maxRow > 140;
}
function table(b, width, cellSize) {
  const rows = b.rows.filter(r => !/^\|[\s\-|:]+\|$/.test(r)).map(splitRow);
  const nc = Math.max(...rows.map(r => r.length));
  const weight = [...Array(nc)].map((_, j) => Math.min(60, Math.max(5, Math.max(...rows.map(r => (r[j] || '').length)))));
  const tot = weight.reduce((a, c) => a + c, 0);
  let widths = weight.map(w => Math.floor(width * w / tot)); widths[nc - 1] += width - widths.reduce((a, c) => a + c, 0);
  const bd = { style: BorderStyle.SINGLE, size: 4, color: '999999' };
  return new Table({ width: { size: width, type: WidthType.DXA }, columnWidths: widths,
    rows: rows.map((r, ri) => new TableRow({ tableHeader: ri === 0, cantSplit: false, children: [...Array(nc)].map((_, j) => new TableCell({
      width: { size: widths[j], type: WidthType.DXA },
      shading: ri === 0 ? { type: ShadingType.CLEAR, fill: 'E8E8E8', color: 'auto' } : undefined,
      borders: { top: bd, bottom: bd, left: bd, right: bd }, margins: { top: 30, bottom: 30, left: 60, right: 60 },
      children: [new Paragraph({ alignment: AlignmentType.LEFT, spacing: { after: 0, line: 240 },
        children: inline(r[j] || '', { size: cellSize, bold: ri === 0 ? true : undefined }) })] })) })) });
}
function pngSize(p) { const b = fs.readFileSync(p); return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) }; }
function image(src, full) {
  const p = path.join(FIGDIR, path.basename(src)); const { w, h } = pngSize(p);
  const maxW = full ? 170 : 80;                                  // mm
  const wpx = Math.round(maxW / 25.4 * 96); const hpx = Math.round(wpx * h / w);
  return new Paragraph({ alignment: AlignmentType.CENTER, keepNext: true, spacing: { before: 120, after: 60 },
    children: [new ImageRun({ type: 'png', data: fs.readFileSync(p), transformation: { width: wpx, height: hpx } })] });
}
const caption = (t) => para(t, { size: SZ.small, align: AlignmentType.LEFT, after: 80, line: 260, keepNext: true });
const note = (t) => para(t, { size: SZ.small - 1, align: AlignmentType.LEFT, after: 120, line: 250 });

// ---------- 본문 블록 → 단 구분된 섹션 목록 ----------
function buildSections(blocks, { twoCol, cellSize }) {
  const out = []; let cur = []; const W = twoCol ? COL_W : FULL_W;
  const flush = () => { if (cur.length) { out.push({ cols: twoCol ? 2 : 1, children: cur }); cur = []; } };
  const wide = (children) => { if (!twoCol) { cur.push(...children); return; } flush(); out.push({ cols: 1, children }); };
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    if (b.t === 'h') cur.push(heading(b));
    else if (b.t === 'img') {
      const { w, h } = pngSize(path.join(FIGDIR, path.basename(b.src))); const full = !twoCol || w / h >= 1.6;
      const g = [image(b.src, full)];
      if (blocks[i + 1] && blocks[i + 1].t === 'p' && /^\*\*그림/.test(blocks[i + 1].text)) { g.push(caption(blocks[i + 1].text)); i++; }
      if (full && twoCol) wide(g); else cur.push(...g);
    }
    else if (b.t === 'p' && /^\*\*표 \d+/.test(b.text) && blocks[i + 1] && blocks[i + 1].t === 'table') {
      const tb = blocks[i + 1]; const isWide = isWideTable(tb); const tw = isWide || !twoCol ? FULL_W : COL_W;
      const g = [caption(b.text), table(tb, tw, cellSize)]; i++;
      while (blocks[i + 1] && blocks[i + 1].t === 'p' && /^\*[^*]/.test(blocks[i + 1].text)) { g.push(note(blocks[i + 1].text)); i++; }
      if (g.length === 2) g.push(new Paragraph({ spacing: { after: 80 }, children: [] }));
      if (isWide && twoCol) wide(g); else cur.push(...g);
    }
    else if (b.t === 'table') { const isWide = isWideTable(b); const g = [table(b, isWide || !twoCol ? FULL_W : COL_W, cellSize), new Paragraph({ spacing: { after: 80 }, children: [] })]; if (isWide && twoCol) wide(g); else cur.push(...g); }
    else if (b.t === 'list') b.items.forEach(it => cur.push(new Paragraph({ numbering: { reference: 'bul', level: 0 }, alignment: AlignmentType.JUSTIFIED, spacing: { after: 60, line: 320 }, children: inline(it, { size: SZ.body }) })));
    else if (b.t === 'quote') cur.push(para(b.lines.join(' '), { size: SZ.small, run: { color: '444444' } }));
    else if (b.t === 'p') {
      const isFoot = /^[¹²³⁴]/.test(b.text); const isNote = /^\*[^*]/.test(b.text);
      cur.push(isFoot ? note(b.text) : isNote ? note(b.text) : para(b.text, { indent: 190 }));
    }
  }
  flush(); return out;
}

function footer() { return { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ children: [PageNumber.CURRENT], size: 16 })] })] }) }; }
function sectionProps(cols, first) {
  return { properties: { type: first ? SectionType.NEXT_PAGE : SectionType.CONTINUOUS, page: { size: PAGE, margin: MARGIN },
    column: cols === 2 ? { count: 2, space: GAP, equalWidth: true } : { count: 1 } }, footers: footer() };
}
const NUMBERING = { config: [{ reference: 'bul', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 300, hanging: 200 } } } }] }] };
const STYLES = { default: { document: { run: { font: FONT, size: SZ.body } } } };

// ---------- 제출 문서 ----------
(async () => {
  const md = fs.readFileSync(process.argv[2], 'utf8').split('\n');
  const title = md[0].replace(/^# /, ''); const rest = md.slice(1).join('\n');
  const head = [new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [new TextRun({ text: title, bold: true, size: 32, font: HFONT })] })];
  const secs = buildSections(parseBlocks(rest), { twoCol: false, cellSize: SZ.cell });
  const doc = new Document({ styles: STYLES, numbering: NUMBERING, sections: [{ ...sectionProps(1, true), children: [...head, ...secs.flatMap(x => x.children)] }] });
  fs.writeFileSync(process.argv[3], await Packer.toBuffer(doc)); console.log('작성:', process.argv[3]);
})();
