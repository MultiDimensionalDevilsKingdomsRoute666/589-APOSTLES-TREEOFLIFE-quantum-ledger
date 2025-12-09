'use client'

import { motion } from 'framer-motion'
import {
  X,
  FileText,
  Clock,
  Hash,
  Shield,
  Link,
  CheckCircle,
  XCircle,
  File,
  HardDrive,
  Copy,
  Check
} from 'lucide-react'
import { useState } from 'react'
import QRCode from '@/components/QRCode'

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

interface DocumentPreviewModalProps {
  block: Block
  verification: Verification | null
  onClose: () => void
}

export default function DocumentPreviewModal({ block, verification, onClose }: DocumentPreviewModalProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return ''
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const copyToClipboard = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const hasFile = block.file_hash && block.file_name

  const qrData = JSON.stringify({
    index: block.index,
    title: block.title,
    content_hash: block.content_hash,
    signature: block.signature.slice(0, 100)
  })

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
        className="bg-dark-800 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`sticky top-0 px-6 py-4 flex items-center justify-between border-b border-dark-600 ${
          verification ? (verification.is_valid ? 'bg-green-900/30' : 'bg-red-900/30') : 'bg-dark-700'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-quantum-600 flex items-center justify-center text-white font-bold">
              {block.index}
            </div>
            <div>
              <h2 className="text-xl font-bold text-dark-100">{block.title}</h2>
              <p className="text-dark-400 text-sm">{formatDate(block.timestamp)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {verification && (
              verification.is_valid ? (
                <span className="flex items-center gap-1 text-green-400 text-sm">
                  <CheckCircle className="w-5 h-5" /> Verified
                </span>
              ) : (
                <span className="flex items-center gap-1 text-red-400 text-sm">
                  <XCircle className="w-5 h-5" /> Tampered
                </span>
              )
            )}
            <button
              onClick={onClose}
              className="text-dark-400 hover:text-dark-200 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* QR Code and Content side by side */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* QR Code */}
            <div className="bg-dark-900/50 rounded-lg p-4 flex flex-col items-center justify-center">
              <p className="text-dark-400 text-sm mb-3">Verification QR</p>
              <QRCode data={qrData} size={150} />
              <p className="text-dark-500 text-xs mt-2 text-center">Scan to verify block</p>
            </div>

            {/* Content */}
            <div className="md:col-span-2 bg-dark-900/50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-dark-300 mb-3">
                <FileText className="w-5 h-5 text-quantum-400" />
                <span className="font-medium">Document Content</span>
              </div>
              <p className="text-dark-200 whitespace-pre-wrap">{block.content}</p>
            </div>
          </div>

          {/* File Info */}
          {hasFile && (
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
              <div className="flex items-center gap-2 text-blue-300 mb-3">
                <HardDrive className="w-5 h-5" />
                <span className="font-medium">Attached File</span>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-dark-400 text-sm">File Name</p>
                  <p className="text-dark-200">{block.file_name}</p>
                </div>
                <div>
                  <p className="text-dark-400 text-sm">File Size</p>
                  <p className="text-dark-200">{formatFileSize(block.file_size)}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-dark-400 text-sm">File Hash (SHA-256)</p>
                  <div className="flex items-center gap-2">
                    <code className="text-blue-300 text-sm font-mono break-all">{block.file_hash}</code>
                    <button
                      onClick={() => copyToClipboard(block.file_hash || '', 'file_hash')}
                      className="text-dark-400 hover:text-dark-200"
                    >
                      {copiedField === 'file_hash' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Cryptographic Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-dark-200 flex items-center gap-2">
              <Shield className="w-5 h-5 text-quantum-400" />
              Cryptographic Details
            </h3>

            <div className="grid gap-4">
              {/* Content Hash */}
              <div className="bg-dark-900/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-dark-400 text-sm flex items-center gap-2">
                    <Hash className="w-4 h-4" /> Content Hash (SHA-256)
                  </span>
                  <button
                    onClick={() => copyToClipboard(block.content_hash, 'content_hash')}
                    className="text-dark-400 hover:text-dark-200"
                  >
                    {copiedField === 'content_hash' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <code className="text-quantum-300 text-sm font-mono break-all">{block.content_hash}</code>
              </div>

              {/* Previous Hash */}
              <div className="bg-dark-900/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-dark-400 text-sm flex items-center gap-2">
                    <Link className="w-4 h-4" /> Previous Block Hash
                  </span>
                  <button
                    onClick={() => copyToClipboard(block.previous_hash, 'prev_hash')}
                    className="text-dark-400 hover:text-dark-200"
                  >
                    {copiedField === 'prev_hash' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <code className="text-quantum-300 text-sm font-mono break-all">{block.previous_hash}</code>
              </div>

              {/* Signature */}
              <div className="bg-dark-900/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-dark-400 text-sm flex items-center gap-2">
                    <Shield className="w-4 h-4" /> ML-DSA-44 Digital Signature
                  </span>
                  <button
                    onClick={() => copyToClipboard(block.signature, 'signature')}
                    className="text-dark-400 hover:text-dark-200"
                  >
                    {copiedField === 'signature' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <code className="text-quantum-300 text-xs font-mono break-all block max-h-24 overflow-y-auto">
                  {block.signature}
                </code>
              </div>
            </div>
          </div>

          {/* Verification Status */}
          {verification && (
            <div className={`rounded-lg p-4 ${verification.is_valid ? 'bg-green-900/20 border border-green-500/30' : 'bg-red-900/20 border border-red-500/30'}`}>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                {verification.is_valid ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-400" />
                )}
                <span className={verification.is_valid ? 'text-green-300' : 'text-red-300'}>
                  Verification {verification.is_valid ? 'Passed' : 'Failed'}
                </span>
              </h3>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <p className="text-dark-400 mb-1">Signature</p>
                  {verification.signature_valid ? (
                    <CheckCircle className="w-6 h-6 text-green-400 mx-auto" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-400 mx-auto" />
                  )}
                </div>
                <div className="text-center">
                  <p className="text-dark-400 mb-1">Hash Link</p>
                  {verification.hash_link_valid ? (
                    <CheckCircle className="w-6 h-6 text-green-400 mx-auto" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-400 mx-auto" />
                  )}
                </div>
                <div className="text-center">
                  <p className="text-dark-400 mb-1">Content</p>
                  {verification.content_hash_valid ? (
                    <CheckCircle className="w-6 h-6 text-green-400 mx-auto" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-400 mx-auto" />
                  )}
                </div>
              </div>
              {verification.errors.length > 0 && (
                <div className="mt-4 text-red-400 text-sm">
                  {verification.errors.map((err, i) => (
                    <p key={i}>• {err}</p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
