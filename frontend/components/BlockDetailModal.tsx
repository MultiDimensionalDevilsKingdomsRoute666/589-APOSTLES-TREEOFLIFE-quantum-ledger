'use client'

import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Clock,
  Shield,
  Link as LinkIcon,
  FileText,
  File,
  Copy,
  Check,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { useState } from 'react'

interface Block {
  index: number
  timestamp: string
  title: string
  content: string
  content_hash: string
  previous_hash: string
  signature: string
  file_hash?: string
  file_name?: string
  file_size?: number
}

interface Verification {
  index: number
  title: string
  signature_valid: boolean
  hash_link_valid: boolean
  content_hash_valid: boolean
  is_valid: boolean
  errors: string[]
}

interface BlockDetailModalProps {
  block: Block | null
  verification?: Verification
  onClose: () => void
}

export default function BlockDetailModal({ block, verification, onClose }: BlockDetailModalProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null)

  if (!block) return null

  const copyToClipboard = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="glass-card rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                verification
                  ? verification.is_valid
                    ? 'bg-green-50 text-green-600'
                    : 'bg-red-50 text-red-600'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                <span className="text-lg font-bold">#{block.index}</span>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{block.title}</h2>
                <p className="text-sm text-gray-500">{formatDate(block.timestamp)}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(85vh-80px)]">
            {/* Verification Status */}
            {verification && (
              <div className={`rounded-xl p-4 mb-6 ${
                verification.is_valid
                  ? 'bg-green-50 border border-green-100'
                  : 'bg-red-50 border border-red-100'
              }`}>
                <div className="flex items-center gap-3">
                  {verification.is_valid ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-green-700">Block Verified</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-red-600" />
                      <span className="font-medium text-red-700">Verification Failed</span>
                    </>
                  )}
                </div>
                {verification.errors.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {verification.errors.map((error, i) => (
                      <p key={i} className="text-sm text-red-600">{error}</p>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Document Content */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Content
              </h3>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-700 whitespace-pre-wrap">{block.content}</p>
              </div>
            </div>

            {/* File Attachment */}
            {block.file_hash && block.file_name && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <File className="w-4 h-4" />
                  Attached File
                </h3>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center">
                      <File className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{block.file_name}</p>
                      {block.file_size && (
                        <p className="text-sm text-gray-500">{formatFileSize(block.file_size)}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Cryptographic Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Cryptographic Details
              </h3>

              {/* Content Hash */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-500">Content Hash (SHA-256)</span>
                  <button
                    onClick={() => copyToClipboard(block.content_hash, 'content')}
                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                  >
                    {copiedField === 'content' ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </div>
                <code className="text-xs text-gray-700 break-all">{block.content_hash}</code>
              </div>

              {/* Previous Hash */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <LinkIcon className="w-3 h-3" />
                    Previous Block Hash
                  </span>
                  <button
                    onClick={() => copyToClipboard(block.previous_hash, 'previous')}
                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                  >
                    {copiedField === 'previous' ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </div>
                <code className="text-xs text-gray-700 break-all">{block.previous_hash}</code>
              </div>

              {/* File Hash */}
              {block.file_hash && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-500">File Hash (SHA-256)</span>
                    <button
                      onClick={() => copyToClipboard(block.file_hash!, 'file')}
                      className="p-1 hover:bg-gray-200 rounded transition-colors"
                    >
                      {copiedField === 'file' ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                  <code className="text-xs text-gray-700 break-all">{block.file_hash}</code>
                </div>
              )}

              {/* Signature */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-500">ML-DSA-44 Signature</span>
                  <button
                    onClick={() => copyToClipboard(block.signature, 'signature')}
                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                  >
                    {copiedField === 'signature' ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </div>
                <code className="text-xs text-gray-700 break-all line-clamp-4">{block.signature}</code>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
