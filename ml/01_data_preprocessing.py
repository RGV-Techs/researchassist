"""
=============================================================
  Autonomous Research Assistant - Data Preprocessing
  Step 1: Load arXiv dataset, clean, and prepare for training
=============================================================
  Dataset: Cornell University arXiv Papers (Kaggle)
  Authors: Gnaneshwar Reddy D, Yedukondalu Reddy D
  Dept: CSE, Vignan's Foundation for Science, Technology & Research
=============================================================
"""

import json
import os
import re
import pandas as pd
import numpy as np
from collections import Counter
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer

# Download NLTK data
nltk.download('punkt', quiet=True)
nltk.download('punkt_tab', quiet=True)
nltk.download('stopwords', quiet=True)
nltk.download('wordnet', quiet=True)

# -----------------------------------------------
# 1. LOAD DATASET
# -----------------------------------------------
print("=" * 60)
print("STEP 1: Loading arXiv Dataset")
print("=" * 60)

# Download dataset from Kaggle
try:
    import kagglehub
    path = kagglehub.dataset_download("Cornell-University/arxiv")
    DATA_FILE = os.path.join(path, "arxiv-metadata-oai-snapshot.json")
    print(f"Dataset downloaded to: {path}")
except Exception as e:
    print(f"Kaggle download failed: {e}")
    print("Please download manually from: https://www.kaggle.com/datasets/Cornell-University/arxiv")
    print("Place the JSON file as: ml/data/arxiv-metadata-oai-snapshot.json")
    DATA_FILE = "ml/data/arxiv-metadata-oai-snapshot.json"

# Target categories for classification
TARGET_CATEGORIES = {
    'cs.AI': 'Artificial Intelligence',
    'cs.CL': 'Natural Language Processing',
    'cs.CV': 'Computer Vision',
    'cs.LG': 'Machine Learning',
    'stat.ML': 'Statistical ML',
    'physics.comp-ph': 'Computational Physics'
}

SAMPLES_PER_CATEGORY = 2000

print(f"\nTarget categories: {list(TARGET_CATEGORIES.keys())}")
print(f"Samples per category: {SAMPLES_PER_CATEGORY}")

# -----------------------------------------------
# 2. EXTRACT RELEVANT PAPERS
# -----------------------------------------------
print("\n" + "=" * 60)
print("STEP 2: Extracting Relevant Papers")
print("=" * 60)

papers = []
category_counts = Counter()

if os.path.exists(DATA_FILE):
    with open(DATA_FILE, 'r') as f:
        for line in f:
            if all(count >= SAMPLES_PER_CATEGORY for count in category_counts.values()) and len(category_counts) == len(TARGET_CATEGORIES):
                break
            
            try:
                paper = json.loads(line)
                categories = paper.get('categories', '').split()
                
                for cat in categories:
                    if cat in TARGET_CATEGORIES and category_counts[cat] < SAMPLES_PER_CATEGORY:
                        papers.append({
                            'title': paper.get('title', '').replace('\n', ' '),
                            'abstract': paper.get('abstract', '').replace('\n', ' '),
                            'category': cat,
                            'category_name': TARGET_CATEGORIES[cat]
                        })
                        category_counts[cat] += 1
                        break
            except json.JSONDecodeError:
                continue

    print(f"Total papers extracted: {len(papers)}")
    for cat, count in category_counts.items():
        print(f"  {cat} ({TARGET_CATEGORIES[cat]}): {count}")
else:
    # Generate synthetic sample data for demonstration
    print("Dataset file not found. Generating sample data for demonstration...")
    np.random.seed(42)
    
    sample_abstracts = {
        'cs.AI': [
            "This paper presents a novel approach to artificial intelligence using reinforcement learning agents that can adapt to dynamic environments. We propose a multi-agent system architecture.",
            "We introduce an intelligent decision support system based on knowledge graphs and ontological reasoning for automated planning and scheduling in complex domains.",
        ],
        'cs.CL': [
            "We propose a transformer-based model for natural language understanding that achieves state-of-the-art results on multiple benchmark datasets including GLUE and SuperGLUE.",
            "This work addresses the challenge of cross-lingual transfer learning for low-resource languages using multilingual pre-trained language models.",
        ],
        'cs.CV': [
            "A deep convolutional neural network architecture is proposed for real-time object detection in autonomous driving scenarios with improved accuracy and reduced latency.",
            "We present a novel image segmentation approach using attention mechanisms and feature pyramid networks for medical image analysis.",
        ],
        'cs.LG': [
            "This paper introduces a new gradient-based optimization algorithm for training deep neural networks that converges faster than Adam and SGD on standard benchmarks.",
            "We study the generalization properties of overparameterized neural networks and provide theoretical bounds on the test error using PAC-Bayes framework.",
        ],
        'stat.ML': [
            "A Bayesian nonparametric approach to clustering is proposed using Dirichlet process mixtures with applications to density estimation and anomaly detection.",
            "We develop a new kernel method for high-dimensional regression that exploits sparsity structures in the data using random Fourier features.",
        ],
        'physics.comp-ph': [
            "Molecular dynamics simulations of protein folding are accelerated using graph neural networks to predict interatomic forces with ab initio accuracy.",
            "A finite element method with adaptive mesh refinement is developed for solving the Schrodinger equation in complex quantum mechanical systems.",
        ]
    }
    
    for cat, abstracts in sample_abstracts.items():
        for i in range(SAMPLES_PER_CATEGORY):
            base = abstracts[i % len(abstracts)]
            papers.append({
                'title': f"Research Paper {i+1} in {TARGET_CATEGORIES[cat]}",
                'abstract': base + f" Variation {i} with additional experimental results and analysis.",
                'category': cat,
                'category_name': TARGET_CATEGORIES[cat]
            })
        category_counts[cat] = SAMPLES_PER_CATEGORY

    print(f"Generated {len(papers)} sample papers")

df = pd.DataFrame(papers)

# -----------------------------------------------
# 3. TEXT PREPROCESSING
# -----------------------------------------------
print("\n" + "=" * 60)
print("STEP 3: Text Preprocessing")
print("=" * 60)

stop_words = set(stopwords.words('english'))
lemmatizer = WordNetLemmatizer()

def preprocess_text(text):
    """Clean and preprocess text for ML training."""
    # Lowercase
    text = text.lower()
    # Remove special characters and numbers
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    # Tokenize
    tokens = word_tokenize(text)
    # Remove stopwords and lemmatize
    tokens = [lemmatizer.lemmatize(t) for t in tokens if t not in stop_words and len(t) > 2]
    return ' '.join(tokens)

print("Preprocessing abstracts...")
df['cleaned_abstract'] = df['abstract'].apply(preprocess_text)
df['cleaned_title'] = df['title'].apply(preprocess_text)
df['text'] = df['cleaned_title'] + ' ' + df['cleaned_abstract']

# Encode labels
from sklearn.preprocessing import LabelEncoder
le = LabelEncoder()
df['label'] = le.fit_transform(df['category'])

print(f"\nPreprocessing complete!")
print(f"  Total samples: {len(df)}")
print(f"  Unique categories: {df['category'].nunique()}")
print(f"  Avg abstract length (words): {df['cleaned_abstract'].str.split().str.len().mean():.0f}")
print(f"  Label mapping: {dict(zip(le.classes_, le.transform(le.classes_)))}")

# -----------------------------------------------
# 4. SAVE PREPROCESSED DATA
# -----------------------------------------------
print("\n" + "=" * 60)
print("STEP 4: Saving Preprocessed Data")
print("=" * 60)

os.makedirs('ml/data', exist_ok=True)
df.to_csv('ml/data/preprocessed_papers.csv', index=False)
np.save('ml/data/label_classes.npy', le.classes_)

print(f"Saved preprocessed data to ml/data/preprocessed_papers.csv")
print(f"Saved label classes to ml/data/label_classes.npy")

# Show sample
print("\n--- Sample Preprocessed Record ---")
sample = df.iloc[0]
print(f"Category: {sample['category_name']}")
print(f"Original: {sample['abstract'][:150]}...")
print(f"Cleaned:  {sample['cleaned_abstract'][:150]}...")

print("\n✅ Data preprocessing complete! Run 02_model_training.py next.")
