## Goal

Produce a downloadable `.docx` journal article that:
- Uses the **exact text content** from `Autonomous_Research_Assisstant_2_1_1.docx` (no rewording).
- Embeds the **6 uploaded diagrams** (system architecture, data flow, ML pipeline, model comparison, per-class metrics heatmap, confusion matrix) and the exact metric tables.
- Strictly follows the **IJFMR `research-paper-format.docx`** style guide.

## Output

Single artifact written to `/mnt/documents/Autonomous_Research_Assistant_IJFMR.docx`, surfaced via `<lov-artifact>`.

## IJFMR formatting rules to apply

- A4 page; margins: left/right 1.60 cm, top 1.20 cm, bottom 0.60 cm.
- Single column, Times New Roman.
- Title: 24 pt Bold, Title Case, centered.
- Authors: 16 pt Bold, Title Case, centered, with affiliation lines (12 pt) below.
- All other text: 12 pt; line spacing 1.15; justified paragraphs; left-aligned references.
- Headings: bold, same size as body, numbered (1, 1.1, 1.2…), no colon, "keep with next".
- No italic, no underline, no Roman numerals, no first-line indent, no before/after paragraph spacing (use blank paragraphs for separation), no page breaks.
- Figures/tables: centered, captions centered above ("Figure 1: …", "Table 1: …", Title Case, no bold/italic), blank paragraphs above and below, no cell shading, bold header row.
- References: numbered "1.", left-aligned, no italic.

## Content mapping (verbatim text, only structure renumbered)

Source uses Roman numerals (I–VII); IJFMR forbids Roman numerals → renumber to 1–7. Keep all wording identical.

1. **Title** — Autonomous Research Assistant: An AI-Powered System for Automated Paper Discovery, Summarization, Domain Classification, and Citation Generation
2. **Authors** — Gnaneshwar Reddy Dontireddy, Yedukondalu Reddy Degala, T. Narashimha Rao (with department + affiliation + emails as in source).
3. **Abstract** — verbatim paragraph from source.
4. **Keywords** — from "Index Terms" line, comma-separated.
5. **Section 1. Introduction** — verbatim.
6. **Section 2. Related Work** (2.1 Academic Search Engines, 2.2 Automated Summarization, plus remaining subsections from source).
7. **Section 3. System Architecture** — verbatim, including the architecture-layers table; insert **Figure 1: System Architecture** (uploaded `system_architecture_1.png`) and **Figure 2: Paper Discovery Pipeline Data Flow** (uploaded `data_flow_1.png`).
8. **Section 4. ML Classification Pipeline** — verbatim with TABLE II (dataset) and TABLE III (TF-IDF config); insert **Figure 3: ML Classification Pipeline** (uploaded `ml_pipeline_1.png`).
9. **Section 5. Experimental Results** — verbatim with model comparison table; insert **Figure 4: Model Comparison** (uploaded `model_comparison_1.png`), **Table: Per-Class Metrics**, **Figure 5: Per-Class Classification Metrics Heatmap** (uploaded `per_class_metrics_1.png`), **Confusion Matrix table** + **Figure 6: Confusion Matrix** (uploaded `confusion_matrix_1.png`).
10. **Section 6. Discussion / Limitations / Future Enhancements** — verbatim.
11. **Section 7. Conclusion** — verbatim.
12. **References** — verbatim list, reformatted to IJFMR "1." numbering style, left-aligned, no italic.

## Technical approach

- Use docx-js (Node) per the docx skill — set page size A4 (11906×16838 DXA), custom margins (~907 left/right, 680 top, 340 bottom DXA), TNR default font, line spacing 1.15.
- Re-extract verbatim source text (lines 1–700 of the parsed source) into a structured JS object so wording is preserved exactly.
- Copy the 6 uploaded PNGs into `/tmp/` and embed via `ImageRun` (type:"png") at ~5.5 inch widths, centered.
- Build tables with `WidthType.DXA`, no shading, bold header rows, centered.
- Validate the .docx with the skill's `validate_document.py`.
- QA: convert to PDF via LibreOffice + render pages with `pdftoppm`, visually inspect each page for overflow/clipping, fix and re-render until clean.

## Deliverable

```
<lov-artifact path="Autonomous_Research_Assistant_IJFMR.docx" mime_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document"></lov-artifact>
```
