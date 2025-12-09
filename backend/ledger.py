import hashlib
import json
from datetime import datetime
from typing import List, Dict, Any, Optional

# Try to import pqcrypto (dilithium), fallback to simulation if not available
try:
    from pqcrypto.sign.dilithium2 import generate_keypair, sign, verify
    USING_REAL_PQC = True
    print("Using real ML-DSA-44 (Dilithium2) cryptography")
except ImportError:
    USING_REAL_PQC = False
    print("Warning: pqcrypto not installed, using simulation mode")
    print("Install with: pip install pqcrypto")

import base64

class DilithiumSimulator:
    """
    Simulates ML-DSA-44 (Dilithium) signatures when real library is unavailable.
    Uses HMAC-SHA512 for demonstration purposes only.
    In production, always use real post-quantum cryptography.
    """
    def __init__(self):
        import secrets
        self.secret_key = secrets.token_bytes(64)
        self.public_key = hashlib.sha256(self.secret_key).digest()

    def sign(self, message: bytes) -> bytes:
        import hmac
        # Simulated signature using HMAC (NOT quantum-safe, for demo only)
        signature = hmac.new(self.secret_key, message, hashlib.sha512).digest()
        # Pad to simulate Dilithium signature size (~2420 bytes for level 2)
        return signature + b'\x00' * (2420 - len(signature))

    def verify(self, message: bytes, signature: bytes, public_key: bytes) -> bool:
        import hmac
        expected = hmac.new(self.secret_key, message, hashlib.sha512).digest()
        return hmac.compare_digest(signature[:64], expected)


class DocumentLedger:
    def __init__(self):
        self.chain: List[Dict[str, Any]] = []
        self.algorithm = "Dilithium2"  # ML-DSA-44 equivalent
        self.using_real_pqc = USING_REAL_PQC

        # Initialize ML-DSA-44 keys
        if USING_REAL_PQC:
            self.public_key, self.secret_key = generate_keypair()
        else:
            self._simulator = DilithiumSimulator()
            self.public_key = self._simulator.public_key
            self.secret_key = self._simulator.secret_key

        # Create genesis block
        self._create_genesis_block()

    def _sign_message(self, message: bytes) -> bytes:
        """Sign a message using ML-DSA-44"""
        if USING_REAL_PQC:
            return sign(self.secret_key, message)
        else:
            return self._simulator.sign(message)

    def _verify_signature(self, message: bytes, signature: bytes) -> bool:
        """Verify a signature using ML-DSA-44"""
        if USING_REAL_PQC:
            try:
                verify(self.public_key, message, signature)
                return True
            except:
                return False
        else:
            return self._simulator.verify(message, signature, self.public_key)

    def _create_genesis_block(self):
        """Create the first block in the chain"""
        genesis_content = 'This is the genesis block of the quantum-safe document ledger.'
        genesis_block = {
            'index': 0,
            'timestamp': datetime.utcnow().isoformat(),
            'title': 'Genesis Block',
            'content': genesis_content,
            'content_hash': self._hash_content(genesis_content),
            'previous_hash': '0' * 64,
            'signature': None,
            'file_hash': None,
            'file_name': None,
            'file_size': None
        }

        # Sign the genesis block
        block_data = self._get_block_data_for_signing(genesis_block)
        signature = self._sign_message(block_data.encode())
        genesis_block['signature'] = base64.b64encode(signature).decode('utf-8')

        self.chain.append(genesis_block)

    def _hash_content(self, content: str) -> str:
        """Create SHA-256 hash of content"""
        return hashlib.sha256(content.encode()).hexdigest()

    def _get_block_data_for_signing(self, block: Dict[str, Any]) -> str:
        """Get the block data string for signing (excludes signature)"""
        data = {
            'index': block['index'],
            'timestamp': block['timestamp'],
            'title': block['title'],
            'content_hash': block['content_hash'],
            'previous_hash': block['previous_hash']
        }
        # Include file_hash if present
        if block.get('file_hash'):
            data['file_hash'] = block['file_hash']
        return json.dumps(data, sort_keys=True)

    def _get_block_hash(self, block: Dict[str, Any]) -> str:
        """Calculate the hash of a block"""
        block_string = self._get_block_data_for_signing(block)
        return hashlib.sha256(block_string.encode()).hexdigest()

    def add_document(self, title: str, content: str, file_hash: Optional[str] = None,
                     file_name: Optional[str] = None, file_size: Optional[int] = None) -> Dict[str, Any]:
        """Add a new document to the chain"""
        previous_block = self.chain[-1]
        previous_hash = self._get_block_hash(previous_block)

        new_block = {
            'index': len(self.chain),
            'timestamp': datetime.utcnow().isoformat(),
            'title': title,
            'content': content,
            'content_hash': self._hash_content(content),
            'previous_hash': previous_hash,
            'signature': None,
            'file_hash': file_hash,
            'file_name': file_name,
            'file_size': file_size
        }

        # Sign the block with ML-DSA-44
        block_data = self._get_block_data_for_signing(new_block)
        signature = self._sign_message(block_data.encode())
        new_block['signature'] = base64.b64encode(signature).decode('utf-8')

        self.chain.append(new_block)
        return new_block

    def verify_chain(self) -> Dict[str, Any]:
        """Verify the entire chain integrity"""
        results = {
            'is_valid': True,
            'blocks': [],
            'total_blocks': len(self.chain),
            'using_real_pqc': self.using_real_pqc
        }

        for i, block in enumerate(self.chain):
            block_result = {
                'index': i,
                'title': block['title'],
                'signature_valid': False,
                'hash_link_valid': False,
                'content_hash_valid': False,
                'is_valid': False,
                'errors': []
            }

            # Verify signature using ML-DSA-44
            try:
                block_data = self._get_block_data_for_signing(block)
                signature = base64.b64decode(block['signature'])

                if self._verify_signature(block_data.encode(), signature):
                    block_result['signature_valid'] = True
                else:
                    block_result['errors'].append('Signature verification failed')
                    results['is_valid'] = False
            except Exception as e:
                block_result['errors'].append(f'Signature verification failed: {str(e)}')
                results['is_valid'] = False

            # Verify hash link (skip for genesis block)
            if i > 0:
                previous_block = self.chain[i - 1]
                expected_previous_hash = self._get_block_hash(previous_block)

                if block['previous_hash'] == expected_previous_hash:
                    block_result['hash_link_valid'] = True
                else:
                    block_result['errors'].append('Hash link to previous block is invalid')
                    results['is_valid'] = False
            else:
                block_result['hash_link_valid'] = True  # Genesis block

            # Verify content hash
            if 'content' in block:
                expected_content_hash = self._hash_content(block['content'])
                if block['content_hash'] == expected_content_hash:
                    block_result['content_hash_valid'] = True
                else:
                    block_result['errors'].append('Content hash mismatch - content may be tampered')
                    results['is_valid'] = False
            else:
                block_result['content_hash_valid'] = True

            # Overall block validity
            block_result['is_valid'] = (
                block_result['signature_valid'] and
                block_result['hash_link_valid'] and
                block_result['content_hash_valid']
            )

            results['blocks'].append(block_result)

        return results

    def tamper_block(self, block_index: int, new_content: str) -> bool:
        """Tamper with a block's content (for demonstration)"""
        if block_index < 0 or block_index >= len(self.chain):
            return False

        # Modify the content AND update content_hash (like a smart attacker would)
        # This simulates an attacker who tries to make the tampering look legitimate
        # However, they can't forge the signature, and the hash chain will break
        self.chain[block_index]['content'] = new_content
        self.chain[block_index]['content_hash'] = self._hash_content(new_content)
        # Note: We don't update the signature (attacker doesn't have private key)
        # This causes:
        # 1. Signature verification to fail on this block
        # 2. Hash link verification to fail on the NEXT block (chain breaks!)

        return True

    def reset(self):
        """Reset the ledger to initial state"""
        self.chain = []
        if USING_REAL_PQC:
            self.public_key, self.secret_key = generate_keypair()
        else:
            self._simulator = DilithiumSimulator()
            self.public_key = self._simulator.public_key
            self.secret_key = self._simulator.secret_key
        self._create_genesis_block()

    def import_chain(self, chain_data: List[Dict[str, Any]]):
        """Import a chain from exported data (for viewing only, signatures won't verify with new keys)"""
        self.chain = chain_data

    def get_chain(self) -> List[Dict[str, Any]]:
        """Get the full chain"""
        return self.chain

    def get_key_info(self) -> Dict[str, Any]:
        """Get information about the signing key"""
        if USING_REAL_PQC:
            return {
                'algorithm': self.algorithm,
                'algorithm_name': 'ML-DSA-44 (CRYSTALS-Dilithium)',
                'nist_level': 2,
                'public_key_size': len(self.public_key),
                'public_key_preview': base64.b64encode(self.public_key[:32]).decode('utf-8') + '...',
                'signature_size': 2420,
                'quantum_safe': True,
                'mode': 'Real Post-Quantum Cryptography'
            }
        else:
            return {
                'algorithm': self.algorithm,
                'algorithm_name': 'ML-DSA-44 (CRYSTALS-Dilithium) - SIMULATED',
                'nist_level': 2,
                'public_key_size': len(self.public_key),
                'public_key_preview': base64.b64encode(self.public_key[:32]).decode('utf-8') + '...',
                'signature_size': 2420,
                'quantum_safe': False,
                'mode': 'Simulation Mode (install pqcrypto for real PQC)'
            }
