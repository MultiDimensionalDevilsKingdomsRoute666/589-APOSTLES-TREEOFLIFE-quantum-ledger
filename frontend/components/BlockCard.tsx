'use client'

import { motion } from 'framer-motion'
import {
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Hash,
  Shield,
  Bug,
  Link,
  File,
  HardDrive
} from 'lucide-react'

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

interface BlockCardProps {
  block: Block
  verification: Verification | null
  isVerifying: boolean
  onTamper: () => void
}

export default function BlockCard({ block, verification, isVerifying, onTamper }: BlockCardProps) {
  const getStatusColor = () => {
    if (!verification) return 'border-dark-600'
    if (verification.is_valid) return 'border-green-500'
    return 'border-red-500'
  }

  const getStatusBg = () => {
    if (!verification) return 'bg-dark-800'
    if (verification.is_valid) return 'bg-green-900/20'
    return 'bg-red-900/20'
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  const truncateHash = (hash: string) => {
    if (!hash) return 'N/A'
    return `${hash.slice(0, 8)}...${hash.slice(-8)}`
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return ''
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const hasFile = block.file_hash && block.file_name

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      className={`block-card w-80 rounded-xl border-2 ${getStatusColor()} ${getStatusBg()} overflow-hidden ${isVerifying ? 'verify-scanning' : ''} transition-shadow hover:shadow-lg hover:shadow-quantum-500/10`}
    >
      {/* Header */}
      <div className="bg-dark-700/50 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <motion.div
            className="w-8 h-8 rounded-full bg-quantum-600 flex items-center justify-center text-white font-bold text-sm"
            whileHover={{ scale: 1.1 }}
          >
            {block.index}
          </motion.div>
          <div className="flex flex-col">
            <span className="font-semibold text-dark-100 text-sm">{block.title}</span>
            {hasFile && (
              <span className="text-xs text-blue-400 flex items-center gap-1">
                <File className="w-3 h-3" /> File attached
              </span>
            )}
          </div>
        </div>
        {verification && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-1"
          >
            {verification.is_valid ? (
              <CheckCircle className="w-5 h-5 text-green-400" />
            ) : (
              <XCircle className="w-5 h-5 text-red-400" />
            )}
          </motion.div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Timestamp */}
        <div className="flex items-center gap-2 text-dark-400 text-sm">
          <Clock className="w-4 h-4" />
          <span>{formatDate(block.timestamp)}</span>
        </div>

        {/* File Info (if present) */}
        {hasFile && (
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3">
            <div className="flex items-center gap-2 text-blue-300 text-sm mb-2">
              <HardDrive className="w-4 h-4" />
              <span className="font-medium">Hashed File</span>
            </div>
            <p className="text-dark-200 text-xs truncate">{block.file_name}</p>
            <p className="text-dark-400 text-xs">{formatFileSize(block.file_size)}</p>
            <div className="flex items-center gap-1 mt-2 text-xs">
              <Hash className="w-3 h-3 text-blue-400" />
              <code className="text-blue-300 font-mono">{truncateHash(block.file_hash || '')}</code>
            </div>
          </div>
        )}

        {/* Document Content Preview */}
        <div className="bg-dark-900/50 rounded-lg p-3">
          <div className="flex items-center gap-2 text-dark-300 text-sm mb-1">
            <FileText className="w-4 h-4" />
            <span>Content</span>
          </div>
          <p className="text-dark-200 text-sm line-clamp-2">
            {block.content}
          </p>
        </div>

        {/* Hashes */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs">
            <Hash className="w-3 h-3 text-quantum-400" />
            <span className="text-dark-400">Content Hash:</span>
            <code className="text-quantum-300 font-mono">{truncateHash(block.content_hash)}</code>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Link className="w-3 h-3 text-quantum-400" />
            <span className="text-dark-400">Prev Hash:</span>
            <code className="text-quantum-300 font-mono">{truncateHash(block.previous_hash)}</code>
          </div>
        </div>

        {/* Signature Preview */}
        <div className="bg-dark-900/50 rounded-lg p-2">
          <div className="flex items-center gap-2 text-dark-300 text-xs mb-1">
            <Shield className="w-3 h-3 text-quantum-400" />
            <span>ML-DSA-44 Signature</span>
          </div>
          <code className="text-dark-500 text-xs font-mono break-all line-clamp-1">
            {block.signature?.slice(0, 50)}...
          </code>
        </div>

        {/* Verification Details */}
        {verification && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-1 pt-2 border-t border-dark-600"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="text-dark-400">Signature</span>
              {verification.signature_valid ? (
                <span className="text-green-400 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Valid
                </span>
              ) : (
                <span className="text-red-400 flex items-center gap-1">
                  <XCircle className="w-3 h-3" /> Invalid
                </span>
              )}
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-dark-400">Hash Link</span>
              {verification.hash_link_valid ? (
                <span className="text-green-400 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Valid
                </span>
              ) : (
                <span className="text-red-400 flex items-center gap-1">
                  <XCircle className="w-3 h-3" /> Broken
                </span>
              )}
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-dark-400">Content Hash</span>
              {verification.content_hash_valid ? (
                <span className="text-green-400 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Intact
                </span>
              ) : (
                <span className="text-red-400 flex items-center gap-1">
                  <XCircle className="w-3 h-3" /> Tampered
                </span>
              )}
            </div>
            {verification.errors.length > 0 && (
              <div className="mt-2 text-xs text-red-400">
                {verification.errors.map((err, i) => (
                  <p key={i}>• {err}</p>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Tamper Button (for demo) */}
      {block.index > 0 && (
        <div className="px-4 pb-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onTamper}
            className="w-full flex items-center justify-center gap-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 text-sm py-2 rounded-lg transition-colors"
          >
            <Bug className="w-4 h-4" />
            Tamper (Demo)
          </motion.button>
        </div>
      )}
    </motion.div>
  )
}
