'use client'

import { motion } from 'framer-motion'
import {
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Shield,
  File,
  ChevronRight
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

interface TimelineViewProps {
  chain: Block[]
  verificationResults: Map<number, Verification>
  onBlockClick: (block: Block) => void
}

export default function TimelineView({ chain, verificationResults, onBlockClick }: TimelineViewProps) {
  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  const getVerification = (index: number) => {
    return verificationResults.get(index)
  }

  return (
    <div className="relative max-w-3xl mx-auto">
      {/* Timeline line */}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-dark-600" />

      <div className="space-y-6">
        {chain.map((block, index) => {
          const verification = getVerification(block.index)
          const hasFile = block.file_hash && block.file_name

          return (
            <motion.div
              key={block.index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative flex items-start gap-4 cursor-pointer group"
              onClick={() => onBlockClick(block)}
            >
              {/* Timeline dot */}
              <div className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 ${
                verification
                  ? verification.is_valid
                    ? 'bg-green-900/50 border-2 border-green-500'
                    : 'bg-red-900/50 border-2 border-red-500'
                  : 'bg-dark-700 border-2 border-dark-500'
              }`}>
                <span className="text-lg font-bold text-dark-100">{block.index}</span>
                {verification && (
                  <div className="absolute -bottom-1 -right-1">
                    {verification.is_valid ? (
                      <CheckCircle className="w-5 h-5 text-green-400 bg-dark-900 rounded-full" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400 bg-dark-900 rounded-full" />
                    )}
                  </div>
                )}
              </div>

              {/* Content card */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className={`flex-1 rounded-xl p-4 transition-all ${
                  verification
                    ? verification.is_valid
                      ? 'bg-green-900/10 border border-green-500/30'
                      : 'bg-red-900/10 border border-red-500/30'
                    : 'bg-dark-800 border border-dark-600'
                } group-hover:shadow-lg group-hover:shadow-quantum-500/10`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-dark-100">{block.title}</h3>
                      {hasFile && (
                        <span className="text-xs bg-blue-900/50 text-blue-300 px-2 py-0.5 rounded flex items-center gap-1">
                          <File className="w-3 h-3" /> File
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-dark-400 text-sm mb-2">
                      <Clock className="w-4 h-4" />
                      <span>{formatDate(block.timestamp)}</span>
                    </div>
                    <p className="text-dark-300 text-sm line-clamp-2">{block.content}</p>
                  </div>

                  <ChevronRight className="w-5 h-5 text-dark-500 group-hover:text-quantum-400 transition-colors" />
                </div>

                {/* Mini signature preview */}
                <div className="mt-3 pt-3 border-t border-dark-600/50 flex items-center gap-2 text-xs text-dark-500">
                  <Shield className="w-3 h-3 text-quantum-400" />
                  <span>ML-DSA-44 Signed</span>
                  <code className="font-mono">{block.signature.slice(0, 20)}...</code>
                </div>
              </motion.div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
