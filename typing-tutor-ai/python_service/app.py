from flask import Flask, request, jsonify
import random

app = Flask(__name__)

# Basic dictionary for generation
dictionary = [
    "algorithm", "binary", "compiler", "database", "encryption", "function", 
    "gateway", "hardware", "internet", "java", "kernel", "latency", "memory", 
    "network", "object", "processor", "query", "router", "system", "terminal", 
    "user", "virtual", "wifi", "xml", "yaml", "zip", "python", "stack", "monitor",
    "keyboard", "mouse", "screen", "code", "debug", "compile", "execute"
]


@app.route('/', methods=['GET'])
def health_check():
    return jsonify({"status": "ok", "service": "python-ai-service"})

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.json
    # data expected: { "sessions": [ { "errorKeys": "a,b" }, ... ] }
    sessions = data.get('sessions', [])
    
    error_counts = {}
    for session in sessions:
        keys = session.get('errorKeys', "")
        if keys:
            for key in keys.split(','):
                if key:
                    error_counts[key] = error_counts.get(key, 0) + 1
    
    # Return top 3 weak keys
    sorted_keys = sorted(error_counts.items(), key=lambda item: item[1], reverse=True)
    weak_keys = [k for k, v in sorted_keys[:3]]
    
    return jsonify({"weakKeys": weak_keys})

@app.route('/generate', methods=['POST'])
def generate():
    data = request.json
    weak_keys = data.get('weakKeys', [])
    length_param = data.get('length', 'medium') # short, medium, long
    
    # Filter dictionary for words containing weak keys
    weighted_words = []
    if weak_keys:
        for word in dictionary:
            for key in weak_keys:
                if key in word:
                    weighted_words.append(word)
                    break
    
    # Determine word count based on length param
    word_count = 50 # Default medium
    if length_param == 'short':
        word_count = 20
    elif length_param == 'long':
        word_count = 100
        
    # Generate text
    generated_text = []
    
    for _ in range(word_count):
        if weighted_words and random.random() < 0.7:  # 70% chance to pick hard word
            generated_text.append(random.choice(weighted_words))
        else:
            generated_text.append(random.choice(dictionary))
            
    # Capitalize first letter and ensure basic sentence structure
    text = " ".join(generated_text)
    return jsonify({"text": text})

if __name__ == '__main__':
    app.run(port=5000)
