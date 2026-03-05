"""
=============================================================
  Autonomous Research Assistant - Model Training
  Step 2: Train text classification models on arXiv papers
=============================================================
  Dataset: Cornell University arXiv Papers (Kaggle)
  Authors: Gnaneshwar Reddy D, Yedukondalu Reddy D
  Dept: CSE, Vignan's Foundation for Science, Technology & Research
=============================================================
"""

import os
import pandas as pd
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.naive_bayes import MultinomialNB
from sklearn.svm import LinearSVC
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    classification_report, confusion_matrix, 
    accuracy_score, f1_score, precision_score, recall_score
)
import pickle
import warnings
warnings.filterwarnings('ignore')

# -----------------------------------------------
# 1. LOAD PREPROCESSED DATA
# -----------------------------------------------
print("=" * 60)
print("STEP 1: Loading Preprocessed Data")
print("=" * 60)

df = pd.read_csv('ml/data/preprocessed_papers.csv')
label_classes = np.load('ml/data/label_classes.npy', allow_pickle=True)

print(f"Loaded {len(df)} samples")
print(f"Categories: {list(label_classes)}")
print(f"\nClass distribution:")
for cat in label_classes:
    count = len(df[df['category'] == cat])
    print(f"  {cat}: {count} samples ({count/len(df)*100:.1f}%)")

# -----------------------------------------------
# 2. FEATURE EXTRACTION (TF-IDF)
# -----------------------------------------------
print("\n" + "=" * 60)
print("STEP 2: TF-IDF Feature Extraction")
print("=" * 60)

X = df['text'].fillna('')
y = df['label']

# Split data: 80% train, 20% test
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

print(f"Training samples: {len(X_train)}")
print(f"Testing samples:  {len(X_test)}")

# TF-IDF Vectorization
tfidf = TfidfVectorizer(
    max_features=10000,
    ngram_range=(1, 2),   # unigrams + bigrams
    min_df=2,
    max_df=0.95,
    sublinear_tf=True
)

X_train_tfidf = tfidf.fit_transform(X_train)
X_test_tfidf = tfidf.transform(X_test)

print(f"TF-IDF feature matrix shape: {X_train_tfidf.shape}")
print(f"Vocabulary size: {len(tfidf.vocabulary_)}")

# Show top features
feature_names = tfidf.get_feature_names_out()
print(f"\nTop 20 TF-IDF features: {list(feature_names[:20])}")

# -----------------------------------------------
# 3. MODEL TRAINING & COMPARISON
# -----------------------------------------------
print("\n" + "=" * 60)
print("STEP 3: Training Multiple Models")
print("=" * 60)

models = {
    'Logistic Regression': LogisticRegression(max_iter=1000, C=1.0, random_state=42),
    'Multinomial Naive Bayes': MultinomialNB(alpha=0.1),
    'Linear SVM': LinearSVC(max_iter=2000, C=1.0, random_state=42),
    'Random Forest': RandomForestClassifier(n_estimators=200, max_depth=50, random_state=42, n_jobs=-1)
}

results = {}
best_model = None
best_accuracy = 0

for name, model in models.items():
    print(f"\n--- Training: {name} ---")
    model.fit(X_train_tfidf, y_train)
    y_pred = model.predict(X_test_tfidf)
    
    acc = accuracy_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred, average='weighted')
    prec = precision_score(y_test, y_pred, average='weighted')
    rec = recall_score(y_test, y_pred, average='weighted')
    
    results[name] = {
        'accuracy': acc,
        'f1_score': f1,
        'precision': prec,
        'recall': rec,
        'predictions': y_pred
    }
    
    print(f"  Accuracy:  {acc:.4f}")
    print(f"  F1 Score:  {f1:.4f}")
    print(f"  Precision: {prec:.4f}")
    print(f"  Recall:    {rec:.4f}")
    
    if acc > best_accuracy:
        best_accuracy = acc
        best_model = name

print(f"\n🏆 Best Model: {best_model} (Accuracy: {best_accuracy:.4f})")

# -----------------------------------------------
# 4. DETAILED CLASSIFICATION REPORT (Best Model)
# -----------------------------------------------
print("\n" + "=" * 60)
print(f"STEP 4: Detailed Report - {best_model}")
print("=" * 60)

category_names = [f"{c}" for c in label_classes]
y_pred_best = results[best_model]['predictions']

print("\nClassification Report:")
print(classification_report(y_test, y_pred_best, target_names=category_names))

# -----------------------------------------------
# 5. VISUALIZATIONS
# -----------------------------------------------
print("\n" + "=" * 60)
print("STEP 5: Generating Visualizations")
print("=" * 60)

os.makedirs('ml/outputs', exist_ok=True)

# 5a. Model Comparison Bar Chart
fig, ax = plt.subplots(figsize=(10, 6))
model_names = list(results.keys())
accuracies = [results[m]['accuracy'] for m in model_names]
f1_scores = [results[m]['f1_score'] for m in model_names]

x = np.arange(len(model_names))
width = 0.35

bars1 = ax.bar(x - width/2, accuracies, width, label='Accuracy', color='#6366F1')
bars2 = ax.bar(x + width/2, f1_scores, width, label='F1 Score', color='#10B981')

ax.set_xlabel('Model', fontsize=12)
ax.set_ylabel('Score', fontsize=12)
ax.set_title('Model Comparison - Research Paper Classification', fontsize=14, fontweight='bold')
ax.set_xticks(x)
ax.set_xticklabels(model_names, rotation=15, ha='right')
ax.legend()
ax.set_ylim(0, 1.1)

for bar in bars1:
    ax.annotate(f'{bar.get_height():.3f}', xy=(bar.get_x() + bar.get_width()/2, bar.get_height()),
                xytext=(0, 3), textcoords="offset points", ha='center', fontsize=9)
for bar in bars2:
    ax.annotate(f'{bar.get_height():.3f}', xy=(bar.get_x() + bar.get_width()/2, bar.get_height()),
                xytext=(0, 3), textcoords="offset points", ha='center', fontsize=9)

plt.tight_layout()
plt.savefig('ml/outputs/model_comparison.png', dpi=150)
print("Saved: ml/outputs/model_comparison.png")

# 5b. Confusion Matrix
fig, ax = plt.subplots(figsize=(8, 7))
cm = confusion_matrix(y_test, y_pred_best)
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', 
            xticklabels=category_names, yticklabels=category_names, ax=ax)
ax.set_xlabel('Predicted Label', fontsize=12)
ax.set_ylabel('True Label', fontsize=12)
ax.set_title(f'Confusion Matrix - {best_model}', fontsize=14, fontweight='bold')
plt.xticks(rotation=45, ha='right')
plt.yticks(rotation=0)
plt.tight_layout()
plt.savefig('ml/outputs/confusion_matrix.png', dpi=150)
print("Saved: ml/outputs/confusion_matrix.png")

# 5c. Per-class accuracy
fig, ax = plt.subplots(figsize=(10, 6))
per_class_acc = cm.diagonal() / cm.sum(axis=1)
colors = ['#6366F1', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#3B82F6']
bars = ax.barh(category_names, per_class_acc, color=colors[:len(category_names)])
ax.set_xlabel('Accuracy', fontsize=12)
ax.set_title('Per-Category Classification Accuracy', fontsize=14, fontweight='bold')
ax.set_xlim(0, 1.1)

for bar, acc in zip(bars, per_class_acc):
    ax.text(bar.get_width() + 0.01, bar.get_y() + bar.get_height()/2,
            f'{acc:.3f}', va='center', fontsize=10)

plt.tight_layout()
plt.savefig('ml/outputs/per_class_accuracy.png', dpi=150)
print("Saved: ml/outputs/per_class_accuracy.png")

# -----------------------------------------------
# 6. SAVE BEST MODEL
# -----------------------------------------------
print("\n" + "=" * 60)
print("STEP 6: Saving Best Model")
print("=" * 60)

# Re-get the best model object
best_model_obj = models[best_model]

with open('ml/outputs/best_model.pkl', 'wb') as f:
    pickle.dump(best_model_obj, f)

with open('ml/outputs/tfidf_vectorizer.pkl', 'wb') as f:
    pickle.dump(tfidf, f)

# Save results summary
results_summary = pd.DataFrame({
    'Model': model_names,
    'Accuracy': [results[m]['accuracy'] for m in model_names],
    'F1 Score': [results[m]['f1_score'] for m in model_names],
    'Precision': [results[m]['precision'] for m in model_names],
    'Recall': [results[m]['recall'] for m in model_names]
}).sort_values('Accuracy', ascending=False)

results_summary.to_csv('ml/outputs/model_results.csv', index=False)

print(f"\nSaved: ml/outputs/best_model.pkl ({best_model})")
print(f"Saved: ml/outputs/tfidf_vectorizer.pkl")
print(f"Saved: ml/outputs/model_results.csv")

print("\n" + "=" * 60)
print("TRAINING SUMMARY")
print("=" * 60)
print(results_summary.to_string(index=False))

print(f"\n✅ Training complete! Best model: {best_model} ({best_accuracy:.4f} accuracy)")
print("Run 03_model_evaluation.py for detailed evaluation.")
