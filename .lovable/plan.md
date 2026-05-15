## Goal

Regenerate `Autonomous_Research_Assistant_VFSTR_Project_Report.docx` so that:
1. Body text alignment is consistent and correct throughout (justified body, centered headings/captions, left-aligned section headings, no stray ragged paragraphs).
2. The **Table of Contents**, **List of Figures**, and **List of Tables** show **accurate page numbers** (not placeholders, not guesses) that match where each item actually lands in the rendered PDF.

Final deliverable stays the same artifact path:
`/mnt/documents/Autonomous_Research_Assistant_VFSTR_Project_Report.docx`

## Approach

### 1. Fix alignment globally
In `/tmp/build_vfstr_report.js`:
- Body paragraphs: `alignment: AlignmentType.JUSTIFIED`, `spacing: { line: 360 }` (1.5), Times New Roman 12 pt.
- Chapter title pages: `CHAPTER – N` and chapter title centered, bold.
- Section headings (1.1, 1.2 …): left-aligned, bold, 12 pt, no indent.
- Figure captions (`Fig. N: …`): centered below figure.
- Table captions (`TABLE I` + descriptive line): centered above table.
- Cover / Certificate / Declaration / Abstract headings: centered.
- Front matter list pages (TOC, LoF, LoT): title centered, entries left-aligned with right-tab dot leader.
- Remove any accidental `AlignmentType.LEFT` on body paragraphs and any `AlignmentType.CENTER` on regular prose.

### 2. Compute real page numbers (two-pass build)

Word does not let us read page numbers from JS, so use LibreOffice as the source of truth:

**Pass A — instrumented build:**
- Build the document with empty TOC/LoF/LoT (placeholder dots), but insert a hidden bookmark at every TOC target: each chapter, each section heading, each `Fig. N` caption, each `TABLE I` caption.
- Convert to PDF via `python /tmp/run_libreoffice.py --headless --convert-to pdf`.

**Pass B — extract page numbers:**
- Parse the generated PDF with `pdftotext -bbox-layout` or `pdfminer.six` to find the page index of every bookmark anchor's caption text (match by exact caption string, e.g. `Fig. 1:`, `TABLE I`, `1.1 Background`).
- Build three maps:
  - `tocMap`: chapter/section title → page (Arabic, restarting at 1 for chapter body; Roman for front matter).
  - `figMap`: `Fig. N` → page.
  - `tableMap`: `TABLE N` → page.

**Pass C — final build:**
- Rebuild the doc with the same content, but populate TOC/LoF/LoT entries using the maps. Each entry uses a `PositionalTab` dot leader to right-align the real page number.
- Re-render PDF, re-extract page numbers, and assert they still match (layout can shift by 1 page when the TOC grows). If any drift, rerun pass C with the new map until it converges (typically 1–2 iterations).

### 3. QA
- `python /tmp/validate_document.py` on the final docx.
- Convert final docx to PDF, render every page with `pdftoppm -r 120`, visually inspect:
  - Cover, certificate logo placement.
  - All section headings left-aligned, body justified.
  - TOC / LoF / LoT page numbers match actual pages (spot-check 5 entries from each).
  - No overflow, no broken tables, dot leaders aligned to right margin.
- Fix and re-iterate until clean. QA images stay in `/tmp/`, not `/mnt/documents/`.

## Out of scope
- No content rewrites (chapters stay as in current build script).
- No app/UI/edge-function changes.
- No new figures embedded — placeholders other than the Vignan logo remain.

## Deliverable

```
<lov-artifact path="Autonomous_Research_Assistant_VFSTR_Project_Report.docx" mime_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document"></lov-artifact>
```
