## Goal

Produce a single deliverable:

```
<lov-artifact path="Autonomous_Research_Assistant_VFSTR_Project_Report.docx" mime_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document"></lov-artifact>
```

A 35–50 page formal VFSTR final-year B.Tech project report for the **Autonomous Research Assistant**, formatted to match the uploaded `Project_Report_FINAL_YEAR.docx` reference exactly in structure, typography, captions, and pagination. The uploaded **Vignan's Foundation logo** (`user-uploads://image.png`) is embedded on the cover page and the certificate page in place of the `[Insert College Logo Here]` placeholder.

## Project metadata

- **Title:** Autonomous Research Assistant: An AI-Powered System for Automated Paper Discovery, Summarization, Domain Classification, and Citation Generation
- **Department:** Computer Science and Engineering
- **University:** Vignan's Foundation for Science, Technology & Research (Deemed to be University), Vadlamudi, Guntur – 522213
- **Degree:** Bachelor of Technology in Computer Science and Engineering
- **Students:**
  - Gnaneshwar Reddy Dontireddy (221FA04603)
  - Yedukondalu Reddy Degala (221FA04011)
- **Guide:** Mr. T. Narasimha Rao, Assistant Professor
- **Academic Year:** 2025–2026
- Dean / HOD names follow the reference pattern (Dr. K. V. Krishna Kishore — Dean; Dr. S. V. Phani Kumar — HOD, CSE).

## Front matter (Roman numerals i–ix)

1. **Cover Page** — title, "A Project Report Submitted in partial fulfilment…", BACHELOR OF TECHNOLOGY in COMPUTER SCIENCE and ENGINEERING, By <students>, Under the Guidance of Mr. T. Narasimha Rao, **embedded Vignan logo** (centered, ~3.5 in wide), DEPARTMENT … VFSTR (Deemed to be University), Vadlamudi, Guntur – 522213, INDIA.
2. **Certificate** — **embedded Vignan logo** at top centered, "DEPARTMENT OF COMPUTER SCIENCE & ENGINEERING", "CERTIFICATE", standard certifying paragraph using project title + students, signature blocks for Project Guide / HOD, CSE / External Examiner.
3. **Declaration** — original-work statement, students + register numbers, Date placeholder.
4. **Acknowledgement** — Dean, HOD, Guide (Mr. T. Narasimha Rao), Project Coordinator, faculty/technical staff, family.
5. **Abstract** — problem, existing limitation, proposed methodology, tech stack (React 18, Deno Edge Functions, PostgreSQL+RLS, Semantic Scholar API, Google Gemini 2.5 Flash, scikit-learn TF-IDF + Linear SVM), experimental results (97.25% test accuracy, macro F1 0.97, 18,000-sample arXiv dataset, 6 domains), conclusion. Followed by **Keywords**.
6. **Table of Contents** — chapter + subsection list with right-aligned page numbers via dot-leader tab stops.
7. **List of Figures** — `Fig. 1 … Fig. N` with captions and pages.
8. **List of Tables** — `TABLE I … TABLE N` with captions and pages.

## Chapter body (Arabic page numbers, restart at 1)

Each chapter starts on a new page: `CHAPTER – N` centered, then bold uppercase title centered, then subsections.

### CHAPTER – 1: INTRODUCTION
1.1 Background · 1.2 Problem Statement · 1.3 Existing System · 1.4 Limitations of Existing Systems · 1.5 Proposed System · 1.6 Objectives · 1.7 Scope · 1.8 Organization of the Report.

### CHAPTER – 2: LITERATURE SURVEY
2.1 Introduction · 2.2 Academic Search Engines and Discovery Platforms · 2.3 Automated Summarization Techniques · 2.4 Keyword and Key-Phrase Extraction · 2.5 Text Classification for Scholarly Documents · 2.6 Citation Management Systems · 2.7 Large Language Models in Research Workflows · 2.8 Limitations of Existing Works and Motivation. Includes a comparative table of related systems.

### CHAPTER – 3: PROPOSED SYSTEM / METHODOLOGY
3.1 System Architecture and Overview (figure placeholder + 6-layer architecture table) · 3.2 Paper Discovery Pipeline (data-flow figure placeholder) · 3.3 Dataset (arXiv 6-domain table) · 3.4 Data Preprocessing · 3.5 Feature Engineering (TF-IDF config table) · 3.6 ML Classification Pipeline (figure placeholder) · 3.7 Classifier Models · 3.8 AI Summarization, Keyword Extraction, Domain Classification via Gemini · 3.9 Citation Generation (APA / MLA / IEEE) · 3.10 Security and Authentication (RLS, JWT) · 3.11 Advantages of the Proposed System.

### CHAPTER – 4: EXPERIMENTAL RESULTS AND DISCUSSION
4.1 Experimental Setup · 4.2 Performance Metrics · 4.3 Model Comparison (table + figure placeholder) · 4.4 Best Model: Tuned Linear SVM (per-class metrics table + heatmap placeholder) · 4.5 Confusion Matrix Analysis (table + placeholder) · 4.6 Comparison with Baselines · 4.7 Qualitative Analysis of Generated Summaries and Citations · 4.8 Discussion. Verified metrics: 97.25% test, 96.17% ± 0.45% CV, macro F1 0.97; LR 97.06%, SGD 97.03%, MNB 96.69%, RF 94.44%.

### CHAPTER – 5: CONCLUSION AND FUTURE WORK
5.1 Summary of the Work · 5.2 Key Contributions · 5.3 Performance Improvements · 5.4 Limitations · 5.5 Future Scope and Enhancements.

### REFERENCES
At least 15 IEEE-style references (Semantic Scholar, arXiv, Gemini/LLMs, BERT/SciBERT, TF-IDF (Salton), SVM (Cortes & Vapnik), scikit-learn, supervised text classification surveys, RLS/PostgreSQL security, citation style guides, etc.).

## Formatting specification

- **Page:** A4 (11906 × 16838 DXA), 1 in margins (1440 DXA).
- **Font:** Times New Roman; body 12 pt, 1.5 line spacing, justified.
- **Headings:** `CHAPTER – N` centered 14 pt bold; chapter title centered 18 pt bold uppercase on its own page; section headings (1.1 …) bold 12 pt left-aligned.
- **Footer:** centered Roman numerals (i, ii, …) for front matter; restart Arabic (1, 2, …) for body via second section with `pageNumbers.start = 1`, `formatType: PageNumberFormat.DECIMAL`.
- **Captions:** figures `Fig. N: …` centered below; tables `TABLE I` then descriptive title line, both centered above the table.
- **Logo embedding:** copy `user-uploads://image.png` to `/tmp/vignan_logo.png`, embed via `ImageRun({ type: "png", data: fs.readFileSync(...), transformation: { width: 360, height: 90 }, altText: { title: "Vignan's Foundation Logo", description: "VFSTR university logo", name: "vignan_logo" } })`. Used on cover (larger, ~3.75 in) and certificate (smaller, ~2.5 in), both centered.
- **Other figure placeholders:** centered bordered paragraphs reading `[Insert Architecture Diagram Here]`, `[Insert Data Flow Diagram Here]`, `[Insert ML Pipeline Diagram Here]`, `[Insert Model Comparison Graph Here]`, `[Insert Per-Class Metrics Heatmap Here]`, `[Insert Confusion Matrix Here]`, plus `[Insert NBA / ABET Logo Here]` on cover.
- **Tables:** `WidthType.DXA`, `columnWidths` summing to 9026, bold header rows, single-line borders, no shading, internal cell margins.
- **TOC / LoF / LoT:** built manually with `PositionalTab` dot-leader to right margin so page numbers align.

## Technical approach

- Use the docx skill (`npm i -g docx`). Single Node script `/tmp/build_vfstr_report.js` constructs a `Document` with two `sections`:
  - Section 1 (front matter): `pageNumbers: { start: 1, formatType: PageNumberFormat.LOWER_ROMAN }`, footer with `PageNumber.CURRENT`.
  - Section 2 (chapters + references): `type: SectionType.NEXT_PAGE`, `pageNumbers: { start: 1, formatType: PageNumberFormat.DECIMAL }`.
- Cover/Certificate/Declaration/Acknowledgement/Abstract/TOC/LoF/LoT separated by `PageBreak` paragraphs.
- Long-form paragraphs written verbatim in the script (no truncation) to reach the 35–50-page target with detailed technical prose, transitions, and comparative analysis. No Lovable branding; backend referred to generically.
- Validate with the skill's `validate_document.py`.
- QA: convert to PDF via `run_libreoffice.py --convert-to pdf`, render every page with `pdftoppm`, and visually inspect for overflow, broken tables, missing captions, page-number restart, dot-leader alignment, and correct logo placement/sizing on the cover and certificate. Fix and re-render until clean. QA images are not copied to `/mnt/documents`.

## Out of scope

- No code changes to the React app or edge functions.
- Other diagrams remain as `[Insert … Here]` placeholders (only the Vignan logo is embedded).
- No new memory files.
