'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { X, Upload, FileText, File, CheckCircle, Hash } from 'lucide-react'

interface FileUploadModalProps {
  onClose: () => void
  onAdd: (title: string, content: string, fileHash: string, fileName: string, fileSize: number) => void
}

export default function FileUploadModal({ onClose, onAdd }: FileUploadModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [fileHash, setFileHash] = useState<string>('')
  const [hashing, setHashing] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const hashFile = async (file: File): Promise<string> => {
    const buffer = await file.arrayBuffer()
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  }

  const handleFile = async (selectedFile: File) => {
    setFile(selectedFile)
    setTitle(selectedFile.name)
    setHashing(true)

    try {
      const hash = await hashFile(selectedFile)
      setFileHash(hash)
    } catch (error) {
      console.error('Error hashing file:', error)
    } finally {
      setHashing(false)
    }
  }

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !fileHash) return

    setSubmitting(true)
    const content = description || `File: ${file.name} (${formatFileSize(file.size)})`
    await onAdd(title, content, fileHash, file.name, file.size)
    setSubmitting(false)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
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
            <Upload className="w-5 h-5 text-quantum-400" />
            <h2 className="text-lg font-semibold text-dark-100">Upload & Hash File</h2>
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
          {/* Drop Zone */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? 'border-quantum-400 bg-quantum-900/20'
                : 'border-dark-600 hover:border-dark-500'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {file ? (
              <div className="space-y-2">
                <File className="w-12 h-12 text-quantum-400 mx-auto" />
                <p className="text-dark-200 font-medium">{file.name}</p>
                <p className="text-dark-400 text-sm">{formatFileSize(file.size)}</p>
                {hashing ? (
                  <p className="text-quantum-400 text-sm">Calculating SHA-256 hash...</p>
                ) : fileHash ? (
                  <div className="flex items-center justify-center gap-2 text-green-400 text-sm">
                    <CheckCircle className="w-4 h-4" />
                    <span>Hash calculated</span>
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="w-12 h-12 text-dark-500 mx-auto" />
                <p className="text-dark-300">Drag & drop a file here</p>
                <p className="text-dark-500 text-sm">or</p>
                <label className="inline-block cursor-pointer">
                  <span className="bg-dark-700 hover:bg-dark-600 text-dark-200 px-4 py-2 rounded-lg text-sm transition-colors">
                    Browse Files
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileInput}
                  />
                </label>
              </div>
            )}
          </div>

          {/* File Hash Display */}
          {fileHash && (
            <div className="bg-dark-900/50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-dark-300 text-sm mb-1">
                <Hash className="w-4 h-4 text-quantum-400" />
                <span>SHA-256 Hash</span>
              </div>
              <code className="text-quantum-300 text-xs font-mono break-all">{fileHash}</code>
            </div>
          )}

          {/* Title */}
          {file && (
            <div>
              <label className="block text-dark-300 text-sm mb-2">Document Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-dark-900 border border-dark-600 rounded-lg px-4 py-2 text-dark-100 placeholder-dark-500 focus:outline-none focus:border-quantum-500 transition-colors"
                required
              />
            </div>
          )}

          {/* Description */}
          {file && (
            <div>
              <label className="block text-dark-300 text-sm mb-2">Description (optional)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a description for this file..."
                rows={3}
                className="w-full bg-dark-900 border border-dark-600 rounded-lg px-4 py-2 text-dark-100 placeholder-dark-500 focus:outline-none focus:border-quantum-500 transition-colors resize-none"
              />
            </div>
          )}

          {/* Info */}
          <div className="bg-dark-900/50 rounded-lg p-3 text-sm text-dark-400">
            <p>
              <strong className="text-quantum-400">Note:</strong> The file itself is NOT uploaded to the server.
              Only its SHA-256 hash is stored in the blockchain, providing proof of the file's existence and integrity.
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting || !file || !fileHash || hashing}
            className="w-full flex items-center justify-center gap-2 bg-quantum-600 hover:bg-quantum-500 disabled:bg-dark-600 text-white py-3 rounded-lg font-medium transition-colors"
          >
            <Upload className="w-5 h-5" />
            {submitting ? 'Signing & Adding...' : 'Sign File Hash & Add to Chain'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  )
}
