1. Project Overview

AutoJudge: Predicting Programming Problem Difficulty. This project is an intelligent system that automatically predicts the difficulty of a programming problem based solely on its text description. Problem: Currently, classifying problems (on sites like Codeforces) relies on human judgment. The project automates this using Statistical Natural Language Processing (NLP) and ML Model Training.

2. Dataset Used

Source: We are using a dataset (problems_data.json) which is then converted into problems.csv dataset suggested to use in the document.
Data Fields:

Input Features (Text): description, input_description, output_description, title.

Target Labels:
problem_class: Categorical (Easy, Medium, Hard).
problem_score: Numerical (e.g., 4,6,8,...).

3. Approach & Model Used
This project treats the problem as both a Classification and a Regression task.

Step 1: Data Preprocessing 

Text Cleaning: We cleaned HTML tags and special characters but explicitly preserve mathematical symbols (e.g., ^, <, +) because they are vital for understanding coding problems.

Feature Engineering: We combined description + input_description + output_description into a single text block (full_text) to capture the full context.The processing of numerical and categorical data, including scaling the problem_score and applying LabelEncoder to the problem_class column.

Step 2: Feature Extraction

TF-IDF Vectorizer: We converted the text into numerical vectors.

Settings: We used ngram_range=(1, 2) (to capture phrases) and max_features=5000 (to keep the model fast) as seen in my code.

Step 3: Models

I earlier tried various other models like Random Forest, Support Vector Machine(SVM) , Logistic Regression but all of them gave the accuracy around 50% only

Classification Model: XGBoost Classifier (as seen in train_models.py). This predicts whether a problem is Easy, Medium, or Hard.

Regression Model: XGBoost Regressor (implied by model_regressor.pkl). This predicts the specific difficulty score.

4. Evaluation Metrics
Classification:

Accuracy: To measure overall correctness which came upto 54.19%.

Log Loss (mlogloss): Used in the XGBoost training to measure how confident the model is in its predictions.

Regression:

MAE / RMSE: Mean Absolute Error or Root Mean Squared Error to see how close the predicted score is to the real score.

RMSE :- 2.05/10
MAE :- 1.69/10

5. Steps to Run Project Locally
Based on your file structure (backend/, frontend/):

Backend (Python/Flask):

Navigate to the backend folder.

Install dependencies: pip install flask scikit-learn xgboost pandas joblib.

Run the server: python server.py. (starts on port 5000)

Frontend (React/Next.js):

Navigate to the frontend (or dash) folder.

Install dependencies: npm install.

Start the development server: npm run dev. (starts on port 3000).

Usage: Open your browser to localhost:3000, paste a problem description, and click "Predict".

6. Explanation of Web Interface

The Web UI is designed to be simple and user-friendly, requiring no login or database.
Its build on Nextjs and tailwindcss for fast responsive and dynamic changes.
The User enters the problem description including inputs and outputs and when clicks on the predict button he will get the problem difficulty out of (Easy/Medium/Hard), problem score out of 10 in which lower score denotes problem is on easier side and highes denotes that problem is on tougher side.Also added the feature of getting estimated codeforces rating range of a problem.

Action: A "Predict" button that sends this text to Flask API.

Output Section: Displays the results returned by the model:

Predicted Class: e.g., "Medium"
Predicted Score: e.g., "5/10"
Estimated Codeforces Rating Range : e.g., "1200-1399"