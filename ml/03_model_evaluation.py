"""
=============================================================
  Autonomous Research Assistant - Model Evaluation & Testing
  Step 3: Evaluate trained model with test cases
=============================================================
  Authors: Gnaneshwar Reddy D, Yedukondalu Reddy D
  Dept: CSE, Vignan's Foundation for Science, Technology & Research
=============================================================
"""

import pickle
import numpy as np
import pandas as pd
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import (
    classification_report, confusion_matrix, 
    roc_curve, auc, precision_recall_curve
)
from sklearn.preprocessing import label_binarize

# -----------------------------------------------
# 1. LOAD MODEL AND DATA
# -----------------------------------------------
print("=" * 60)
print("MODEL EVALUATION & TESTING")
print("=" * 60)

with open('ml/outputs/best_model.pkl', 'rb') as f:
    model = pickle.load(f)

with open('ml/outputs/tfidf_vectorizer.pkl', 'rb') as f:
    tfidf = pickle.load(f)

label_classes = np.load('ml/data/label_classes.npy', allow_pickle=True)

print(f"Model loaded: {type(model).__name__}")
print(f"Categories: {list(label_classes)}")

# -----------------------------------------------
# 2. TEST WITH CUSTOM RESEARCH ABSTRACTS
# -----------------------------------------------
print("\n" + "=" * 60)
print("CUSTOM ABSTRACT CLASSIFICATION TEST")
print("=" * 60)

test_abstracts = [
    {
        "title": "Deep Reinforcement Learning for Robot Navigation",
        "abstract": "We present a deep reinforcement learning framework for autonomous robot navigation in unknown environments. Our approach uses a convolutional neural network to process raw sensor data and a policy gradient method to learn optimal navigation strategies. Experiments in simulated and real environments demonstrate that our agent learns to navigate efficiently while avoiding obstacles.",
        "expected": "cs.AI"
    },
    {
        "title": "BERT-based Sentiment Analysis for Social Media",
        "abstract": "This paper proposes a fine-tuned BERT model for sentiment analysis on social media text. We address challenges including informal language, abbreviations, and emoji usage. Our approach achieves state-of-the-art performance on the SemEval benchmark with an F1 score of 0.89, outperforming previous transformer-based approaches.",
        "expected": "cs.CL"
    },
    {
        "title": "Real-time Object Detection using YOLOv5",
        "abstract": "We introduce an optimized YOLOv5 architecture for real-time object detection in autonomous vehicles. Our modifications to the backbone network reduce inference time by 40% while maintaining detection accuracy. We validate our approach on the KITTI and nuScenes datasets, achieving mAP of 0.78 at 60 FPS.",
        "expected": "cs.CV"
    },
    {
        "title": "Federated Learning with Differential Privacy",
        "abstract": "This work proposes a federated learning framework that incorporates differential privacy guarantees. We develop a novel gradient perturbation mechanism that provides epsilon-delta privacy while maintaining model convergence. Our theoretical analysis shows that the privacy-utility tradeoff is near-optimal.",
        "expected": "cs.LG"
    },
    {
        "title": "Bayesian Optimization for Hyperparameter Tuning",
        "abstract": "We present a Gaussian process-based Bayesian optimization method for automatic hyperparameter tuning of machine learning models. Our approach uses an expected improvement acquisition function with a Matern kernel. Experiments on 50 benchmark datasets show consistent improvement over random search and grid search.",
        "expected": "stat.ML"
    },
    {
        "title": "Quantum Monte Carlo Simulation of Hydrogen",
        "abstract": "We perform diffusion Monte Carlo simulations of liquid hydrogen at high pressure using a newly developed pseudopotential. Our calculations predict the metallization pressure with chemical accuracy. The results are compared with density functional theory calculations and experimental measurements.",
        "expected": "physics.comp-ph"
    }
]

print(f"\nTesting {len(test_abstracts)} custom abstracts:\n")

correct = 0
for i, test in enumerate(test_abstracts):
    text_tfidf = tfidf.transform([test['abstract']])
    prediction = model.predict(text_tfidf)[0]
    predicted_cat = label_classes[prediction]
    is_correct = predicted_cat == test['expected']
    correct += int(is_correct)
    
    status = "✅" if is_correct else "❌"
    print(f"{status} Test {i+1}: {test['title']}")
    print(f"   Expected: {test['expected']} | Predicted: {predicted_cat}")
    print()

print(f"Custom Test Accuracy: {correct}/{len(test_abstracts)} ({correct/len(test_abstracts)*100:.0f}%)")

# -----------------------------------------------
# 3. FEATURE IMPORTANCE ANALYSIS
# -----------------------------------------------
print("\n" + "=" * 60)
print("TOP FEATURES PER CATEGORY")
print("=" * 60)

feature_names = tfidf.get_feature_names_out()

# For linear models, extract feature importance from coefficients
if hasattr(model, 'coef_'):
    for i, cat in enumerate(label_classes):
        if i < model.coef_.shape[0]:
            top_indices = model.coef_[i].argsort()[-10:][::-1]
            top_features = [feature_names[idx] for idx in top_indices]
            print(f"\n{cat}: {', '.join(top_features)}")
elif hasattr(model, 'feature_importances_'):
    top_indices = model.feature_importances_.argsort()[-20:][::-1]
    top_features = [feature_names[idx] for idx in top_indices]
    print(f"\nTop 20 features: {', '.join(top_features)}")

# -----------------------------------------------
# 4. GENERATE EVALUATION PLOTS
# -----------------------------------------------
print("\n" + "=" * 60)
print("GENERATING EVALUATION PLOTS")
print("=" * 60)

# Load test data for plotting
df = pd.read_csv('ml/data/preprocessed_papers.csv')
from sklearn.model_selection import train_test_split
X = df['text'].fillna('')
y = df['label']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
X_test_tfidf = tfidf.transform(X_test)
y_pred = model.predict(X_test_tfidf)

# Classification report as heatmap
report = classification_report(y_test, y_pred, target_names=label_classes, output_dict=True)
report_df = pd.DataFrame(report).transpose().iloc[:-3, :-1]  # Remove avg rows and support

fig, ax = plt.subplots(figsize=(8, 6))
sns.heatmap(report_df.astype(float), annot=True, fmt='.3f', cmap='YlOrRd',
            xticklabels=['Precision', 'Recall', 'F1-Score'], ax=ax)
ax.set_title('Classification Metrics per Category', fontsize=14, fontweight='bold')
ax.set_ylabel('Category')
plt.tight_layout()
plt.savefig('ml/outputs/classification_heatmap.png', dpi=150)
print("Saved: ml/outputs/classification_heatmap.png")

# Training data distribution
fig, axes = plt.subplots(1, 2, figsize=(14, 5))

# Category distribution
cat_counts = df['category'].value_counts()
axes[0].pie(cat_counts.values, labels=cat_counts.index, autopct='%1.1f%%',
            colors=['#6366F1', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#3B82F6'])
axes[0].set_title('Dataset Distribution by Category', fontsize=12, fontweight='bold')

# Abstract length distribution
df['word_count'] = df['text'].str.split().str.len()
axes[1].hist(df['word_count'], bins=50, color='#6366F1', alpha=0.7, edgecolor='white')
axes[1].set_xlabel('Word Count (after preprocessing)')
axes[1].set_ylabel('Number of Papers')
axes[1].set_title('Abstract Length Distribution', fontsize=12, fontweight='bold')

plt.tight_layout()
plt.savefig('ml/outputs/data_distribution.png', dpi=150)
print("Saved: ml/outputs/data_distribution.png")

# -----------------------------------------------
# 5. FINAL SUMMARY
# -----------------------------------------------
print("\n" + "=" * 60)
print("EVALUATION SUMMARY")
print("=" * 60)

results = pd.read_csv('ml/outputs/model_results.csv')
print("\nAll Model Results:")
print(results.to_string(index=False))

print(f"\n📊 Outputs saved to ml/outputs/:")
print(f"   - model_comparison.png")
print(f"   - confusion_matrix.png")
print(f"   - per_class_accuracy.png")
print(f"   - classification_heatmap.png")
print(f"   - data_distribution.png")
print(f"   - model_results.csv")
print(f"   - best_model.pkl")
print(f"   - tfidf_vectorizer.pkl")

print("\n✅ Evaluation complete! All artifacts ready for project review.")
