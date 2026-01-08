import pandas as pd
import numpy as np
import joblib
import matplotlib as plt
import seaborn as sns
from sklearn.metrics import confusion_matrix
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report, mean_squared_error , mean_absolute_error
from sklearn.preprocessing import LabelEncoder
import xgboost as xgb  
from preprocess import clean_text, create_vectorizer

print("1. Loading Dataset...")
try:
    file_path = 'dataset/problems.csv'
    try:
        data = pd.read_csv(file_path)
    except FileNotFoundError:
        data = pd.read_csv('problems.csv')
except FileNotFoundError:
    print("problems.csv not found.")
    exit()

print(data['problem_class'].value_counts())
print("-" * 30)

data = data.fillna("")
data['full_text'] = (
    data['description'].astype(str) + " " + 
    data['input_description'].astype(str) + " " + 
    data['output_description'].astype(str)
)
data['full_text'] = data['full_text'].apply(clean_text)
data['problem_score'] = pd.to_numeric(data['problem_score'], errors='coerce').fillna(1000)

label_encoder = LabelEncoder()
y_class_encoded = label_encoder.fit_transform(data['problem_class'])

data['problem_class_enc'] = label_encoder.fit_transform(data['problem_class'])


vectorizer = create_vectorizer()
X = vectorizer.fit_transform(data['full_text'])

y_class = data['problem_class_enc']
y_score = data['problem_score']

X_train, X_test, y_class_train, y_class_test, y_score_train, y_score_test = train_test_split(
    X, y_class_encoded, data['problem_score'], test_size=0.2, random_state=42
)

print("2. Training XGBoost Classifier...")
clf_model = xgb.XGBClassifier(
    n_estimators=200,
    learning_rate=0.05,   
    max_depth=6,           
    use_label_encoder=False,
    eval_metric='mlogloss',
    random_state=42
)
clf_model.fit(X_train, y_class_train)

class_preds = clf_model.predict(X_test)
acc = accuracy_score(y_class_test, class_preds)
print(f"   Accuracy: {acc * 100:.2f}%")
print("\n   Detailed Report:")
target_names = label_encoder.inverse_transform(sorted(list(set(y_class_test))))
print(classification_report(y_class_test, class_preds, target_names=target_names))

print("3. Training XGBoost Regressor...")
reg_model = xgb.XGBRegressor(
    n_estimators=200,
    learning_rate=0.05,
    max_depth=6,
    random_state=42
)
reg_model.fit(X_train, y_score_train)

score_preds = reg_model.predict(X_test)
rmse = np.sqrt(mean_squared_error(y_score_test, score_preds))
mae = mean_absolute_error(y_score_test, score_preds)

print(f"   ✅ RMSE: {rmse:.2f}/10")
print(f"   ✅ MAE:  {mae:.2f}/10")

y_pred_class = clf_model.predict(X_test)

cm = confusion_matrix(y_class_test, y_pred_class, labels=[0, 1, 2])

print("Confusion Matrix (Text):")
print(cm)

plt.figure(figsize=(8, 6))
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', 
            xticklabels=['Easy', 'Medium', 'Hard'], 
            yticklabels=['Easy', 'Medium', 'Hard'])

plt.xlabel('Predicted Label')
plt.ylabel('Actual Label')
plt.title('Confusion Matrix for Problem Difficulty')

plt.savefig('confusion_matrix.png')
print("Confusion matrix image saved as 'confusion_matrix.png'")

print("4. Saving Models...")
joblib.dump(vectorizer, 'vectorizer.pkl')
joblib.dump(clf_model, 'model_classifier.pkl')
joblib.dump(reg_model, 'model_regressor.pkl')
joblib.dump(label_encoder, 'label_encoder.pkl') 
print("XGBoost Models Saved!")