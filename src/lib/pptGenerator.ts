import PptxGenJS from "pptxgenjs";
import { presentationContent, designConfig } from "@/data/presentationContent";

const { colors, fonts } = designConfig;

function addTitleSlide(pptx: PptxGenJS) {
  const slide = pptx.addSlide();
  
  // Background gradient effect
  slide.addShape("rect", {
    x: 0, y: 0, w: "100%", h: "100%",
    fill: { color: colors.primary }
  });
  
  slide.addShape("rect", {
    x: 0, y: 0, w: "100%", h: "40%",
    fill: { color: colors.secondary, transparency: 50 }
  });
  
  // Title
  slide.addText(presentationContent.title.main, {
    x: 0.5, y: 2, w: 9, h: 1.5,
    fontSize: 44, bold: true, color: "FFFFFF",
    align: "center", fontFace: "Arial"
  });
  
  // Subtitle
  slide.addText(presentationContent.title.subtitle, {
    x: 0.5, y: 3.5, w: 9, h: 0.8,
    fontSize: 20, color: "FFFFFF",
    align: "center", fontFace: "Arial", transparency: 20
  });
  
  // Author & Date
  slide.addText(`${presentationContent.title.author}\n${presentationContent.title.date}`, {
    x: 0.5, y: 4.8, w: 9, h: 0.8,
    fontSize: 16, color: "FFFFFF",
    align: "center", fontFace: "Arial", transparency: 40
  });
}

function addContentSlide(pptx: PptxGenJS, title: string, bullets: string[]) {
  const slide = pptx.addSlide();
  
  // Header bar
  slide.addShape("rect", {
    x: 0, y: 0, w: "100%", h: 1.2,
    fill: { color: colors.primary }
  });
  
  // Title
  slide.addText(title, {
    x: 0.5, y: 0.3, w: 9, h: 0.7,
    fontSize: fonts.heading.size, bold: true, color: "FFFFFF",
    fontFace: fonts.heading.face
  });
  
  // Bullet points
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

function addTableSlide(pptx: PptxGenJS, title: string, headers: string[], rows: string[][]) {
  const slide = pptx.addSlide();
  
  // Header bar
  slide.addShape("rect", {
    x: 0, y: 0, w: "100%", h: 1.2,
    fill: { color: colors.primary }
  });
  
  // Title
  slide.addText(title, {
    x: 0.5, y: 0.3, w: 9, h: 0.7,
    fontSize: fonts.heading.size, bold: true, color: "FFFFFF",
    fontFace: fonts.heading.face
  });
  
  // Table
  const tableData = [
    headers.map(h => ({ text: h, options: { bold: true, fill: { color: colors.lightGray } } })),
    ...rows.map(row => row.map(cell => ({ text: cell, options: {} })))
  ];
  
  slide.addTable(tableData, {
    x: 0.5, y: 1.5, w: 9,
    fontSize: 14, fontFace: "Arial",
    border: { pt: 1, color: "CCCCCC" },
    align: "left", valign: "middle",
    rowH: 0.5
  });
}

function addArchitectureSlide(pptx: PptxGenJS) {
  const slide = pptx.addSlide();
  
  // Header bar
  slide.addShape("rect", {
    x: 0, y: 0, w: "100%", h: 1.2,
    fill: { color: colors.primary }
  });
  
  slide.addText(presentationContent.architecture.title, {
    x: 0.5, y: 0.3, w: 9, h: 0.7,
    fontSize: fonts.heading.size, bold: true, color: "FFFFFF",
    fontFace: fonts.heading.face
  });
  
  // Architecture layers
  const layers = presentationContent.architecture.layers;
  const boxHeight = 0.7;
  const startY = 1.6;
  const layerColors = [colors.secondary, colors.primary, colors.accent, colors.primary, colors.secondary, colors.darkBlue];
  
  layers.forEach((layer, index) => {
    const y = startY + (index * (boxHeight + 0.15));
    
    // Layer box
    slide.addShape("rect", {
      x: 0.5, y, w: 3.5, h: boxHeight,
      fill: { color: layerColors[index] || colors.primary }
    });
    
    slide.addText(layer.name, {
      x: 0.5, y, w: 3.5, h: boxHeight,
      fontSize: 14, bold: true, color: "FFFFFF",
      align: "center", valign: "middle", fontFace: "Arial"
    });
    
    // Components
    slide.addShape("rect", {
      x: 4.2, y, w: 5.3, h: boxHeight,
      fill: { color: colors.lightGray }
    });
    
    slide.addText(layer.components, {
      x: 4.2, y, w: 5.3, h: boxHeight,
      fontSize: 12, color: colors.text,
      align: "center", valign: "middle", fontFace: "Arial"
    });
  });
}

function addDatabaseSlide(pptx: PptxGenJS) {
  const slide = pptx.addSlide();
  
  // Header bar
  slide.addShape("rect", {
    x: 0, y: 0, w: "100%", h: 1.2,
    fill: { color: colors.primary }
  });
  
  slide.addText(presentationContent.databaseSchema.title, {
    x: 0.5, y: 0.3, w: 9, h: 0.7,
    fontSize: fonts.heading.size, bold: true, color: "FFFFFF",
    fontFace: fonts.heading.face
  });
  
  // Tables
  const tables = presentationContent.databaseSchema.tables;
  const boxWidth = 2.9;
  
  tables.forEach((table, index) => {
    const x = 0.5 + (index * (boxWidth + 0.2));
    
    // Table header
    slide.addShape("rect", {
      x, y: 1.5, w: boxWidth, h: 0.5,
      fill: { color: colors.primary }
    });
    
    slide.addText(table.name, {
      x, y: 1.5, w: boxWidth, h: 0.5,
      fontSize: 14, bold: true, color: "FFFFFF",
      align: "center", valign: "middle", fontFace: "Arial"
    });
    
    // Columns
    slide.addShape("rect", {
      x, y: 2, w: boxWidth, h: 2.2,
      fill: { color: colors.lightGray },
      line: { color: colors.primary, pt: 1 }
    });
    
    slide.addText(table.columns.join("\n"), {
      x: x + 0.1, y: 2.1, w: boxWidth - 0.2, h: 2,
      fontSize: 10, color: colors.text,
      align: "left", valign: "top", fontFace: "Arial"
    });
    
    // Description
    slide.addText(table.description, {
      x, y: 4.3, w: boxWidth, h: 0.6,
      fontSize: 9, color: colors.text,
      align: "center", valign: "top", fontFace: "Arial", italic: true
    });
  });
  
  // Relationships arrows
  slide.addText("→", { x: 3.3, y: 2.8, w: 0.3, h: 0.3, fontSize: 24, color: colors.primary, align: "center" });
  slide.addText("→", { x: 6.4, y: 2.8, w: 0.3, h: 0.3, fontSize: 24, color: colors.primary, align: "center" });
}

function addFeaturesSlide(pptx: PptxGenJS) {
  const slide = pptx.addSlide();
  
  // Header bar
  slide.addShape("rect", {
    x: 0, y: 0, w: "100%", h: 1.2,
    fill: { color: colors.primary }
  });
  
  slide.addText(presentationContent.keyFeatures.title, {
    x: 0.5, y: 0.3, w: 9, h: 0.7,
    fontSize: fonts.heading.size, bold: true, color: "FFFFFF",
    fontFace: fonts.heading.face
  });
  
  // Features grid
  const features = presentationContent.keyFeatures.features;
  const iconColors = [colors.primary, colors.secondary, colors.accent, colors.darkBlue, colors.primary];
  
  features.forEach((feature, index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const x = 0.5 + (col * 4.7);
    const y = 1.5 + (row * 1.4);
    
    // Feature icon placeholder
    slide.addShape("ellipse", {
      x, y, w: 0.5, h: 0.5,
      fill: { color: iconColors[index] }
    });
    
    // Feature name
    slide.addText(feature.name, {
      x: x + 0.7, y, w: 3.8, h: 0.4,
      fontSize: 16, bold: true, color: colors.text,
      fontFace: "Arial", valign: "middle"
    });
    
    // Feature description
    slide.addText(feature.description, {
      x: x + 0.7, y: y + 0.45, w: 3.8, h: 0.7,
      fontSize: 12, color: colors.text,
      fontFace: "Arial", valign: "top"
    });
  });
}

function addAIPipelineSlide(pptx: PptxGenJS) {
  const slide = pptx.addSlide();
  
  // Header bar
  slide.addShape("rect", {
    x: 0, y: 0, w: "100%", h: 1.2,
    fill: { color: colors.primary }
  });
  
  slide.addText(presentationContent.aiPipeline.title, {
    x: 0.5, y: 0.3, w: 9, h: 0.7,
    fontSize: fonts.heading.size, bold: true, color: "FFFFFF",
    fontFace: fonts.heading.face
  });
  
  // Pipeline stages
  const stages = presentationContent.aiPipeline.stages;
  const stageWidth = 1.6;
  const startX = 0.5;
  const stageColors = [colors.lightGray, colors.primary, colors.secondary, colors.accent, colors.darkBlue];
  
  stages.forEach((stage, index) => {
    const x = startX + (index * (stageWidth + 0.2));
    const isFirst = index === 0;
    
    // Stage box
    slide.addShape("rect", {
      x, y: 2, w: stageWidth, h: 0.6,
      fill: { color: stageColors[index] }
    });
    
    slide.addText(stage.stage, {
      x, y: 2, w: stageWidth, h: 0.6,
      fontSize: 12, bold: true, color: isFirst ? colors.text : "FFFFFF",
      align: "center", valign: "middle", fontFace: "Arial"
    });
    
    // Arrow
    if (index < stages.length - 1) {
      slide.addText("→", {
        x: x + stageWidth, y: 2, w: 0.2, h: 0.6,
        fontSize: 18, color: colors.primary,
        align: "center", valign: "middle"
      });
    }
    
    // Description
    slide.addText(stage.description, {
      x, y: 2.8, w: stageWidth, h: 1,
      fontSize: 10, color: colors.text,
      align: "center", valign: "top", fontFace: "Arial"
    });
  });
}

function addTimelineSlide(pptx: PptxGenJS) {
  const slide = pptx.addSlide();
  
  // Header bar
  slide.addShape("rect", {
    x: 0, y: 0, w: "100%", h: 1.2,
    fill: { color: colors.primary }
  });
  
  slide.addText(presentationContent.timeline.title, {
    x: 0.5, y: 0.3, w: 9, h: 0.7,
    fontSize: fonts.heading.size, bold: true, color: "FFFFFF",
    fontFace: fonts.heading.face
  });
  
  // Timeline
  const phases = presentationContent.timeline.phases;
  const phaseColors = [colors.primary, colors.secondary, colors.accent, colors.darkBlue, colors.primary, colors.secondary];
  
  phases.forEach((phase, index) => {
    const y = 1.5 + (index * 0.75);
    
    // Week badge
    slide.addShape("rect", {
      x: 0.5, y, w: 1.2, h: 0.5,
      fill: { color: phaseColors[index] }
    });
    
    slide.addText(`Week ${phase.week}`, {
      x: 0.5, y, w: 1.2, h: 0.5,
      fontSize: 11, bold: true, color: "FFFFFF",
      align: "center", valign: "middle", fontFace: "Arial"
    });
    
    // Phase name
    slide.addText(phase.phase, {
      x: 1.9, y, w: 2.5, h: 0.5,
      fontSize: 14, bold: true, color: colors.text,
      valign: "middle", fontFace: "Arial"
    });
    
    // Tasks
    slide.addText(phase.tasks, {
      x: 4.5, y, w: 5, h: 0.5,
      fontSize: 12, color: colors.text,
      valign: "middle", fontFace: "Arial"
    });
  });
}

function addTwoColumnSlide(pptx: PptxGenJS, title: string, leftTitle: string, leftItems: string[], rightTitle: string, rightItems: string[]) {
  const slide = pptx.addSlide();
  
  // Header bar
  slide.addShape("rect", {
    x: 0, y: 0, w: "100%", h: 1.2,
    fill: { color: colors.primary }
  });
  
  slide.addText(title, {
    x: 0.5, y: 0.3, w: 9, h: 0.7,
    fontSize: fonts.heading.size, bold: true, color: "FFFFFF",
    fontFace: fonts.heading.face
  });
  
  // Left column title
  slide.addText(leftTitle, {
    x: 0.5, y: 1.4, w: 4.3, h: 0.5,
    fontSize: 16, bold: true, color: colors.primary,
    fontFace: "Arial"
  });
  
  // Left column items
  const leftBullets = leftItems.map(text => ({
    text,
    options: { bullet: { type: "bullet" as const, color: colors.primary }, indentLevel: 0 }
  }));
  
  slide.addText(leftBullets, {
    x: 0.5, y: 1.9, w: 4.3, h: 3.5,
    fontSize: 14, color: colors.text,
    fontFace: "Arial", valign: "top",
    paraSpaceAfter: 8
  });
  
  // Right column title
  slide.addText(rightTitle, {
    x: 5.2, y: 1.4, w: 4.3, h: 0.5,
    fontSize: 16, bold: true, color: colors.secondary,
    fontFace: "Arial"
  });
  
  // Right column items
  const rightBullets = rightItems.map(text => ({
    text,
    options: { bullet: { type: "bullet" as const, color: colors.secondary }, indentLevel: 0 }
  }));
  
  slide.addText(rightBullets, {
    x: 5.2, y: 1.9, w: 4.3, h: 3.5,
    fontSize: 14, color: colors.text,
    fontFace: "Arial", valign: "top",
    paraSpaceAfter: 8
  });
}

function addConclusionSlide(pptx: PptxGenJS) {
  const slide = pptx.addSlide();
  
  // Full background
  slide.addShape("rect", {
    x: 0, y: 0, w: "100%", h: "100%",
    fill: { color: colors.primary }
  });
  
  slide.addText(presentationContent.conclusion.title, {
    x: 0.5, y: 0.8, w: 9, h: 0.8,
    fontSize: 36, bold: true, color: "FFFFFF",
    align: "center", fontFace: "Arial"
  });
  
  const bullets = presentationContent.conclusion.points.map(text => ({
    text,
    options: { bullet: { type: "bullet" as const, color: "FFFFFF" }, indentLevel: 0 }
  }));
  
  slide.addText(bullets, {
    x: 1, y: 2, w: 8, h: 3.5,
    fontSize: 18, color: "FFFFFF",
    fontFace: "Arial", valign: "top",
    paraSpaceAfter: 14
  });
}

function addReferencesSlide(pptx: PptxGenJS) {
  const slide = pptx.addSlide();
  
  // Header bar
  slide.addShape("rect", {
    x: 0, y: 0, w: "100%", h: 1.2,
    fill: { color: colors.primary }
  });
  
  slide.addText(presentationContent.references.title, {
    x: 0.5, y: 0.3, w: 9, h: 0.7,
    fontSize: fonts.heading.size, bold: true, color: "FFFFFF",
    fontFace: fonts.heading.face
  });
  
  const refs = presentationContent.references.items.map((text, i) => ({
    text: `${i + 1}. ${text}`,
    options: { indentLevel: 0 }
  }));
  
  slide.addText(refs, {
    x: 0.5, y: 1.5, w: 9, h: 4,
    fontSize: 16, color: colors.text,
    fontFace: "Arial", valign: "top",
    paraSpaceAfter: 12
  });
}

function addThankYouSlide(pptx: PptxGenJS) {
  const slide = pptx.addSlide();
  
  // Background
  slide.addShape("rect", {
    x: 0, y: 0, w: "100%", h: "100%",
    fill: { color: colors.secondary }
  });
  
  slide.addText("Thank You!", {
    x: 0, y: 2, w: "100%", h: 1.5,
    fontSize: 54, bold: true, color: "FFFFFF",
    align: "center", fontFace: "Arial"
  });
  
  slide.addText("Questions & Discussion", {
    x: 0, y: 3.5, w: "100%", h: 0.8,
    fontSize: 24, color: "FFFFFF",
    align: "center", fontFace: "Arial", transparency: 30
  });
}

export function generateProjectPPT(): void {
  const pptx = new PptxGenJS();
  
  // Set presentation properties
  pptx.author = "Autonomous Research Assistant";
  pptx.title = "Autonomous Research Assistant - System Design";
  pptx.subject = "AI-powered Paper Discovery, Summarization & Citation Generation";
  pptx.company = "Research Project";
  
  // Slide 1: Title
  addTitleSlide(pptx);
  
  // Slide 2: Problem Statement
  addContentSlide(pptx, presentationContent.problemStatement.title, presentationContent.problemStatement.points);
  
  // Slide 3: Proposed Solution
  addContentSlide(pptx, presentationContent.proposedSolution.title, presentationContent.proposedSolution.points);
  
  // Slide 4: System Architecture
  addArchitectureSlide(pptx);
  
  // Slide 5: Technology Stack
  addTableSlide(
    pptx,
    presentationContent.techStack.title,
    ["Category", "Technology"],
    presentationContent.techStack.items.map(item => [item.category, item.technology])
  );
  
  // Slide 6: Database Schema
  addDatabaseSlide(pptx);
  
  // Slide 7: Data Flow
  addContentSlide(pptx, presentationContent.dataFlow.title, presentationContent.dataFlow.steps);
  
  // Slide 8: Key Features
  addFeaturesSlide(pptx);
  
  // Slide 9: AI Pipeline
  addAIPipelineSlide(pptx);
  
  // Slide 10: ML Dataset & Preprocessing
  addContentSlide(pptx, presentationContent.mlDataset.title, presentationContent.mlDataset.points);
  
  // Slide 11: ML Model Training & Results
  addTableSlide(
    pptx,
    presentationContent.mlTraining.title,
    ["Model", "Cross-Val Accuracy", "Test Accuracy"],
    presentationContent.mlTraining.models.map(m => [m.name, m.crossVal, m.testAcc])
  );
  
  // Slide 12: Per-Class F1 Scores
  addTableSlide(
    pptx,
    "Per-Class Performance (Best Model: 96.3%)",
    ["Domain", "F1-Score"],
    presentationContent.mlTraining.perClass.map(c => [c.domain, c.f1])
  );
  
  // Slide 13: Security
  addContentSlide(pptx, presentationContent.security.title, presentationContent.security.measures);
  
  // Slide 14: Testing
  addTwoColumnSlide(
    pptx,
    presentationContent.testing.title,
    presentationContent.testing.categories[0].type,
    presentationContent.testing.categories[0].items,
    presentationContent.testing.categories[1].type,
    presentationContent.testing.categories[1].items
  );
  
  // Slide 15: Timeline
  addTimelineSlide(pptx);
  
  // Slide 16: Future Enhancements
  addContentSlide(pptx, presentationContent.futureEnhancements.title, presentationContent.futureEnhancements.items);
  
  // Slide 17: Conclusion
  addConclusionSlide(pptx);
  
  // Slide 18: References
  addReferencesSlide(pptx);
  
  // Slide 19: Thank You
  addThankYouSlide(pptx);
  
  // Save the file
  pptx.writeFile({ fileName: "Autonomous_Research_Assistant_Presentation.pptx" });
}
