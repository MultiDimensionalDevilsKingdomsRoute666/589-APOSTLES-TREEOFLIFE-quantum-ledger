'use client'

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText,
  Clock,
  Shield,
  CheckCircle,
  XCircle,
  ChevronRight,
  File,
  AlertTriangle,
  Link as LinkIcon,
  MoreVertical,
  Edit3,
  Trash2,
  Shuffle,
  FilePlus
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

interface DashboardPageProps {
  chain: Block[]
  verificationResults: Map<number, Verification>
  onBlockClick: (block: Block) => void
  onTamper: (index: number) => void
  onDelete: (index: number) => void
  onReorder: (index1: number, index2: number) => void
  onInsert: (position: number) => void
}

export default function DashboardPage({
  chain,
  verificationResults,
  onBlockClick,
  onTamper,
  onDelete,
  onReorder,
  onInsert
}: DashboardPageProps) {
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null)
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null)
  const menuButtonRefs = useRef<Map<number, HTMLButtonElement>>(new Map())

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  const getVerification = (index: number) => {
    return verificationResults.get(index)
  }

  const handleMenuToggle = (e: React.MouseEvent, index: number) => {
    e.stopPropagation()
    e.preventDefault()

    if (openMenuIndex === index) {
      setOpenMenuIndex(null)
      setMenuPosition(null)
    } else {
      const button = menuButtonRefs.current.get(index)
      if (button) {
        const rect = button.getBoundingClientRect()
        setMenuPosition({
          top: rect.bottom + 8,
          left: rect.right - 180
        })
      }
      setOpenMenuIndex(index)
    }
  }

  const handleAction = (action: () => void) => {
    action()
    setOpenMenuIndex(null)
    setMenuPosition(null)
  }

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (openMenuIndex !== null) {
        setOpenMenuIndex(null)
        setMenuPosition(null)
      }
    }

    if (openMenuIndex !== null) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [openMenuIndex])

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Document Chain</h1>
        <p className="text-gray-500">
          {chain.length} {chain.length === 1 ? 'block' : 'blocks'} in the chain • Click block to view details • Use menu for attack demos
        </p>
      </div>

      {/* Attack Legend */}
      <div className="mb-6 p-4 bg-gray-50 rounded-xl">
        <p className="text-sm font-medium text-gray-700 mb-2">Attack Demo Options (click ⋮ on any block):</p>
        <div className="flex flex-wrap gap-4 text-xs">
          <span className="flex items-center gap-1 text-orange-600">
            <Edit3 className="w-3 h-3" /> Modify Content
          </span>
          <span className="flex items-center gap-1 text-red-600">
            <Trash2 className="w-3 h-3" /> Delete Block
          </span>
          <span className="flex items-center gap-1 text-purple-600">
            <Shuffle className="w-3 h-3" /> Swap with Next
          </span>
          <span className="flex items-center gap-1 text-blue-600">
            <FilePlus className="w-3 h-3" /> Insert Fake Before
          </span>
        </div>
      </div>

      {/* Chain Visualization - Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {chain.map((block, index) => {
          const verification = getVerification(block.index)
          const hasFile = block.file_hash && block.file_name
          const isGenesis = block.index === 0
          const canSwap = index < chain.length - 1 && block.index > 0

          return (
            <motion.div
              key={block.index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02, y: -4 }}
              onClick={() => onBlockClick(block)}
              className={`block-card glass-card rounded-2xl p-5 cursor-pointer relative ${
                verification
                  ? verification.is_valid
                    ? 'ring-1 ring-green-200'
                    : 'ring-1 ring-red-200'
                  : ''
              }`}
            >
              {/* Chain connector indicator */}
              {index > 0 && (
                <div className={`absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-8 rounded-r ${
                  verification && !verification.hash_link_valid ? 'bg-red-400' : 'bg-gray-200'
                }`} />
              )}

              <div className="flex items-start gap-4">
                {/* Block Number */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  verification
                    ? verification.is_valid
                      ? 'bg-green-50 text-green-600'
                      : 'bg-red-50 text-red-600'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  <span className="text-lg font-bold">#{block.index}</span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-semibold text-gray-900 truncate">{block.title}</h3>
                    {isGenesis && (
                      <span className="text-xs bg-black/5 text-gray-600 px-2 py-0.5 rounded-full">
                        Genesis
                      </span>
                    )}
                    {hasFile && (
                      <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <File className="w-3 h-3" />
                        File
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                    <Clock className="w-3 h-3" />
                    <span>{formatDate(block.timestamp)}</span>
                  </div>

                  <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                    {block.content}
                  </p>

                  {/* Verification Status */}
                  {verification && (
                    <div className={`flex items-center gap-2 text-xs ${
                      verification.is_valid ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {verification.is_valid ? (
                        <>
                          <CheckCircle className="w-3 h-3" />
                          <span>Verified</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3" />
                          <span className="truncate">{verification.errors[0] || 'Verification failed'}</span>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions Menu Button */}
                <button
                  ref={(el) => {
                    if (el) menuButtonRefs.current.set(index, el)
                  }}
                  onClick={(e) => handleMenuToggle(e, index)}
                  className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>

              {/* Hash preview */}
              <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2">
                <Shield className="w-3 h-3 text-gray-400" />
                <code className="text-xs text-gray-400 truncate flex-1">
                  {block.signature.slice(0, 30)}...
                </code>
                {index > 0 && (
                  <div className={`flex items-center gap-1 text-xs ${
                    verification && !verification.hash_link_valid ? 'text-red-400' : 'text-gray-400'
                  }`}>
                    <LinkIcon className="w-3 h-3" />
                    <span>←#{block.index - 1}</span>
                  </div>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Empty State */}
      {chain.length === 0 && (
        <div className="text-center py-16">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No documents yet</h3>
          <p className="text-gray-500">Add your first document to start the blockchain</p>
        </div>
      )}

      {/* Dropdown Menu Portal */}
      {openMenuIndex !== null && menuPosition && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 z-[9999]"
          onClick={() => {
            setOpenMenuIndex(null)
            setMenuPosition(null)
          }}
        >
          <div
            className="absolute bg-white rounded-xl shadow-2xl border border-gray-200 py-2 min-w-[180px]"
            style={{
              top: menuPosition.top,
              left: Math.max(10, menuPosition.left)
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              const blockIndex = openMenuIndex
              const arrayIndex = chain.findIndex((_, i) => i === openMenuIndex)
              const block = chain[arrayIndex]
              const isGenesis = arrayIndex === 0
              const canSwap = arrayIndex < chain.length - 1 && arrayIndex > 0

              if (isGenesis) {
                return (
                  <div className="px-4 py-2.5 text-sm text-gray-400">
                    Genesis block protected
                  </div>
                )
              }

              return (
                <>
                  <button
                    onClick={() => handleAction(() => onTamper(arrayIndex))}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-orange-600 hover:bg-orange-50 transition-colors text-left"
                  >
                    <Edit3 className="w-4 h-4" />
                    Modify Content
                  </button>
                  <button
                    onClick={() => handleAction(() => onDelete(arrayIndex))}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Block
                  </button>
                  {canSwap && (
                    <button
                      onClick={() => handleAction(() => onReorder(arrayIndex, arrayIndex + 1))}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-purple-600 hover:bg-purple-50 transition-colors text-left"
                    >
                      <Shuffle className="w-4 h-4" />
                      Swap with Next
                    </button>
                  )}
                  <button
                    onClick={() => handleAction(() => onInsert(arrayIndex))}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-blue-600 hover:bg-blue-50 transition-colors text-left"
                  >
                    <FilePlus className="w-4 h-4" />
                    Insert Fake Before
                  </button>
                </>
              )
            })()}
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
