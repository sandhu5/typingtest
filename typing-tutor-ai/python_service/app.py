from flask import Flask, request, jsonify
import random

app = Flask(__name__)

# Extended Dictionaries
common_words = ["the", "be", "to", "of", "and", "a", "in", "that", "have", "it", "for", "not", "on", "with", "he", "as", "you", "do", "at", "this", "but", "his", "by", "from", "they", "we", "say", "her", "she", "or", "an", "will", "my", "one", "all", "would", "there", "their", "what", "so", "up", "out", "if", "about", "who", "get", "which", "go", "me", "when", "make", "can", "like", "time", "no", "just", "him", "know", "take", "people", "into", "year", "your", "good", "some", "could", "them", "see", "other", "than", "then", "now", "look", "only", "come", "its", "over", "think", "also", "back", "after", "use", "two", "how", "our", "work", "first", "well", "way", "even", "new", "want", "because", "any", "these", "give", "day", "most", "us"]
tech_words = ["algorithm", "binary", "compiler", "database", "encryption", "function", "gateway", "hardware", "interface", "kernel", "latency", "memory", "network", "object", "processor", "query", "router", "system", "terminal", "variable", "widget", "xml", "yaml", "zip", "python", "stack", "monitor", "keyboard", "mouse", "screen", "code", "debug", "compile", "execute", "asynchronous", "framework", "javascript", "middleware", "proprietary", "recursive", "syntax", "throughput", "virtualization", "api", "backend", "cloud", "deployment", "ethernet", "firmware", "gigabyte", "heuristic"]
long_words = ["acknowledgment", "characterization", "comprehensiveness", "counterproductive", "disproportionate", "enthusiastically", "indistinguishable", "misinterpretation", "oversimplification", "procrastination", "rationalization", "sophistication", "underestimated", "vulnerability", "xenotransplantation", "yesterday", "zealousness", "administration", "communication", "determination", "examination", "hallucination", "identification", "justification", "multiplication", "qualification", "rehabilitation", "stabilization", "transmission", "unquestionable"]
symbols = ["!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "-", "_", "+", "=", "{", "}", "[", "]", "|", "\\", ":", ";", "<", ">", "?", "/", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", ".", ",", "'", '"']

@app.route('/generate', methods=['POST'])
def generate():
    data = request.json
    weak_keys = data.get('weakKeys', [])
    # Mapping 'length' param to Difficulty: short=Easy, medium=Medium, long=Hard
    difficulty = data.get('length', 'medium') 
    
    word_pool = []
    symbol_rate = 0.0
    
    # Configuration based on difficulty
    if difficulty == 'short': # Easy
        word_pool = common_words[:50]
        word_count = 30
        symbol_rate = 0.0
    elif difficulty == 'long': # Hard
        word_pool = tech_words + long_words + common_words
        word_count = 60
        symbol_rate = 0.4 # Higher chance multiple tokens have punctuation
    else: # Medium
        word_pool = common_words + tech_words[:20] + long_words[:5]
        word_count = 40
        symbol_rate = 0.15 # Occasional punctuation

    # Filter for weak keys if present (boost priority)
    weighted_words = []
    if weak_keys:
        for word in word_pool:
            if any(k in word for k in weak_keys):
                weighted_words.append(word)
    
    generated_text = []
    
    for _ in range(word_count):
        word = ""
        # 40% chance to pick from weak key words if available
        if weighted_words and random.random() < 0.4:
            word = random.choice(weighted_words)
        else:
            word = random.choice(word_pool)
            
        # Add symbols/punctuation based on difficulty
        if random.random() < symbol_rate:
            sym = random.choice(symbols)
            # Prepend or append? Usually append for punctuation, but hard mode can be random
            if difficulty == 'long' and random.random() > 0.7:
                 word = sym + word # Prepend (e.g. (word)
            else:
                 word = word + sym # Append (e.g. word,)
            
        generated_text.append(word)
            
    # Join
    text = " ".join(generated_text)

    
    # Capitalize first letter
    if text:
        text = text[0].upper() + text[1:]
        
    return jsonify({"text": text})

if __name__ == '__main__':
    app.run(port=5000)
