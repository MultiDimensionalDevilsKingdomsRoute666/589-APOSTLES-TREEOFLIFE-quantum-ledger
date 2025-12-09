'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { AnimatePresence } from 'framer-motion'
import Sidebar from '@/components/Sidebar'
import DashboardPage from '@/components/DashboardPage'
import AddDocumentPage from '@/components/AddDocumentPage'
import VerifyPage from '@/components/VerifyPage'
import AboutPage from '@/components/AboutPage'
import HowItWorksPage from '@/components/HowItWorksPage'
import AttackDemoPage from '@/components/AttackDemoPage'
import BlockDetailModal from '@/components/BlockDetailModal'
import SigningAnimation from '@/components/SigningAnimation'

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

interface VerificationResult {
  is_valid: boolean
  blocks: Verification[]
  total_blocks: number
}

interface KeyInfo {
  algorithm: string
  algorithm_name: string
  nist_level: number
  public_key_size: number
  public_key_preview: string
  signature_size: number
  quantum_safe: boolean
  mode: string
}

type Page = 'dashboard' | 'add' | 'verify' | 'how-it-works' | 'attack-demo' | 'about'

export default function Home() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard')
  const [chain, setChain] = useState<Block[]>([])
  const [loading, setLoading] = useState(true)
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null)
  const [verifying, setVerifying] = useState(false)
  const [keyInfo, setKeyInfo] = useState<KeyInfo | null>(null)
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null)
  const [showSigningAnimation, setShowSigningAnimation] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Create verification results map
  const verificationMap = useMemo(() => {
    const map = new Map<number, Verification>()
    if (verificationResult) {
      verificationResult.blocks.forEach(v => map.set(v.index, v))
    }
    return map
  }, [verificationResult])

  const fetchChain = async () => {
    try {
      const response = await fetch('/api/chain')
      const data = await response.json()
      setChain(data.chain)
    } catch (error) {
      console.error('Failed to fetch chain:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchKeyInfo = async () => {
    try {
      const response = await fetch('/api/keys')
      const data = await response.json()
      setKeyInfo(data)
    } catch (error) {
      console.error('Failed to fetch key info:', error)
    }
  }

  useEffect(() => {
    fetchChain()
    fetchKeyInfo()
  }, [])

  const handleAddDocument = async (
    title: string,
    content: string,
    fileHash?: string,
    fileName?: string,
    fileSize?: number
  ) => {
    setIsAdding(true)
    setShowSigningAnimation(true)

    try {
      const response = await fetch('/api/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          file_hash: fileHash,
          file_name: fileName,
          file_size: fileSize
        })
      })

      // Keep animation for at least 2 seconds
      await new Promise(resolve => setTimeout(resolve, 2000))

      if (response.ok) {
        await fetchChain()
        setVerificationResult(null)
        setCurrentPage('dashboard')
      }
    } catch (error) {
      console.error('Failed to add document:', error)
    } finally {
      setShowSigningAnimation(false)
      setIsAdding(false)
    }
  }

  const handleVerify = async () => {
    setVerifying(true)
    setVerificationResult(null)

    await new Promise(resolve => setTimeout(resolve, 1000))

    try {
      const response = await fetch('/api/verify')
      const data = await response.json()
      setVerificationResult(data)
    } catch (error) {
      console.error('Verification failed:', error)
    } finally {
      setVerifying(false)
    }
  }

  const handleTamper = async (blockIndex: number) => {
    console.log('handleTamper called with index:', blockIndex)
    try {
      const response = await fetch(`/api/tamper/${blockIndex}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: 'TAMPERED: This document has been maliciously modified!' })
      })
      console.log('Tamper response:', response.status, response.ok)

      if (response.ok) {
        await fetchChain()
        setVerificationResult(null)
      } else {
        const errorData = await response.json()
        console.error('Tamper failed:', errorData)
      }
    } catch (error) {
      console.error('Tamper failed:', error)
    }
  }

  const handleDelete = async (blockIndex: number) => {
    console.log('handleDelete called with index:', blockIndex)
    try {
      const response = await fetch(`/api/attack/delete/${blockIndex}`, {
        method: 'POST'
      })
      console.log('Delete response:', response.status, response.ok)

      if (response.ok) {
        await fetchChain()
        setVerificationResult(null)
      } else {
        const errorData = await response.json()
        console.error('Delete failed:', errorData)
      }
    } catch (error) {
      console.error('Delete attack failed:', error)
    }
  }

  const handleReorder = async (index1: number, index2: number) => {
    try {
      const response = await fetch('/api/attack/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ index1, index2 })
      })

      if (response.ok) {
        await fetchChain()
        setVerificationResult(null)
      }
    } catch (error) {
      console.error('Reorder attack failed:', error)
    }
  }

  const handleInsert = async (position: number) => {
    try {
      const response = await fetch(`/api/attack/insert/${position}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'FORGED DOCUMENT',
          content: 'This fake document was inserted by an attacker!'
        })
      })

      if (response.ok) {
        await fetchChain()
        setVerificationResult(null)
      }
    } catch (error) {
      console.error('Insert attack failed:', error)
    }
  }

  const handleReset = async (skipConfirm = false) => {
    if (!skipConfirm && !confirm('Are you sure you want to reset the ledger? This will delete all documents.')) {
      return
    }

    try {
      await fetch('/api/reset', { method: 'POST' })
      await fetchChain()
      await fetchKeyInfo()
      setVerificationResult(null)
    } catch (error) {
      console.error('Reset failed:', error)
    }
  }

  const handleExport = async () => {
    try {
      window.open('/api/export/download', '_blank')
    } catch (error) {
      console.error('Export failed:', error)
    }
  }

  const handleImport = () => {
    fileInputRef.current?.click()
  }

  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      const data = JSON.parse(text)

      const response = await fetch('/api/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        await fetchChain()
        setVerificationResult(null)
      }
    } catch (error) {
      console.error('Import failed:', error)
      alert('Failed to import chain. Make sure the file is a valid JSON export.')
    }

    // Reset input
    event.target.value = ''
  }

  const getBlockVerification = (index: number) => {
    return verificationMap.get(index)
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <DashboardPage
            chain={chain}
            verificationResults={verificationMap}
            onBlockClick={setSelectedBlock}
            onTamper={handleTamper}
            onDelete={handleDelete}
            onReorder={handleReorder}
            onInsert={handleInsert}
          />
        )
      case 'add':
        return (
          <AddDocumentPage
            onAdd={handleAddDocument}
            isLoading={isAdding}
          />
        )
      case 'verify':
        return (
          <VerifyPage
            onVerify={handleVerify}
            verificationResults={verificationMap}
            isVerifying={verifying}
            chainLength={chain.length}
          />
        )
      case 'about':
        return <AboutPage keyInfo={keyInfo} />
      case 'how-it-works':
        return <HowItWorksPage />
      case 'attack-demo':
        return <AttackDemoPage chainLength={chain.length} onReset={() => handleReset(true)} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hidden file input for import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        className="hidden"
        onChange={handleFileImport}
      />

      {/* Sidebar */}
      <Sidebar
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onExport={handleExport}
        onImport={handleImport}
        onReset={handleReset}
        documentCount={chain.length}
      />

      {/* Main Content */}
      <main className="ml-64 min-h-screen p-8">
        <div className="max-w-none px-4">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
            </div>
          ) : (
            renderPage()
          )}
        </div>
      </main>

      {/* Block Detail Modal */}
      <AnimatePresence>
        {selectedBlock && (
          <BlockDetailModal
            block={selectedBlock}
            verification={getBlockVerification(selectedBlock.index)}
            onClose={() => setSelectedBlock(null)}
          />
        )}
      </AnimatePresence>

      {/* Signing Animation */}
      <SigningAnimation isVisible={showSigningAnimation} />
    </div>
  )
}
