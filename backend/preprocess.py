import re
from sklearn.feature_extraction.text import TfidfVectorizer

def clean_text(text):

    text = str(text).lower()
    text = re.sub(r'<[^>]+>', '', text)  
    text = re.sub(r'[^a-zA-Z0-9\s\^\<\=\-\+\*]', '', text) 
    return text

def create_vectorizer():
   
    return TfidfVectorizer(
        stop_words='english',
        max_features=5000,
        ngram_range=(1, 2),
        min_df=2
    )