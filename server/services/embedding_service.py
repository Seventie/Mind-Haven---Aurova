from flask import Flask, request, jsonify
from flask_cors import CORS
from sentence_transformers import SentenceTransformer
import numpy as np
import os

app = Flask(__name__)
CORS(app)

# Load lightweight model (downloads ~90MB on first run)
print("Loading sentence-transformer model: all-MiniLM-L6-v2...")
model = SentenceTransformer('all-MiniLM-L6-v2')

@app.route('/embed', methods=['POST'])
def embed():
    try:
        data = request.json
        text = data.get('text', '')
        
        if not text:
            return jsonify({'error': 'Text is required'}), 400
        
        # Generate embedding
        embedding = model.encode(text)
        
        # Convert to list for JSON serialization
        embedding_list = embedding.tolist()
        
        return jsonify({
            'embedding': embedding_list,
            'dimension': len(embedding_list)
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'model': 'all-MiniLM-L6-v2'})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    print(f"🚀 Embedding service starting on port {port}...")
    print("📦 Model: all-MiniLM-L6-v2 (384 dimensions)")
    app.run(host='0.0.0.0', port=port, debug=False)
