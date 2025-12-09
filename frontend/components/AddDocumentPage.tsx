'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText,
  Upload,
  File,
  X,
  Check,
  Loader2,
  Plus
} from 'lucide-react'

interface FileWithHash {
  file: File
  hash: string | null
  hashing: boolean
}

interface AddDocumentPageProps {
  onAdd: (title: string, content: string, fileHash?: string, fileName?: string, fileSize?: number) => Promise<void>
  isLoading: boolean
}

export default function AddDocumentPage({ onAdd, isLoading }: AddDocumentPageProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [files, setFiles] = useState<FileWithHash[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitProgress, setSubmitProgress] = useState({ current: 0, total: 0 })

  const calculateFileHash = async (file: File): Promise<string> => {
    const buffer = await file.arrayBuffer()
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  }

  const handleFilesSelect = async (selectedFiles: FileList | File[]) => {
    const fileArray = Array.from(selectedFiles)

    // Add files with hashing status
    const newFiles: FileWithHash[] = fileArray.map(file => ({
      file,
      hash: null,
      hashing: true
    }))

    setFiles(prev => [...prev, ...newFiles])

    // Calculate hashes for each file
    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i]
      try {
        const hash = await calculateFileHash(file)
        setFiles(prev => prev.map(f =>
          f.file === file ? { ...f, hash, hashing: false } : f
        ))
      } catch (error) {
        console.error('Error hashing file:', error)
        setFiles(prev => prev.map(f =>
          f.file === file ? { ...f, hashing: false } : f
        ))
      }
    }

    // Auto-fill title and content if empty and single file
    if (fileArray.length === 1 && !title && !content) {
      const file = fileArray[0]
      setTitle(file.name)
      setContent(`File attachment: ${file.name}\nSize: ${(file.size / 1024).toFixed(2)} KB\nType: ${file.type || 'Unknown'}`)
    } else if (fileArray.length > 1 && !title && !content) {
      setTitle(`Batch Upload (${fileArray.length} files)`)
      setContent(fileArray.map(f => `- ${f.name} (${(f.size / 1024).toFixed(2)} KB)`).join('\n'))
    }
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFiles = e.dataTransfer.files
    if (droppedFiles.length > 0) {
      handleFilesSelect(droppedFiles)
    }
  }, [title, content])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return

    setIsSubmitting(true)

    if (files.length === 0) {
      // No files - just add the document
      await onAdd(title, content)
    } else if (files.length === 1) {
      // Single file - add as one document
      const f = files[0]
      await onAdd(
        title,
        content,
        f.hash || undefined,
        f.file.name,
        f.file.size
      )
    } else {
      // Multiple files - add each as separate document
      setSubmitProgress({ current: 0, total: files.length })

      for (let i = 0; i < files.length; i++) {
        const f = files[i]
        setSubmitProgress({ current: i + 1, total: files.length })

        await onAdd(
          f.file.name,
          `File attachment: ${f.file.name}\nSize: ${(f.file.size / 1024).toFixed(2)} KB\nType: ${f.file.type || 'Unknown'}`,
          f.hash || undefined,
          f.file.name,
          f.file.size
        )
      }
    }

    // Reset form
    setTitle('')
    setContent('')
    setFiles([])
    setIsSubmitting(false)
    setSubmitProgress({ current: 0, total: 0 })
  }

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const clearAllFiles = () => {
    setFiles([])
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
  }

  const allFilesHashed = files.length === 0 || files.every(f => !f.hashing)
  const isProcessing = isLoading || isSubmitting

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Add Document</h1>
        <p className="text-gray-500">Create a new document entry in the blockchain with ML-DSA-44 signature</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Document Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter document title..."
            className="w-full px-4 py-3 rounded-xl glass-card border-0 focus:ring-2 focus:ring-black/20 transition-all text-gray-900 placeholder-gray-400"
            required
          />
        </div>

        {/* Content Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Document Content
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter document content..."
            rows={6}
            className="w-full px-4 py-3 rounded-xl glass-card border-0 focus:ring-2 focus:ring-black/20 transition-all text-gray-900 placeholder-gray-400 resize-none"
            required
          />
        </div>

        {/* File Upload Area */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Attach Files (Optional)
            </label>
            {files.length > 0 && (
              <button
                type="button"
                onClick={clearAllFiles}
                className="text-sm text-red-600 hover:text-red-700"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Drop zone */}
          <motion.div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`relative border-2 border-dashed rounded-xl p-6 transition-all ${
              isDragging
                ? 'border-black bg-black/5'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-center">
              <Upload className={`w-8 h-8 mx-auto mb-3 ${isDragging ? 'text-black' : 'text-gray-400'}`} />
              <p className="text-gray-600 mb-1">
                Drag and drop files here, or{' '}
                <label className="text-black font-medium cursor-pointer hover:underline">
                  browse
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      const fileList = e.target.files
                      if (fileList && fileList.length > 0) {
                        handleFilesSelect(fileList)
                      }
                      e.target.value = '' // Reset to allow re-selecting same files
                    }}
                  />
                </label>
              </p>
              <p className="text-sm text-gray-400">
                Select multiple files • Each will be hashed with SHA-256
              </p>
            </div>
          </motion.div>

          {/* File list */}
          <AnimatePresence>
            {files.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 space-y-2"
              >
                {files.length > 1 && (
                  <p className="text-sm text-gray-500 mb-2">
                    {files.length} files selected • Each file will be added as a separate document
                  </p>
                )}
                {files.map((f, index) => (
                  <motion.div
                    key={`${f.file.name}-${index}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className="glass-card rounded-xl p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-black/5 flex items-center justify-center flex-shrink-0">
                        <File className="w-5 h-5 text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate text-sm">{f.file.name}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">{formatFileSize(f.file.size)}</span>
                          {f.hashing ? (
                            <span className="flex items-center gap-1 text-xs text-gray-500">
                              <Loader2 className="w-3 h-3 animate-spin" />
                              Hashing...
                            </span>
                          ) : f.hash ? (
                            <span className="flex items-center gap-1 text-xs text-green-600">
                              <Check className="w-3 h-3" />
                              Hashed
                            </span>
                          ) : null}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="p-1.5 hover:bg-black/5 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          type="submit"
          disabled={isProcessing || !title.trim() || !content.trim() || !allFilesHashed}
          className="w-full py-4 px-6 bg-black text-white rounded-xl font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-900 transition-colors"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>
                {submitProgress.total > 1
                  ? `Signing ${submitProgress.current}/${submitProgress.total} with ML-DSA-44...`
                  : 'Signing with ML-DSA-44...'}
              </span>
            </>
          ) : (
            <>
              <FileText className="w-5 h-5" />
              <span>
                {files.length > 1
                  ? `Add ${files.length} Documents to Blockchain`
                  : 'Add to Blockchain'}
              </span>
            </>
          )}
        </motion.button>
      </form>

      {/* Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8 glass-card rounded-xl p-6"
      >
        <h3 className="font-medium text-gray-900 mb-2">What happens when you add a document?</h3>
        <ol className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-black/10 flex items-center justify-center flex-shrink-0 text-xs font-medium">1</span>
            <span>Your content is hashed using SHA-256</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-black/10 flex items-center justify-center flex-shrink-0 text-xs font-medium">2</span>
            <span>The block is linked to the previous block's hash</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-black/10 flex items-center justify-center flex-shrink-0 text-xs font-medium">3</span>
            <span>Everything is signed with ML-DSA-44 (quantum-resistant)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-black/10 flex items-center justify-center flex-shrink-0 text-xs font-medium">4</span>
            <span>The block is added to the immutable chain</span>
          </li>
        </ol>
      </motion.div>
    </div>
  )
}
