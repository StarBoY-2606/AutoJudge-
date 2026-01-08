from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
from preprocess import clean_text

app = Flask(__name__)
CORS(app)

print("Loading models")
try:
    vectorizer = joblib.load('vectorizer.pkl')
    clf_model = joblib.load('model_classifier.pkl')
    reg_model = joblib.load('model_regressor.pkl')
    label_encoder = joblib.load('label_encoder.pkl') 
    print("Models loaded successfully!")
except Exception as e:
    print(f"Error loading models: {e}")

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        raw_text = data.get('description', "")

        if not raw_text.strip():
            return jsonify({'error': 'Problem description cannot be empty'}), 400

        cleaned_text = clean_text(raw_text)
        vectorized_text = vectorizer.transform([cleaned_text])

        prediction_index = clf_model.predict(vectorized_text)[0]
        prediction_class = label_encoder.inverse_transform([prediction_index])[0]

        prediction_score = float(reg_model.predict(vectorized_text)[0])
        prediction_score  = max(1.0, min(10.0, prediction_score ))
        
        if prediction_class in ["Medium", "Hard" , "medium" , "hard"]:
            prediction_score = prediction_score + 2

        estimated_rating = int(( prediction_score * 200) + 400)

        return jsonify({
            'problem_class': prediction_class,
            'problem_score': (prediction_score),
             'estimated_rating': estimated_rating
        })

    except Exception as e:
        print(f"Error during prediction: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)