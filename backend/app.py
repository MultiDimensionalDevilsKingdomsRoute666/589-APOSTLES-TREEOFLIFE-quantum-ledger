from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
from ledger import DocumentLedger
import os
import json
import hashlib
import base64
from datetime import datetime
import io

app = Flask(__name__)
CORS(app)

# Initialize the ledger
ledger = DocumentLedger()

@app.route('/api/chain', methods=['GET'])
def get_chain():
    """Get the full document chain"""
    return jsonify({
        'chain': ledger.get_chain(),
        'length': len(ledger.chain)
    })

@app.route('/api/add', methods=['POST'])
def add_document():
    """Add a new document to the chain"""
    data = request.get_json()

    if not data or 'content' not in data:
        return jsonify({'error': 'No content provided'}), 400

    title = data.get('title', 'Untitled Document')
    content = data['content']
    file_hash = data.get('file_hash', None)
    file_name = data.get('file_name', None)
    file_size = data.get('file_size', None)

    block = ledger.add_document(title, content, file_hash, file_name, file_size)

    return jsonify({
        'message': 'Document added successfully',
        'block': block
    })

@app.route('/api/verify', methods=['GET'])
def verify_chain():
    """Verify the integrity of the entire chain"""
    results = ledger.verify_chain()
    return jsonify(results)

@app.route('/api/tamper/<int:block_index>', methods=['POST'])
def tamper_block(block_index):
    """Tamper with a block for demonstration purposes"""
    data = request.get_json()
    new_content = data.get('content', 'TAMPERED CONTENT')

    result = ledger.tamper_block(block_index, new_content)

    if result:
        return jsonify({'message': f'Block {block_index} has been tampered with'})
    else:
        return jsonify({'error': 'Invalid block index'}), 400

@app.route('/api/attack/delete/<int:block_index>', methods=['POST'])
def attack_delete(block_index):
    """Simulate deletion attack - remove a block from the chain"""
    if block_index <= 0 or block_index >= len(ledger.chain):
        return jsonify({'error': 'Cannot delete genesis block or invalid index'}), 400

    deleted_title = ledger.chain[block_index]['title']
    ledger.chain.pop(block_index)

    return jsonify({
        'message': f'Block {block_index} ("{deleted_title}") has been deleted',
        'attack_type': 'deletion',
        'explanation': 'The attacker removed a document from the chain. Verification will fail because the hash links are now broken.'
    })

@app.route('/api/attack/reorder', methods=['POST'])
def attack_reorder():
    """Simulate reordering attack - swap two blocks"""
    data = request.get_json()
    index1 = data.get('index1', 1)
    index2 = data.get('index2', 2)

    if index1 <= 0 or index2 <= 0:
        return jsonify({'error': 'Cannot reorder genesis block'}), 400
    if index1 >= len(ledger.chain) or index2 >= len(ledger.chain):
        return jsonify({'error': 'Invalid block indices'}), 400
    if index1 == index2:
        return jsonify({'error': 'Indices must be different'}), 400

    # Swap the blocks
    ledger.chain[index1], ledger.chain[index2] = ledger.chain[index2], ledger.chain[index1]

    return jsonify({
        'message': f'Blocks {index1} and {index2} have been swapped',
        'attack_type': 'reorder',
        'explanation': 'The attacker changed the order of documents. Verification will fail because each block stores which block should come before it.'
    })

@app.route('/api/attack/insert/<int:position>', methods=['POST'])
def attack_insert(position):
    """Simulate insertion attack - insert a fake block"""
    data = request.get_json()

    if position <= 0:
        return jsonify({'error': 'Cannot insert before genesis block'}), 400
    if position > len(ledger.chain):
        return jsonify({'error': 'Invalid position'}), 400

    # Create a fake block (without valid signature)
    fake_block = {
        'index': position,
        'timestamp': datetime.utcnow().isoformat(),
        'title': data.get('title', 'FAKE DOCUMENT'),
        'content': data.get('content', 'This document was inserted by an attacker!'),
        'content_hash': hashlib.sha256(data.get('content', 'This document was inserted by an attacker!').encode()).hexdigest(),
        'previous_hash': '0' * 64,  # Fake previous hash
        'signature': base64.b64encode(b'FAKE_SIGNATURE_' + os.urandom(32)).decode('utf-8'),
        'file_hash': None,
        'file_name': None,
        'file_size': None
    }

    # Insert the fake block
    ledger.chain.insert(position, fake_block)

    return jsonify({
        'message': f'Fake block inserted at position {position}',
        'attack_type': 'insertion',
        'explanation': 'The attacker inserted a fake document. Verification will fail because: 1) The signature is invalid, 2) The hash links are broken.'
    })

@app.route('/api/reset', methods=['POST'])
def reset_chain():
    """Reset the chain to initial state"""
    ledger.reset()
    return jsonify({'message': 'Chain has been reset'})

@app.route('/api/keys', methods=['GET'])
def get_key_info():
    """Get public key information"""
    return jsonify(ledger.get_key_info())

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'algorithm': 'ML-DSA-44 (Dilithium2)'})

@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Get chain statistics"""
    chain = ledger.get_chain()
    key_info = ledger.get_key_info()

    total_content_size = sum(len(block.get('content', '')) for block in chain)
    file_blocks = [b for b in chain if b.get('file_hash')]

    return jsonify({
        'total_blocks': len(chain),
        'total_documents': len(chain) - 1,  # Exclude genesis
        'total_content_size': total_content_size,
        'total_files': len(file_blocks),
        'algorithm': key_info['algorithm_name'],
        'nist_level': key_info['nist_level'],
        'quantum_safe': key_info['quantum_safe'],
        'public_key_size': key_info['public_key_size'],
        'signature_size': key_info['signature_size'],
        'mode': key_info.get('mode', 'Unknown'),
        'created_at': chain[0]['timestamp'] if chain else None,
        'last_block_at': chain[-1]['timestamp'] if chain else None
    })

@app.route('/api/export', methods=['GET'])
def export_chain():
    """Export the entire chain as JSON"""
    chain_data = {
        'exported_at': datetime.utcnow().isoformat(),
        'algorithm': 'ML-DSA-44 (Dilithium2)',
        'chain': ledger.get_chain(),
        'public_key': base64.b64encode(ledger.public_key).decode('utf-8')
    }

    return jsonify(chain_data)

@app.route('/api/export/download', methods=['GET'])
def download_chain():
    """Download chain as JSON file"""
    chain_data = {
        'exported_at': datetime.utcnow().isoformat(),
        'algorithm': 'ML-DSA-44 (Dilithium2)',
        'chain': ledger.get_chain(),
        'public_key': base64.b64encode(ledger.public_key).decode('utf-8')
    }

    json_str = json.dumps(chain_data, indent=2)
    buffer = io.BytesIO(json_str.encode())
    buffer.seek(0)

    filename = f"quantum_ledger_export_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}.json"

    return send_file(
        buffer,
        mimetype='application/json',
        as_attachment=True,
        download_name=filename
    )

@app.route('/api/import', methods=['POST'])
def import_chain():
    """Import a chain from JSON"""
    data = request.get_json()

    if not data or 'chain' not in data:
        return jsonify({'error': 'Invalid chain data'}), 400

    try:
        ledger.import_chain(data['chain'])
        return jsonify({
            'message': 'Chain imported successfully',
            'blocks_imported': len(data['chain'])
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/compare', methods=['GET'])
def compare_algorithms():
    """Compare RSA vs ML-DSA-44 for educational purposes"""
    return jsonify({
        'algorithms': [
            {
                'name': 'RSA-2048',
                'type': 'Classical',
                'quantum_safe': False,
                'public_key_size': 256,
                'signature_size': 256,
                'security_level': '112-bit classical',
                'quantum_vulnerability': 'Broken by Shor\'s algorithm in polynomial time',
                'math_problem': 'Integer Factorization',
                'status': 'Deprecated for post-quantum era'
            },
            {
                'name': 'ECDSA (P-256)',
                'type': 'Classical',
                'quantum_safe': False,
                'public_key_size': 64,
                'signature_size': 64,
                'security_level': '128-bit classical',
                'quantum_vulnerability': 'Broken by Shor\'s algorithm in polynomial time',
                'math_problem': 'Elliptic Curve Discrete Logarithm',
                'status': 'Deprecated for post-quantum era'
            },
            {
                'name': 'ML-DSA-44 (Dilithium2)',
                'type': 'Post-Quantum',
                'quantum_safe': True,
                'public_key_size': 1312,
                'signature_size': 2420,
                'security_level': 'NIST Level 2 (128-bit quantum)',
                'quantum_vulnerability': 'Resistant - no known quantum algorithm',
                'math_problem': 'Module Learning With Errors (M-LWE)',
                'status': 'NIST Standardized (FIPS 204, August 2024)'
            },
            {
                'name': 'ML-DSA-65 (Dilithium3)',
                'type': 'Post-Quantum',
                'quantum_safe': True,
                'public_key_size': 1952,
                'signature_size': 3293,
                'security_level': 'NIST Level 3 (192-bit quantum)',
                'quantum_vulnerability': 'Resistant - no known quantum algorithm',
                'math_problem': 'Module Learning With Errors (M-LWE)',
                'status': 'NIST Standardized (FIPS 204, August 2024)'
            },
            {
                'name': 'ML-DSA-87 (Dilithium5)',
                'type': 'Post-Quantum',
                'quantum_safe': True,
                'public_key_size': 2592,
                'signature_size': 4595,
                'security_level': 'NIST Level 5 (256-bit quantum)',
                'quantum_vulnerability': 'Resistant - no known quantum algorithm',
                'math_problem': 'Module Learning With Errors (M-LWE)',
                'status': 'NIST Standardized (FIPS 204, August 2024)'
            }
        ],
        'quantum_threat': {
            'title': 'The Quantum Threat',
            'description': 'Quantum computers using Shor\'s algorithm can break RSA and ECC in polynomial time. A sufficiently powerful quantum computer could forge digital signatures, compromising document integrity.',
            'timeline': 'Experts estimate cryptographically relevant quantum computers may exist within 10-15 years.',
            'solution': 'Post-quantum cryptography like ML-DSA uses mathematical problems (lattices) that are hard for both classical AND quantum computers.'
        }
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)
