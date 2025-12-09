# Quantum-Safe Document Ledger

A blockchain-style document ledger secured with **ML-DSA-44 (CRYSTALS-Dilithium)** post-quantum digital signatures.

## Features

- **Post-Quantum Security**: Uses ML-DSA-44 (FIPS 204) for quantum-resistant signatures
- **Blockchain Structure**: Documents linked via cryptographic hashes
- **Tamper Detection**: Demonstrates how tampering is detected
- **Visual Chain**: Interactive web interface showing the document chain

## Tech Stack

- **Backend**: Python Flask + liboqs (Open Quantum Safe)
- **Frontend**: Next.js + React + Tailwind CSS
- **Crypto**: ML-DSA-44 (Dilithium2)

## Setup Instructions

### Prerequisites

- Python 3.9+
- Node.js 18+
- pip

### 1. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install flask flask-cors python-dotenv

# Install liboqs-python (Open Quantum Safe)
pip install liboqs-python
```

**Note**: If `liboqs-python` fails to install, you may need to:
- Windows: Install Visual Studio Build Tools
- Linux: `sudo apt-get install cmake gcc ninja-build`
- Mac: `brew install cmake ninja`

Then try: `pip install liboqs-python`

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Or with yarn
yarn install
```

### 3. Running the Application

**Terminal 1 - Start Backend:**
```bash
cd backend
venv\Scripts\activate  # Windows
python app.py
```
Backend runs on http://localhost:5000

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm run dev
```
Frontend runs on http://localhost:3000

### 4. Using the Application

1. Open http://localhost:3000 in your browser
2. Click "Add Document" to add documents to the chain
3. Click "Verify Chain" to verify all signatures and hash links
4. Click "Tamper (Demo)" on any block to simulate tampering
5. Click "Verify Chain" again to see tampering detection
6. Click "Key Info" to view ML-DSA-44 algorithm details

## Demo Flow for Presentation

1. **Show the empty chain** (just genesis block)
2. **Add 2-3 documents** - explain ML-DSA-44 signing
3. **Verify the chain** - all blocks should be green/valid
4. **Tamper with one block** - click the "Tamper" button
5. **Verify again** - show how tampering is detected
6. **Explain quantum resistance** - why this matters

## Project Structure

```
quantum-ledger/
├── backend/
│   ├── app.py          # Flask API endpoints
│   ├── ledger.py       # Document ledger & ML-DSA-44 logic
│   └── requirements.txt
├── frontend/
│   ├── app/
│   │   ├── page.tsx    # Main dashboard
│   │   ├── layout.tsx  # App layout
│   │   └── globals.css # Styles
│   ├── components/
│   │   ├── BlockCard.tsx
│   │   ├── AddDocumentModal.tsx
│   │   ├── VerificationPanel.tsx
│   │   └── KeyInfoPanel.tsx
│   └── package.json
└── README.md
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/chain` | GET | Get full document chain |
| `/api/add` | POST | Add new document |
| `/api/verify` | GET | Verify chain integrity |
| `/api/tamper/<id>` | POST | Tamper with block (demo) |
| `/api/reset` | POST | Reset chain |
| `/api/keys` | GET | Get key information |

## About ML-DSA-44

ML-DSA-44 (Module-Lattice Digital Signature Algorithm) is:
- Standardized by NIST in FIPS 204 (August 2024)
- Based on CRYSTALS-Dilithium
- Provides NIST Security Level 2
- Resistant to quantum computer attacks
- Uses lattice-based cryptography (Learning With Errors problem)

## CI7100 Coursework

Kingston University - Cryptography and Applications
