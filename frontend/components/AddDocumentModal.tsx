'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, FileText, Send } from 'lucide-react'

interface AddDocumentModalProps {
  onClose: () => void
  onAdd: (title: string, content: string) => void
}

export default function AddDocumentModal({ onClose, onAdd }: AddDocumentModalProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return

    setSubmitting(true)
    await onAdd(title, content)
    setSubmitting(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-dark-800 rounded-xl w-full max-w-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-dark-600">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-quantum-400" />
            <h2 className="text-lg font-semibold text-dark-100">Add New Document</h2>
          </div>
          <button
            onClick={onClose}
            className="text-dark-400 hover:text-dark-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-dark-300 text-sm mb-2">Document Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Contract Agreement"
              className="w-full bg-dark-900 border border-dark-600 rounded-lg px-4 py-2 text-dark-100 placeholder-dark-500 focus:outline-none focus:border-quantum-500 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-dark-300 text-sm mb-2">Document Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter the document content that will be signed..."
              rows={6}
              className="w-full bg-dark-900 border border-dark-600 rounded-lg px-4 py-2 text-dark-100 placeholder-dark-500 focus:outline-none focus:border-quantum-500 transition-colors resize-none"
              required
            />
          </div>

          <div className="bg-dark-900/50 rounded-lg p-3 text-sm text-dark-400">
            <p>
              <strong className="text-quantum-400">How it works:</strong> Your document will be hashed using SHA-256,
              linked to the previous block, and then signed using ML-DSA-44 (a quantum-resistant digital signature algorithm).
            </p>
          </div>

          <button
            type="submit"
            disabled={submitting || !title.trim() || !content.trim()}
            className="w-full flex items-center justify-center gap-2 bg-quantum-600 hover:bg-quantum-500 disabled:bg-dark-600 text-white py-3 rounded-lg font-medium transition-colors"
          >
            <Send className="w-5 h-5" />
            {submitting ? 'Signing & Adding...' : 'Sign & Add to Chain'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  )
}
