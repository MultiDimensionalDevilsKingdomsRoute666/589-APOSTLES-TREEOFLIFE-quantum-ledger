'use client'

import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Shield, AlertTriangle } from 'lucide-react'

interface VerificationResult {
  is_valid: boolean
  blocks: {
    index: number
    title: string
    signature_valid: boolean
    hash_link_valid: boolean
    content_hash_valid: boolean
    is_valid: boolean
    errors: string[]
  }[]
  total_blocks: number
}

interface VerificationPanelProps {
  result: VerificationResult
}

export default function VerificationPanel({ result }: VerificationPanelProps) {
  const validBlocks = result.blocks.filter((b) => b.is_valid).length
  const invalidBlocks = result.blocks.filter((b) => !b.is_valid)

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`mb-8 rounded-xl overflow-hidden ${
        result.is_valid
          ? 'bg-green-900/20 border border-green-500/50'
          : 'bg-red-900/20 border border-red-500/50'
      }`}
    >
      {/* Header */}
      <div
        className={`px-6 py-4 flex items-center gap-4 ${
          result.is_valid ? 'bg-green-900/30' : 'bg-red-900/30'
        }`}
      >
        {result.is_valid ? (
          <CheckCircle className="w-8 h-8 text-green-400" />
        ) : (
          <XCircle className="w-8 h-8 text-red-400" />
        )}
        <div>
          <h3
            className={`text-xl font-semibold ${
              result.is_valid ? 'text-green-300' : 'text-red-300'
            }`}
          >
            {result.is_valid
              ? 'Chain Integrity Verified'
              : 'Chain Integrity Compromised'}
          </h3>
          <p className="text-dark-300 text-sm">
            {validBlocks} of {result.total_blocks} blocks verified successfully
          </p>
        </div>
      </div>

      {/* Details */}
      <div className="px-6 py-4">
        {result.is_valid ? (
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-quantum-400 mt-0.5" />
            <div className="text-sm text-dark-300">
              <p>
                All ML-DSA-44 signatures are valid and all hash links are intact.
              </p>
              <p className="mt-1 text-dark-400">
                This chain is protected against both classical and quantum computer attacks.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
              <div className="text-sm text-dark-300">
                <p className="text-red-300 font-medium">
                  Tampering detected in the following blocks:
                </p>
              </div>
            </div>
            {invalidBlocks.map((block) => (
              <div
                key={block.index}
                className="bg-red-900/20 rounded-lg p-3 ml-8"
              >
                <p className="text-red-300 font-medium">
                  Block #{block.index}: {block.title}
                </p>
                <ul className="mt-1 text-sm text-red-400/80">
                  {block.errors.map((error, i) => (
                    <li key={i}>• {error}</li>
                  ))}
                </ul>
              </div>
            ))}
            <p className="text-sm text-dark-400 ml-8">
              The ML-DSA-44 signature verification has detected unauthorized modifications.
              In a real system, these blocks would be rejected.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  )
}
