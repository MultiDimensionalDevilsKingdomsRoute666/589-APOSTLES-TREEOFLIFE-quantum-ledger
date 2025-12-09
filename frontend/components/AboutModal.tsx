'use client'

import { motion } from 'framer-motion'
import {
  X,
  Shield,
  Lock,
  Cpu,
  BookOpen,
  AlertTriangle,
  CheckCircle,
  Atom,
  Grid3X3,
  Binary
} from 'lucide-react'

interface AboutModalProps {
  onClose: () => void
}

export default function AboutModal({ onClose }: AboutModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-dark-800 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-quantum-900/50 to-dark-800 px-6 py-4 flex items-center justify-between border-b border-dark-600">
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-quantum-400" />
            <h2 className="text-xl font-bold text-dark-100">
              Understanding Post-Quantum Cryptography
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-dark-400 hover:text-dark-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Introduction */}
          <section>
            <h3 className="text-2xl font-bold text-quantum-300 mb-4 flex items-center gap-2">
              <Atom className="w-6 h-6" />
              The Quantum Threat
            </h3>
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-dark-200">
                    Quantum computers pose a serious threat to current cryptographic systems.
                    Using <strong className="text-red-300">Shor's Algorithm</strong>, a sufficiently powerful
                    quantum computer could break RSA, ECDSA, and other widely-used cryptographic schemes
                    in polynomial time.
                  </p>
                  <p className="text-dark-400 text-sm mt-2">
                    Experts estimate cryptographically relevant quantum computers could exist within 10-15 years.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* What is ML-DSA-44 */}
          <section>
            <h3 className="text-2xl font-bold text-quantum-300 mb-4 flex items-center gap-2">
              <Shield className="w-6 h-6" />
              What is ML-DSA-44?
            </h3>
            <div className="bg-dark-900/50 rounded-lg p-4 space-y-4">
              <p className="text-dark-200">
                <strong className="text-quantum-300">ML-DSA-44</strong> (Module-Lattice Digital Signature Algorithm)
                is a post-quantum digital signature scheme standardized by NIST in <strong>FIPS 204</strong> (August 2024).
                It was previously known as <strong>CRYSTALS-Dilithium</strong>.
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-dark-800 rounded-lg p-3">
                  <h4 className="text-quantum-400 font-semibold mb-2">Key Parameters (Level 2)</h4>
                  <ul className="text-dark-300 text-sm space-y-1">
                    <li>• Public Key Size: <code className="text-quantum-300">1,312 bytes</code></li>
                    <li>• Secret Key Size: <code className="text-quantum-300">2,560 bytes</code></li>
                    <li>• Signature Size: <code className="text-quantum-300">2,420 bytes</code></li>
                    <li>• Security Level: <code className="text-quantum-300">NIST Level 2</code></li>
                  </ul>
                </div>
                <div className="bg-dark-800 rounded-lg p-3">
                  <h4 className="text-quantum-400 font-semibold mb-2">Security Properties</h4>
                  <ul className="text-dark-300 text-sm space-y-1">
                    <li>• <CheckCircle className="w-4 h-4 inline text-green-400" /> Quantum-resistant</li>
                    <li>• <CheckCircle className="w-4 h-4 inline text-green-400" /> EUF-CMA secure</li>
                    <li>• <CheckCircle className="w-4 h-4 inline text-green-400" /> Fast signing/verification</li>
                    <li>• <CheckCircle className="w-4 h-4 inline text-green-400" /> Small signature size</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Mathematical Foundation */}
          <section>
            <h3 className="text-2xl font-bold text-quantum-300 mb-4 flex items-center gap-2">
              <Grid3X3 className="w-6 h-6" />
              Mathematical Foundation
            </h3>
            <div className="bg-dark-900/50 rounded-lg p-4 space-y-4">
              <p className="text-dark-200">
                ML-DSA is based on the <strong className="text-quantum-300">Module Learning With Errors (M-LWE)</strong> problem,
                a hard mathematical problem that is believed to be resistant to both classical and quantum attacks.
              </p>

              <div className="bg-dark-800 rounded-lg p-4">
                <h4 className="text-quantum-400 font-semibold mb-3">The LWE Problem</h4>
                <p className="text-dark-300 text-sm mb-3">
                  Given a matrix <code className="text-quantum-300">A</code>, a secret vector <code className="text-quantum-300">s</code>,
                  and small error <code className="text-quantum-300">e</code>:
                </p>
                <div className="bg-dark-900 rounded p-3 font-mono text-center text-quantum-300">
                  b = A · s + e (mod q)
                </div>
                <p className="text-dark-400 text-sm mt-3">
                  Finding <code className="text-quantum-300">s</code> from <code className="text-quantum-300">A</code> and
                  <code className="text-quantum-300"> b</code> is computationally hard, even for quantum computers.
                </p>
              </div>

              <div className="bg-dark-800 rounded-lg p-4">
                <h4 className="text-quantum-400 font-semibold mb-3">Lattice Visualization</h4>
                <p className="text-dark-300 text-sm mb-3">
                  A lattice is a regular grid of points in n-dimensional space. Finding the closest lattice point
                  to a given target (the Closest Vector Problem) is computationally hard.
                </p>
                <div className="grid grid-cols-8 gap-1 w-fit mx-auto">
                  {Array(64).fill(0).map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-3 h-3 rounded-full bg-quantum-500"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.01 }}
                    />
                  ))}
                </div>
                <p className="text-dark-500 text-xs text-center mt-2">2D lattice representation</p>
              </div>
            </div>
          </section>

          {/* How Signing Works */}
          <section>
            <h3 className="text-2xl font-bold text-quantum-300 mb-4 flex items-center gap-2">
              <Binary className="w-6 h-6" />
              How Digital Signing Works
            </h3>
            <div className="bg-dark-900/50 rounded-lg p-4">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-quantum-600 flex items-center justify-center text-white font-bold flex-shrink-0">1</div>
                  <div>
                    <h4 className="text-dark-200 font-semibold">Key Generation</h4>
                    <p className="text-dark-400 text-sm">Generate a random matrix A, secret vectors s₁ and s₂, compute public key t = As₁ + s₂</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-quantum-600 flex items-center justify-center text-white font-bold flex-shrink-0">2</div>
                  <div>
                    <h4 className="text-dark-200 font-semibold">Signing</h4>
                    <p className="text-dark-400 text-sm">Hash the message, generate masking vectors y, compute challenge c, produce signature (z, h)</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-quantum-600 flex items-center justify-center text-white font-bold flex-shrink-0">3</div>
                  <div>
                    <h4 className="text-dark-200 font-semibold">Verification</h4>
                    <p className="text-dark-400 text-sm">Recompute the challenge from signature and public key, verify it matches</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* NIST Standardization */}
          <section>
            <h3 className="text-2xl font-bold text-quantum-300 mb-4 flex items-center gap-2">
              <Lock className="w-6 h-6" />
              NIST Standardization
            </h3>
            <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
              <p className="text-dark-200 mb-4">
                In August 2024, NIST released the first three post-quantum cryptographic standards:
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-dark-800 rounded-lg p-3 text-center">
                  <p className="text-quantum-300 font-bold">FIPS 203</p>
                  <p className="text-dark-300 text-sm">ML-KEM</p>
                  <p className="text-dark-500 text-xs">Key Encapsulation</p>
                </div>
                <div className="bg-dark-800 rounded-lg p-3 text-center border-2 border-quantum-500">
                  <p className="text-quantum-300 font-bold">FIPS 204</p>
                  <p className="text-dark-300 text-sm">ML-DSA</p>
                  <p className="text-dark-500 text-xs">Digital Signatures</p>
                  <p className="text-quantum-400 text-xs mt-1">← Used in this app</p>
                </div>
                <div className="bg-dark-800 rounded-lg p-3 text-center">
                  <p className="text-quantum-300 font-bold">FIPS 205</p>
                  <p className="text-dark-300 text-sm">SLH-DSA</p>
                  <p className="text-dark-500 text-xs">Hash-based Signatures</p>
                </div>
              </div>
            </div>
          </section>

          {/* Application in This System */}
          <section>
            <h3 className="text-2xl font-bold text-quantum-300 mb-4 flex items-center gap-2">
              <Cpu className="w-6 h-6" />
              Application in This System
            </h3>
            <div className="bg-dark-900/50 rounded-lg p-4">
              <p className="text-dark-200 mb-4">
                This Quantum-Safe Document Ledger uses ML-DSA-44 to provide:
              </p>
              <ul className="space-y-2 text-dark-300">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Document Integrity</strong> - Every document is signed, any modification is detected</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Chain Integrity</strong> - Blocks are cryptographically linked via hash chains</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Future-Proof Security</strong> - Resistant to attacks from quantum computers</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Non-Repudiation</strong> - Signatures prove document origin and authenticity</span>
                </li>
              </ul>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="bg-dark-900/50 px-6 py-4 border-t border-dark-600 text-center text-dark-400 text-sm">
          <p>CI7100 Cryptography and Applications • Kingston University • 2025</p>
        </div>
      </motion.div>
    </motion.div>
  )
}
