'use client'

import { motion } from 'framer-motion'
import {
  BarChart3,
  FileText,
  Shield,
  Clock,
  Database,
  Cpu,
  Lock,
  Zap
} from 'lucide-react'

interface Stats {
  total_blocks: number
  total_documents: number
  total_content_size: number
  total_files: number
  algorithm: string
  nist_level: number
  quantum_safe: boolean
  public_key_size: number
  signature_size: number
  mode: string
  created_at: string | null
  last_block_at: string | null
}

interface StatsPanelProps {
  stats: Stats
  onClose: () => void
}

export default function StatsPanel({ stats, onClose }: StatsPanelProps) {
  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'N/A'
    return new Date(dateStr).toLocaleString()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="mb-8 bg-dark-800 rounded-xl border border-quantum-500/30 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-quantum-900/50 to-dark-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BarChart3 className="w-6 h-6 text-quantum-400" />
          <h3 className="text-lg font-semibold text-quantum-300">
            Chain Statistics
          </h3>
        </div>
        <button
          onClick={onClose}
          className="text-dark-400 hover:text-dark-200 transition-colors text-2xl"
        >
          &times;
        </button>
      </div>

      {/* Stats Grid */}
      <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Blocks */}
        <div className="bg-dark-900/50 rounded-lg p-4 text-center">
          <Database className="w-8 h-8 text-quantum-400 mx-auto mb-2" />
          <div className="text-3xl font-bold text-dark-100">{stats.total_blocks}</div>
          <div className="text-dark-400 text-sm">Total Blocks</div>
        </div>

        {/* Documents */}
        <div className="bg-dark-900/50 rounded-lg p-4 text-center">
          <FileText className="w-8 h-8 text-blue-400 mx-auto mb-2" />
          <div className="text-3xl font-bold text-dark-100">{stats.total_documents}</div>
          <div className="text-dark-400 text-sm">Documents</div>
        </div>

        {/* Files Uploaded */}
        <div className="bg-dark-900/50 rounded-lg p-4 text-center">
          <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
          <div className="text-3xl font-bold text-dark-100">{stats.total_files}</div>
          <div className="text-dark-400 text-sm">Files Hashed</div>
        </div>

        {/* Content Size */}
        <div className="bg-dark-900/50 rounded-lg p-4 text-center">
          <Database className="w-8 h-8 text-purple-400 mx-auto mb-2" />
          <div className="text-3xl font-bold text-dark-100">{formatBytes(stats.total_content_size)}</div>
          <div className="text-dark-400 text-sm">Total Content</div>
        </div>
      </div>

      {/* Crypto Info */}
      <div className="px-6 pb-6 grid md:grid-cols-2 gap-4">
        <div className="bg-dark-900/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Cpu className="w-5 h-5 text-quantum-400" />
            <span className="text-dark-200 font-medium">Algorithm</span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-dark-400">Name</span>
              <span className="text-dark-200">{stats.algorithm}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-dark-400">NIST Level</span>
              <span className="text-quantum-400 font-medium">Level {stats.nist_level}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-dark-400">Quantum Safe</span>
              <span className={stats.quantum_safe ? 'text-green-400' : 'text-yellow-400'}>
                {stats.quantum_safe ? 'Yes' : 'Simulated'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-dark-400">Mode</span>
              <span className="text-dark-300 text-xs">{stats.mode}</span>
            </div>
          </div>
        </div>

        <div className="bg-dark-900/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-5 h-5 text-quantum-400" />
            <span className="text-dark-200 font-medium">Timeline</span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-dark-400">Chain Created</span>
              <span className="text-dark-200 text-xs">{formatDate(stats.created_at)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-dark-400">Last Block</span>
              <span className="text-dark-200 text-xs">{formatDate(stats.last_block_at)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-dark-400">Public Key</span>
              <span className="text-dark-200">{stats.public_key_size} bytes</span>
            </div>
            <div className="flex justify-between">
              <span className="text-dark-400">Signature Size</span>
              <span className="text-dark-200">{stats.signature_size} bytes</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
