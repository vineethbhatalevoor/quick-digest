import requests
import os
from flask import Flask, request, jsonify
from flask_cors import CORS #Enable CORS to prevent browser blocks
from dotenv import load_dotenv  # ✅ Import dotenv to load API key

load_dotenv(dotenv_path=".env")  # ✅ Load variables from .env file

app = Flask(__name__)
CORS(app) #Allow frontend to talk to backend

@app.route('/')
def home():
    return jsonify({"message": "Welcome to the Groq-Powered News Summarizer!"})

@app.route('/summarize-text', methods=['POST'])
def summarize_text():
    data = request.json
    print("Received request data:",data) #Debugging step
    
    text = data.get('text')
    length = data.get('length', 100)  # Default max tokens
    
    #Now safetly load API key
    groq_api_key = os.getenv("GROQ_API_KEY")
    print("Groq API Key (Debugging):", groq_api_key)

    if not groq_api_key:
        return jsonify({"error": "API key is missing. Make sure it's set."}), 400
    
    if not text or text.strip() == "":
        return jsonify({"error":"No text provided for summarization."}), 400

    # Corrected Groq API request
    headers = {
        "Authorization": f"Bearer {groq_api_key}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "compound-beta",  # Use Groq's compound-beta model
        "messages": [{"role": "system", "content": "Summarize the following text"}, {"role": "user", "content": text}],
        "max_tokens": length
    }
    
    try:
        response = requests.post("https://api.groq.com/openai/v1/chat/completions",  # Corrected URL
        headers=headers, json=payload)
        response_data= response.json()
        
        #Debugging : Print API response for logging
        print("Groq API response:", response_data)

        if response.status_code == 200 and "choices" in response_data:
            summary=response_data["choices"][0]["message"]["content"]
            return jsonify({"summary":summary})  # Return cleaned JSON format
        else:
            return jsonify({"error": "Groq API failed.", "details": response_data}), response.status_code
    
    except requests.exceptions.RequestException as e:
        print("Error calling Groq API:", e)
        return jsonify({"error":f"API request failed: {str(e)}"}), 500    

if __name__ == '__main__':
    app.run(debug=True)