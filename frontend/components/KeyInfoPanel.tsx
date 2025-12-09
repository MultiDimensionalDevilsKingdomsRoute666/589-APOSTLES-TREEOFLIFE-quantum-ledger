'use client'

import { motion } from 'framer-motion'
import { Key, Shield, Cpu, Lock, X } from 'lucide-react'

interface KeyInfo {
  algorithm: string
  algorithm_name: string
  nist_level: number
  public_key_size: number
  public_key_preview: string
  signature_size: number
  quantum_safe: boolean
}

interface KeyInfoPanelProps {
  keyInfo: KeyInfo
  onClose: () => void
}

export default function KeyInfoPanel({ keyInfo, onClose }: KeyInfoPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="mb-8 bg-dark-800 rounded-xl border border-quantum-500/30 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-quantum-900/30 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Key className="w-6 h-6 text-quantum-400" />
          <h3 className="text-lg font-semibold text-quantum-300">
            Cryptographic Key Information
          </h3>
        </div>
        <button
          onClick={onClose}
          className="text-dark-400 hover:text-dark-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="p-6 grid md:grid-cols-2 gap-6">
        {/* Algorithm Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-quantum-400" />
            <span className="text-dark-200 font-medium">Algorithm Details</span>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-dark-400">Algorithm ID</span>
              <span className="text-dark-200 font-mono">{keyInfo.algorithm}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-dark-400">Full Name</span>
              <span className="text-dark-200">{keyInfo.algorithm_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-dark-400">NIST Security Level</span>
              <span className="text-quantum-400 font-medium">Level {keyInfo.nist_level}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-dark-400">Quantum Safe</span>
              <span className="text-green-400 flex items-center gap-1">
                <Shield className="w-4 h-4" />
                Yes
              </span>
            </div>
          </div>
        </div>

        {/* Key Sizes */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-quantum-400" />
            <span className="text-dark-200 font-medium">Key & Signature Sizes</span>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-dark-400">Public Key Size</span>
              <span className="text-dark-200">{keyInfo.public_key_size} bytes</span>
            </div>
            <div className="flex justify-between">
              <span className="text-dark-400">Signature Size</span>
              <span className="text-dark-200">{keyInfo.signature_size} bytes</span>
            </div>
          </div>

          <div className="bg-dark-900/50 rounded-lg p-3 mt-4">
            <span className="text-dark-400 text-xs">Public Key Preview</span>
            <code className="block text-quantum-300 text-xs font-mono mt-1 break-all">
              {keyInfo.public_key_preview}
            </code>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="bg-dark-900/50 px-6 py-3 text-sm text-dark-400">
        <p>
          ML-DSA-44 is based on the CRYSTALS-Dilithium algorithm and is standardized in FIPS 204 (August 2024).
          It provides security against both classical and quantum computer attacks using lattice-based cryptography.
        </p>
      </div>
    </motion.div>
  )
}
