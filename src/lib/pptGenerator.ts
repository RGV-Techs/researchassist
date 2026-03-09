import PptxGenJS from "pptxgenjs";
import { presentationContent, designConfig } from "@/data/presentationContent";

const { colors, fonts } = designConfig;

// Helper to convert image URL to base64 for embedding
async function fetchImageAsBase64(url: string): Promise<string | null> {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

function addSlideHeader(slide: PptxGenJS.Slide, title: string) {
  slide.addShape("rect", {
    x: 0, y: 0, w: "100%", h: 1.2,
    fill: { color: colors.primary }
  });
  slide.addText(title, {
    x: 0.5, y: 0.3, w: 9, h: 0.7,
    fontSize: fonts.heading.size, bold: true, color: "FFFFFF",
    fontFace: fonts.heading.face
  });
}

function addTitleSlide(pptx: PptxGenJS) {
  const slide = pptx.addSlide();
  
  slide.addShape("rect", {
    x: 0, y: 0, w: "100%", h: "100%",
    fill: { color: colors.primary }
  });
  slide.addShape("rect", {
    x: 0, y: 0, w: "100%", h: "40%",
    fill: { color: colors.secondary, transparency: 50 }
  });
  
  slide.addText(presentationContent.title.main, {
    x: 0.5, y: 2, w: 9, h: 1.5,
    fontSize: 44, bold: true, color: "FFFFFF",
    align: "center", fontFace: "Arial"
  });
  slide.addText(presentationContent.title.subtitle, {
    x: 0.5, y: 3.5, w: 9, h: 0.8,
    fontSize: 20, color: "FFFFFF",
    align: "center", fontFace: "Arial", transparency: 20
  });
  slide.addText(`${presentationContent.title.author}\n${presentationContent.title.date}`, {
    x: 0.5, y: 4.8, w: 9, h: 0.8,
    fontSize: 16, color: "FFFFFF",
    align: "center", fontFace: "Arial", transparency: 40
  });
}

function addContentSlide(pptx: PptxGenJS, title: string, bullets: string[]) {
  const slide = pptx.addSlide();
  addSlideHeader(slide, title);
  
  const bulletRows = bullets.map(text => ({
    text,
    options: { bullet: { type: "bullet" as const, color: colors.primary }, indentLevel: 0 }
  }));
  
  slide.addText(bulletRows, {
    x: 0.5, y: 1.5, w: 9, h: 4,
    fontSize: fonts.body.size, color: colors.text,
    fontFace: fonts.body.face, valign: "top",
    paraSpaceAfter: 12
  });
}

function addTableSlide(pptx: PptxGenJS, title: string, headers: string[], rows: string[][], highlightRow?: number) {
  const slide = pptx.addSlide();
  addSlideHeader(slide, title);
  
  const tableData = [
    headers.map(h => ({ text: h, options: { bold: true, fill: { color: colors.lightGray }, fontSize: 13 } })),
    ...rows.map((row, i) => row.map(cell => ({
      text: cell,
      options: {
        fill: i === highlightRow ? { color: "D1FAE5" } : {},
        bold: i === highlightRow,
        fontSize: 12
      }
    })))
  ];
  
  slide.addTable(tableData, {
    x: 0.5, y: 1.5, w: 9,
    fontSize: 12, fontFace: "Arial",
    border: { pt: 1, color: "CCCCCC" },
    align: "left", valign: "middle",
    rowH: 0.45
  });

  // Add footer note if highlight row
  if (highlightRow !== undefined) {
    slide.addText(`★ Best Model: ${rows[highlightRow][0]}`, {
      x: 0.5, y: 4.8, w: 9, h: 0.4,
      fontSize: 14, bold: true, color: colors.accent,
      fontFace: "Arial"
    });
  }
}

function addImageSlide(slide: PptxGenJS.Slide, title: string, imageData: string, caption?: string) {
  addSlideHeader(slide, title);
  
  slide.addImage({
    data: imageData,
    x: 0.8, y: 1.4, w: 8.4, h: 3.8,
    sizing: { type: "contain", w: 8.4, h: 3.8 }
  });

  if (caption) {
    slide.addText(caption, {
      x: 0.5, y: 5.1, w: 9, h: 0.35,
      fontSize: 11, italic: true, color: colors.text,
      align: "center", fontFace: "Arial"
    });
  }
}

function addArchitectureSlide(pptx: PptxGenJS, imageData?: string | null) {
  const slide = pptx.addSlide();
  
  if (imageData) {
    addImageSlide(slide, presentationContent.architecture.title, imageData, "Fig. 1: Multi-layer system architecture with external service integration");
    return;
  }

  addSlideHeader(slide, presentationContent.architecture.title);
  
  const layers = presentationContent.architecture.layers;
  const boxHeight = 0.7;
  const startY = 1.6;
  const layerColors = [colors.secondary, colors.primary, colors.accent, colors.primary, colors.secondary, colors.darkBlue];
  
  layers.forEach((layer, index) => {
    const y = startY + (index * (boxHeight + 0.15));
    slide.addShape("rect", { x: 0.5, y, w: 3.5, h: boxHeight, fill: { color: layerColors[index] || colors.primary } });
    slide.addText(layer.name, { x: 0.5, y, w: 3.5, h: boxHeight, fontSize: 14, bold: true, color: "FFFFFF", align: "center", valign: "middle", fontFace: "Arial" });
    slide.addShape("rect", { x: 4.2, y, w: 5.3, h: boxHeight, fill: { color: colors.lightGray } });
    slide.addText(layer.components, { x: 4.2, y, w: 5.3, h: boxHeight, fontSize: 12, color: colors.text, align: "center", valign: "middle", fontFace: "Arial" });
  });
}

function addDatabaseSlide(pptx: PptxGenJS) {
  const slide = pptx.addSlide();
  addSlideHeader(slide, presentationContent.databaseSchema.title);
  
  const tables = presentationContent.databaseSchema.tables;
  const boxWidth = 2.9;
  
  tables.forEach((table, index) => {
    const x = 0.5 + (index * (boxWidth + 0.2));
    slide.addShape("rect", { x, y: 1.5, w: boxWidth, h: 0.5, fill: { color: colors.primary } });
    slide.addText(table.name, { x, y: 1.5, w: boxWidth, h: 0.5, fontSize: 14, bold: true, color: "FFFFFF", align: "center", valign: "middle", fontFace: "Arial" });
    slide.addShape("rect", { x, y: 2, w: boxWidth, h: 2.2, fill: { color: colors.lightGray }, line: { color: colors.primary, pt: 1 } });
    slide.addText(table.columns.join("\n"), { x: x + 0.1, y: 2.1, w: boxWidth - 0.2, h: 2, fontSize: 10, color: colors.text, align: "left", valign: "top", fontFace: "Arial" });
    slide.addText(table.description, { x, y: 4.3, w: boxWidth, h: 0.6, fontSize: 9, color: colors.text, align: "center", valign: "top", fontFace: "Arial", italic: true });
  });
  
  slide.addText("→", { x: 3.3, y: 2.8, w: 0.3, h: 0.3, fontSize: 24, color: colors.primary, align: "center" });
  slide.addText("→", { x: 6.4, y: 2.8, w: 0.3, h: 0.3, fontSize: 24, color: colors.primary, align: "center" });
}

function addFeaturesSlide(pptx: PptxGenJS) {
  const slide = pptx.addSlide();
  addSlideHeader(slide, presentationContent.keyFeatures.title);
  
  const features = presentationContent.keyFeatures.features;
  const iconColors = [colors.primary, colors.secondary, colors.accent, colors.darkBlue, colors.primary];
  
  features.forEach((feature, index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const x = 0.5 + (col * 4.7);
    const y = 1.5 + (row * 1.4);
    
    slide.addShape("ellipse", { x, y, w: 0.5, h: 0.5, fill: { color: iconColors[index] } });
    slide.addText(feature.name, { x: x + 0.7, y, w: 3.8, h: 0.4, fontSize: 16, bold: true, color: colors.text, fontFace: "Arial", valign: "middle" });
    slide.addText(feature.description, { x: x + 0.7, y: y + 0.45, w: 3.8, h: 0.7, fontSize: 12, color: colors.text, fontFace: "Arial", valign: "top" });
  });
}

function addAIPipelineSlide(pptx: PptxGenJS) {
  const slide = pptx.addSlide();
  addSlideHeader(slide, presentationContent.aiPipeline.title);
  
  const stages = presentationContent.aiPipeline.stages;
  const stageWidth = 1.6;
  const startX = 0.5;
  const stageColors = [colors.lightGray, colors.primary, colors.secondary, colors.accent, colors.darkBlue];
  
  stages.forEach((stage, index) => {
    const x = startX + (index * (stageWidth + 0.2));
    const isFirst = index === 0;
    
    slide.addShape("rect", { x, y: 2, w: stageWidth, h: 0.6, fill: { color: stageColors[index] } });
    slide.addText(stage.stage, { x, y: 2, w: stageWidth, h: 0.6, fontSize: 12, bold: true, color: isFirst ? colors.text : "FFFFFF", align: "center", valign: "middle", fontFace: "Arial" });
    
    if (index < stages.length - 1) {
      slide.addText("→", { x: x + stageWidth, y: 2, w: 0.2, h: 0.6, fontSize: 18, color: colors.primary, align: "center", valign: "middle" });
    }
    
    slide.addText(stage.description, { x, y: 2.8, w: stageWidth, h: 1, fontSize: 10, color: colors.text, align: "center", valign: "top", fontFace: "Arial" });
  });
}

function addTimelineSlide(pptx: PptxGenJS) {
  const slide = pptx.addSlide();
  addSlideHeader(slide, presentationContent.timeline.title);
  
  const phases = presentationContent.timeline.phases;
  const phaseColors = [colors.primary, colors.secondary, colors.accent, colors.darkBlue, colors.primary, colors.secondary];
  
  phases.forEach((phase, index) => {
    const y = 1.5 + (index * 0.75);
    slide.addShape("rect", { x: 0.5, y, w: 1.2, h: 0.5, fill: { color: phaseColors[index] } });
    slide.addText(`Week ${phase.week}`, { x: 0.5, y, w: 1.2, h: 0.5, fontSize: 11, bold: true, color: "FFFFFF", align: "center", valign: "middle", fontFace: "Arial" });
    slide.addText(phase.phase, { x: 1.9, y, w: 2.5, h: 0.5, fontSize: 14, bold: true, color: colors.text, valign: "middle", fontFace: "Arial" });
    slide.addText(phase.tasks, { x: 4.5, y, w: 5, h: 0.5, fontSize: 12, color: colors.text, valign: "middle", fontFace: "Arial" });
  });
}

function addTwoColumnSlide(pptx: PptxGenJS, title: string, leftTitle: string, leftItems: string[], rightTitle: string, rightItems: string[]) {
  const slide = pptx.addSlide();
  addSlideHeader(slide, title);
  
  slide.addText(leftTitle, { x: 0.5, y: 1.4, w: 4.3, h: 0.5, fontSize: 16, bold: true, color: colors.primary, fontFace: "Arial" });
  const leftBullets = leftItems.map(text => ({ text, options: { bullet: { type: "bullet" as const, color: colors.primary }, indentLevel: 0 } }));
  slide.addText(leftBullets, { x: 0.5, y: 1.9, w: 4.3, h: 3.5, fontSize: 14, color: colors.text, fontFace: "Arial", valign: "top", paraSpaceAfter: 8 });
  
  slide.addText(rightTitle, { x: 5.2, y: 1.4, w: 4.3, h: 0.5, fontSize: 16, bold: true, color: colors.secondary, fontFace: "Arial" });
  const rightBullets = rightItems.map(text => ({ text, options: { bullet: { type: "bullet" as const, color: colors.secondary }, indentLevel: 0 } }));
  slide.addText(rightBullets, { x: 5.2, y: 1.9, w: 4.3, h: 3.5, fontSize: 14, color: colors.text, fontFace: "Arial", valign: "top", paraSpaceAfter: 8 });
}

function addConclusionSlide(pptx: PptxGenJS) {
  const slide = pptx.addSlide();
  slide.addShape("rect", { x: 0, y: 0, w: "100%", h: "100%", fill: { color: colors.primary } });
  slide.addText(presentationContent.conclusion.title, { x: 0.5, y: 0.8, w: 9, h: 0.8, fontSize: 36, bold: true, color: "FFFFFF", align: "center", fontFace: "Arial" });
  
  const bullets = presentationContent.conclusion.points.map(text => ({ text, options: { bullet: { type: "bullet" as const, color: "FFFFFF" }, indentLevel: 0 } }));
  slide.addText(bullets, { x: 1, y: 2, w: 8, h: 3.5, fontSize: 18, color: "FFFFFF", fontFace: "Arial", valign: "top", paraSpaceAfter: 14 });
}

function addReferencesSlide(pptx: PptxGenJS) {
  const slide = pptx.addSlide();
  addSlideHeader(slide, presentationContent.references.title);
  
  const refs = presentationContent.references.items.map((text, i) => ({ text: `${i + 1}. ${text}`, options: { indentLevel: 0 } }));
  slide.addText(refs, { x: 0.5, y: 1.5, w: 9, h: 4, fontSize: 16, color: colors.text, fontFace: "Arial", valign: "top", paraSpaceAfter: 12 });
}

function addThankYouSlide(pptx: PptxGenJS) {
  const slide = pptx.addSlide();
  slide.addShape("rect", { x: 0, y: 0, w: "100%", h: "100%", fill: { color: colors.secondary } });
  slide.addText("Thank You!", { x: 0, y: 2, w: "100%", h: 1.5, fontSize: 54, bold: true, color: "FFFFFF", align: "center", fontFace: "Arial" });
  slide.addText("Questions & Discussion", { x: 0, y: 3.5, w: "100%", h: 0.8, fontSize: 24, color: "FFFFFF", align: "center", fontFace: "Arial", transparency: 30 });
}

// Load all diagram images
async function loadDiagramImages(): Promise<Record<string, string | null>> {
  const imageNames = [
    "system_architecture",
    "data_flow",
    "ml_pipeline",
    "model_comparison",
    "confusion_matrix"
  ];
  
  const entries = await Promise.all(
    imageNames.map(async (name) => {
      const data = await fetchImageAsBase64(`/images/${name}.png`);
      return [name, data] as [string, string | null];
    })
  );
  
  return Object.fromEntries(entries);
}

export async function generateProjectPPT(): Promise<void> {
  const pptx = new PptxGenJS();
  
  pptx.author = "Gnaneshwar Reddy D, Yedukondalu Reddy D";
  pptx.title = "Autonomous Research Assistant - System Design";
  pptx.subject = "AI-powered Paper Discovery, Summarization & Citation Generation";
  pptx.company = "Research Project";
  
  // Load diagram images
  const images = await loadDiagramImages();
  
  // Slide 1: Title
  addTitleSlide(pptx);
  
  // Slide 2: Problem Statement
  addContentSlide(pptx, presentationContent.problemStatement.title, presentationContent.problemStatement.points);
  
  // Slide 3: Proposed Solution
  addContentSlide(pptx, presentationContent.proposedSolution.title, presentationContent.proposedSolution.points);
  
  // Slide 4: System Architecture (with diagram)
  addArchitectureSlide(pptx, images.system_architecture);
  
  // Slide 5: Technology Stack Table
  addTableSlide(
    pptx,
    presentationContent.techStack.title,
    ["Category", "Technology"],
    presentationContent.techStack.items.map(item => [item.category, item.technology])
  );
  
  // Slide 6: Database Schema
  addDatabaseSlide(pptx);
  
  // Slide 7: Data Flow (with diagram if available)
  if (images.data_flow) {
    const slide = pptx.addSlide();
    addImageSlide(slide, presentationContent.dataFlow.title, images.data_flow, "Fig. 2: End-to-end paper discovery and enrichment pipeline");
  } else {
    addContentSlide(pptx, presentationContent.dataFlow.title, presentationContent.dataFlow.steps);
  }
  
  // Slide 8: Key Features
  addFeaturesSlide(pptx);
  
  // Slide 9: AI Pipeline
  addAIPipelineSlide(pptx);
  
  // Slide 10: ML Dataset & Preprocessing
  addContentSlide(pptx, presentationContent.mlDataset.title, presentationContent.mlDataset.points);
  
  // Slide 11: ML Pipeline Diagram (if available)
  if (images.ml_pipeline) {
    const slide = pptx.addSlide();
    addImageSlide(slide, "ML Classification Pipeline", images.ml_pipeline, "Fig. 3: End-to-end ML pipeline from dataset to production deployment via knowledge transfer");
  }
  
  // Slide 12: ML Model Training Results Table (highlight Linear SVM = row index 2)
  addTableSlide(
    pptx,
    presentationContent.mlTraining.title,
    ["Model", "Accuracy", "F1 Score", "Precision", "Recall"],
    presentationContent.mlTraining.models.map(m => [m.name, m.accuracy, m.f1, m.precision, m.recall]),
    2 // highlight Linear SVM (Tuned)
  );
  
  // Slide 13: Model Comparison Chart (if available)
  if (images.model_comparison) {
    const slide = pptx.addSlide();
    addImageSlide(slide, "Model Comparison - Accuracy & F1 Scores", images.model_comparison, "Fig. 4: Comparative analysis of 5 classifiers on 18K arXiv papers (80/20 stratified split)");
  }
  
  // Slide 14: Per-Class Performance Table
  addTableSlide(
    pptx,
    `Per-Class Performance — Best Model: Linear SVM (97.25%)`,
    ["Domain", "Precision", "Recall", "F1-Score"],
    presentationContent.mlTraining.perClass.map(c => [c.domain, c.precision, c.recall, c.f1])
  );

  // Slide 15: Confusion Matrix (if available)
  if (images.confusion_matrix) {
    const slide = pptx.addSlide();
    addImageSlide(slide, "Confusion Matrix — Linear SVM (Tuned)", images.confusion_matrix, "Fig. 5: 6-class confusion matrix showing strong diagonal dominance (97.25% overall accuracy)");
  }

  // Slide 16: Cross-Validation Summary
  {
    const slide = pptx.addSlide();
    addSlideHeader(slide, "Model Validation Summary");
    
    const summaryItems = [
      `Best Model: ${presentationContent.mlTraining.bestModel}`,
      `5-Fold Cross-Validation: ${presentationContent.mlTraining.cvAccuracy}`,
      "Train/Test Split: 80/20 Stratified (14,400 / 3,600)",
      "Feature Space: 50,000 TF-IDF features, n-gram range (1,3)",
      "Custom Test Abstracts: 100% correct classification",
      "Macro-averaged F1: 0.97 across all 6 domains"
    ];
    
    const bullets = summaryItems.map(text => ({
      text,
      options: { bullet: { type: "bullet" as const, color: colors.accent }, indentLevel: 0 }
    }));
    
    slide.addText(bullets, {
      x: 0.5, y: 1.5, w: 9, h: 4,
      fontSize: 18, color: colors.text,
      fontFace: "Arial", valign: "top",
      paraSpaceAfter: 14
    });
  }
  
  // Slide 17: Security
  addContentSlide(pptx, presentationContent.security.title, presentationContent.security.measures);
  
  // Slide 18: Testing
  addTwoColumnSlide(
    pptx,
    presentationContent.testing.title,
    presentationContent.testing.categories[0].type,
    presentationContent.testing.categories[0].items,
    presentationContent.testing.categories[1].type,
    presentationContent.testing.categories[1].items
  );
  
  // Slide 19: Timeline
  addTimelineSlide(pptx);
  
  // Slide 20: Future Enhancements
  addContentSlide(pptx, presentationContent.futureEnhancements.title, presentationContent.futureEnhancements.items);
  
  // Slide 21: Conclusion
  addConclusionSlide(pptx);
  
  // Slide 22: References
  addReferencesSlide(pptx);
  
  // Slide 23: Thank You
  addThankYouSlide(pptx);
  
  pptx.writeFile({ fileName: "Autonomous_Research_Assistant_Presentation.pptx" });
}
