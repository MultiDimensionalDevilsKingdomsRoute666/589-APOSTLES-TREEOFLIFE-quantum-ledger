'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Shield,
  CheckCircle,
  XCircle,
  Loader2,
  AlertTriangle,
  Lock,
  Link as LinkIcon,
  FileText
} from 'lucide-react'

interface Verification {
  index: number
  title: string
  signature_valid: boolean
  hash_link_valid: boolean
  content_hash_valid: boolean
  is_valid: boolean
  errors: string[]
}

interface VerifyPageProps {
  onVerify: () => Promise<void>
  verificationResults: Map<number, Verification>
  isVerifying: boolean
  chainLength: number
}

export default function VerifyPage({
  onVerify,
  verificationResults,
  isVerifying,
  chainLength
}: VerifyPageProps) {
  const [hasVerified, setHasVerified] = useState(false)

  const handleVerify = async () => {
    await onVerify()
    setHasVerified(true)
  }

  const results = Array.from(verificationResults.values())
  const allValid = results.length > 0 && results.every(r => r.is_valid)
  const invalidCount = results.filter(r => !r.is_valid).length

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify Chain</h1>
        <p className="text-gray-500">
          Verify the integrity of all {chainLength} blocks in the chain
        </p>
      </div>

      {/* Verify Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleVerify}
        disabled={isVerifying}
        className="w-full py-6 px-8 glass-card rounded-2xl font-medium flex items-center justify-center gap-3 hover:shadow-lg transition-all disabled:opacity-50"
      >
        {isVerifying ? (
          <>
            <Loader2 className="w-6 h-6 animate-spin text-gray-600" />
            <span className="text-gray-600">Verifying all blocks...</span>
          </>
        ) : (
          <>
            <Shield className="w-6 h-6 text-gray-600" />
            <span className="text-gray-900">Verify Entire Chain</span>
          </>
        )}
      </motion.button>

      {/* Results */}
      <AnimatePresence>
        {hasVerified && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-8"
          >
            {/* Summary Card */}
            <div className={`glass-card rounded-2xl p-6 mb-6 ${
              allValid ? 'ring-1 ring-green-200' : 'ring-1 ring-red-200'
            }`}>
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                  allValid ? 'bg-green-50' : 'bg-red-50'
                }`}>
                  {allValid ? (
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  ) : (
                    <XCircle className="w-8 h-8 text-red-500" />
                  )}
                </div>
                <div>
                  <h2 className={`text-2xl font-bold ${allValid ? 'text-green-600' : 'text-red-600'}`}>
                    {allValid ? 'Chain Valid' : 'Chain Compromised'}
                  </h2>
                  <p className="text-gray-500">
                    {allValid
                      ? 'All blocks passed verification'
                      : `${invalidCount} block${invalidCount > 1 ? 's' : ''} failed verification`}
                  </p>
                </div>
              </div>
            </div>

            {/* Detailed Results */}
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Block-by-Block Results</h3>
            <div className="space-y-3">
              {results.map((result, index) => (
                <motion.div
                  key={result.index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`glass-card rounded-xl p-4 ${
                    result.is_valid ? '' : 'ring-1 ring-red-200'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Block Number */}
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      result.is_valid ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                    }`}>
                      <span className="font-bold">#{result.index}</span>
                    </div>

                    {/* Title */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{result.title}</p>
                    </div>

                    {/* Check Icons */}
                    <div className="flex items-center gap-3">
                      {/* Signature */}
                      <div className="flex items-center gap-1" title="Signature">
                        <Lock className={`w-4 h-4 ${result.signature_valid ? 'text-green-500' : 'text-red-500'}`} />
                        {result.signature_valid ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                      </div>

                      {/* Hash Link */}
                      <div className="flex items-center gap-1" title="Hash Link">
                        <LinkIcon className={`w-4 h-4 ${result.hash_link_valid ? 'text-green-500' : 'text-red-500'}`} />
                        {result.hash_link_valid ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                      </div>

                      {/* Content Hash */}
                      <div className="flex items-center gap-1" title="Content Hash">
                        <FileText className={`w-4 h-4 ${result.content_hash_valid ? 'text-green-500' : 'text-red-500'}`} />
                        {result.content_hash_valid ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                    </div>

                    {/* Overall Status */}
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      result.is_valid
                        ? 'bg-green-50 text-green-600'
                        : 'bg-red-50 text-red-600'
                    }`}>
                      {result.is_valid ? 'Valid' : 'Invalid'}
                    </div>
                  </div>

                  {/* Errors */}
                  {result.errors.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      {result.errors.map((error, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-red-600">
                          <AlertTriangle className="w-4 h-4" />
                          <span>{error}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Legend */}
            <div className="mt-6 glass-card rounded-xl p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Verification Checks</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">ML-DSA-44 Signature</span>
                </div>
                <div className="flex items-center gap-2">
                  <LinkIcon className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">Hash Chain Link</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">Content Integrity</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info when not verified yet */}
      {!hasVerified && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 glass-card rounded-xl p-6"
        >
          <h3 className="font-medium text-gray-900 mb-4">What gets verified?</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-black/5 flex items-center justify-center flex-shrink-0">
                <Lock className="w-4 h-4 text-gray-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">ML-DSA-44 Signature</p>
                <p className="text-sm text-gray-500">Verifies the quantum-resistant digital signature on each block</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-black/5 flex items-center justify-center flex-shrink-0">
                <LinkIcon className="w-4 h-4 text-gray-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Hash Chain Link</p>
                <p className="text-sm text-gray-500">Confirms each block correctly references the previous block's hash</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-black/5 flex items-center justify-center flex-shrink-0">
                <FileText className="w-4 h-4 text-gray-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Content Integrity</p>
                <p className="text-sm text-gray-500">Ensures document content hasn't been modified since signing</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
