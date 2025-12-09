'use client'

import { motion } from 'framer-motion'
import {
  Shield,
  Lock,
  Cpu,
  Binary,
  Link as LinkIcon,
  Key,
  FileCheck,
  Zap,
  ExternalLink
} from 'lucide-react'

interface KeyInfo {
  algorithm: string
  algorithm_name: string
  nist_level: number
  public_key_size: number
  signature_size: number
  quantum_safe: boolean
  mode: string
}

interface AboutPageProps {
  keyInfo: KeyInfo | null
}

export default function AboutPage({ keyInfo }: AboutPageProps) {
  const features = [
    {
      icon: Shield,
      title: 'ML-DSA-44',
      description: 'NIST standardized post-quantum digital signature algorithm (FIPS 204)'
    },
    {
      icon: Lock,
      title: 'Quantum Resistant',
      description: 'Based on lattice problems that quantum computers cannot efficiently solve'
    },
    {
      icon: LinkIcon,
      title: 'Blockchain Structure',
      description: 'Documents linked via cryptographic hashes for tamper detection'
    },
    {
      icon: FileCheck,
      title: 'Integrity Verification',
      description: 'Three-layer verification: signature, hash chain, and content hash'
    }
  ]

  const specs = [
    { label: 'Algorithm', value: 'ML-DSA-44 (Dilithium)' },
    { label: 'Security Level', value: 'NIST Level 2 (128-bit)' },
    { label: 'Public Key', value: '1,312 bytes' },
    { label: 'Signature Size', value: '2,420 bytes' },
    { label: 'Hash Function', value: 'SHA-256' },
    { label: 'Standard', value: 'FIPS 204 (2024)' }
  ]

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">About QuantumLedger</h1>
        <p className="text-gray-500">
          Understanding post-quantum cryptography and how this system works
        </p>
      </div>

      {/* Current Key Info */}
      {keyInfo && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`glass-card rounded-2xl p-6 mb-8 ${
            keyInfo.quantum_safe ? 'ring-1 ring-green-200' : 'ring-1 ring-orange-200'
          }`}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              keyInfo.quantum_safe ? 'bg-green-50' : 'bg-orange-50'
            }`}>
              <Key className={`w-6 h-6 ${keyInfo.quantum_safe ? 'text-green-600' : 'text-orange-600'}`} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Current Session Key</h2>
              <p className={`text-sm ${keyInfo.quantum_safe ? 'text-green-600' : 'text-orange-600'}`}>
                {keyInfo.mode}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Algorithm</p>
              <p className="font-medium text-gray-900">{keyInfo.algorithm_name}</p>
            </div>
            <div>
              <p className="text-gray-500">NIST Security Level</p>
              <p className="font-medium text-gray-900">Level {keyInfo.nist_level}</p>
            </div>
            <div>
              <p className="text-gray-500">Public Key Size</p>
              <p className="font-medium text-gray-900">{keyInfo.public_key_size.toLocaleString()} bytes</p>
            </div>
            <div>
              <p className="text-gray-500">Signature Size</p>
              <p className="font-medium text-gray-900">{keyInfo.signature_size.toLocaleString()} bytes</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Features Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card rounded-xl p-5"
          >
            <feature.icon className="w-8 h-8 text-gray-700 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
            <p className="text-sm text-gray-500">{feature.description}</p>
          </motion.div>
        ))}
      </div>

      {/* What is Post-Quantum Cryptography */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card rounded-2xl p-6 mb-8"
      >
        <div className="flex items-center gap-3 mb-4">
          <Cpu className="w-6 h-6 text-gray-700" />
          <h2 className="text-xl font-semibold text-gray-900">Why Post-Quantum?</h2>
        </div>
        <div className="space-y-4 text-gray-600">
          <p>
            Current cryptographic systems like RSA and ECDSA rely on mathematical problems
            (integer factorization, discrete logarithm) that quantum computers can solve
            efficiently using <strong>Shor's Algorithm</strong>.
          </p>
          <p>
            <strong>ML-DSA-44</strong> (formerly CRYSTALS-Dilithium) uses <strong>lattice-based
            cryptography</strong>, specifically the Module Learning With Errors (M-LWE) problem.
            No known quantum algorithm can efficiently solve lattice problems.
          </p>
          <div className="bg-black/5 rounded-xl p-4 mt-4">
            <p className="text-sm font-medium text-gray-900 mb-2">The Quantum Threat Timeline</p>
            <p className="text-sm text-gray-600">
              Experts estimate cryptographically relevant quantum computers could arrive within
              10-15 years. Documents signed today with RSA may be broken in the future.
              Post-quantum signatures provide long-term security.
            </p>
          </div>
        </div>
      </motion.div>

      {/* How It Works */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card rounded-2xl p-6 mb-8"
      >
        <div className="flex items-center gap-3 mb-4">
          <Binary className="w-6 h-6 text-gray-700" />
          <h2 className="text-xl font-semibold text-gray-900">How This System Works</h2>
        </div>
        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">1</div>
            <div>
              <p className="font-medium text-gray-900">Document Hashing</p>
              <p className="text-sm text-gray-500">Your content is hashed using SHA-256 to create a unique fingerprint</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">2</div>
            <div>
              <p className="font-medium text-gray-900">Chain Linking</p>
              <p className="text-sm text-gray-500">The new block includes the hash of the previous block, creating an unbreakable chain</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">3</div>
            <div>
              <p className="font-medium text-gray-900">ML-DSA-44 Signing</p>
              <p className="text-sm text-gray-500">The block data is signed with a quantum-resistant signature</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">4</div>
            <div>
              <p className="font-medium text-gray-900">Verification</p>
              <p className="text-sm text-gray-500">Any tampering breaks the signature, content hash, or chain link - instantly detectable</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Technical Specifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass-card rounded-2xl p-6 mb-8"
      >
        <div className="flex items-center gap-3 mb-4">
          <Zap className="w-6 h-6 text-gray-700" />
          <h2 className="text-xl font-semibold text-gray-900">Technical Specifications</h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {specs.map((spec) => (
            <div key={spec.label} className="py-3 border-b border-gray-100">
              <p className="text-sm text-gray-500">{spec.label}</p>
              <p className="font-medium text-gray-900">{spec.value}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* References */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="glass-card rounded-2xl p-6"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Learn More</h2>
        <div className="space-y-3">
          <a
            href="https://csrc.nist.gov/pubs/fips/204/final"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>NIST FIPS 204 - ML-DSA Standard</span>
          </a>
          <a
            href="https://pq-crystals.org/dilithium/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>CRYSTALS-Dilithium Official Page</span>
          </a>
          <a
            href="https://en.wikipedia.org/wiki/Learning_with_errors"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Learning With Errors (LWE) Problem</span>
          </a>
        </div>
      </motion.div>
    </div>
  )
}
