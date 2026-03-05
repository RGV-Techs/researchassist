# Dataset Information

## Dataset: arXiv Paper Abstracts (Kaggle)

- **Source**: https://www.kaggle.com/datasets/Cornell-University/arxiv
- **Size**: ~1.7M+ research papers
- **Format**: JSON (one record per line)
- **Fields Used**: title, abstract, categories
- **License**: CC0 (Public Domain)

## Subset Used for Training

We sampled **10,000 papers** across **6 research domains**:

| Label | Category Code | Domain |
|-------|--------------|--------|
| 0 | cs.AI | Artificial Intelligence |
| 1 | cs.CL | Computation & Language (NLP) |
| 2 | cs.CV | Computer Vision |
| 3 | cs.LG | Machine Learning |
| 4 | stat.ML | Statistical ML |
| 5 | physics.comp-ph | Computational Physics |

## Purpose

Train a text classifier that automatically categorizes research papers into domains based on their abstracts — a core component of the Autonomous Research Assistant's classification module.
