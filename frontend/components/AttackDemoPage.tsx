'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Shield,
  Trash2,
  Shuffle,
  FilePlus,
  Edit3,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Play,
  RotateCcw,
  Info
} from 'lucide-react'

interface AttackResult {
  success: boolean
  message: string
  verificationBefore?: any
  verificationAfter?: any
}

interface AttackDemoPageProps {
  chainLength: number
  onReset: () => Promise<void>
}

export default function AttackDemoPage({ chainLength, onReset }: AttackDemoPageProps) {
  const [selectedAttack, setSelectedAttack] = useState<string | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [result, setResult] = useState<AttackResult | null>(null)
  const [verificationResult, setVerificationResult] = useState<any>(null)

  const attacks = [
    {
      id: 'tamper',
      name: 'Content Modification',
      icon: Edit3,
      color: 'orange',
      description: 'Change the content of a document',
      detectedBy: 'ML-DSA-44 Signature',
      explanation: 'The attacker modifies document content. Even if they update the hash, they cannot forge a valid signature without the private key.',
      whatBreaks: ['Signature verification fails on tampered block', 'Hash chain breaks for all subsequent blocks']
    },
    {
      id: 'delete',
      name: 'Document Deletion',
      icon: Trash2,
      color: 'red',
      description: 'Remove a document from the chain',
      detectedBy: 'Blockchain Hash Chain',
      explanation: 'The attacker deletes a document hoping no one notices. But the next block still references the deleted block\'s hash.',
      whatBreaks: ['Hash link broken - next block points to non-existent block', 'Block indices become inconsistent']
    },
    {
      id: 'reorder',
      name: 'Document Reordering',
      icon: Shuffle,
      color: 'purple',
      description: 'Change the order of documents',
      detectedBy: 'Blockchain Hash Chain',
      explanation: 'The attacker swaps document order to change the historical record. Each block stores its predecessor\'s hash, so any reordering is detected.',
      whatBreaks: ['Previous hash references no longer match', 'Multiple blocks fail verification']
    },
    {
      id: 'insert',
      name: 'Fake Document Insertion',
      icon: FilePlus,
      color: 'blue',
      description: 'Insert a forged document',
      detectedBy: 'Both Signature + Hash Chain',
      explanation: 'The attacker tries to insert a fake document. Without the private key, they cannot create a valid signature. The hash chain also breaks.',
      whatBreaks: ['Signature verification fails (forged signature)', 'Hash chain breaks for subsequent blocks']
    }
  ]

  const runAttack = async (attackId: string) => {
    if (chainLength < 3) {
      alert('Please add at least 2 documents (3 blocks total) before running attack demos.')
      return
    }

    setIsRunning(true)
    setResult(null)
    setVerificationResult(null)
    setSelectedAttack(attackId)

    try {
      let response

      switch (attackId) {
        case 'tamper':
          response = await fetch('/api/tamper/1', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: 'TAMPERED: This content was maliciously changed!' })
          })
          break

        case 'delete':
          response = await fetch('/api/attack/delete/1', {
            method: 'POST'
          })
          break

        case 'reorder':
          response = await fetch('/api/attack/reorder', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ index1: 1, index2: 2 })
          })
          break

        case 'insert':
          response = await fetch('/api/attack/insert/1', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: 'FORGED DOCUMENT',
              content: 'This fake document was inserted by an attacker!'
            })
          })
          break
      }

      if (response) {
        const data = await response.json()

        // Now verify to show the detection
        await new Promise(r => setTimeout(r, 500))
        const verifyResponse = await fetch('/api/verify')
        const verifyData = await verifyResponse.json()

        setVerificationResult(verifyData)
        setResult({
          success: true,
          message: data.message || 'Attack executed'
        })
      }
    } catch (error) {
      setResult({
        success: false,
        message: 'Failed to run attack'
      })
    } finally {
      setIsRunning(false)
    }
  }

  const handleReset = async () => {
    await onReset()
    setResult(null)
    setVerificationResult(null)
    setSelectedAttack(null)
  }

  const getColorClasses = (color: string, isSelected: boolean) => {
    const colors: Record<string, { bg: string, text: string, border: string, hover: string }> = {
      orange: {
        bg: isSelected ? 'bg-orange-100' : 'bg-orange-50',
        text: 'text-orange-600',
        border: isSelected ? 'border-orange-400' : 'border-orange-200',
        hover: 'hover:border-orange-400'
      },
      red: {
        bg: isSelected ? 'bg-red-100' : 'bg-red-50',
        text: 'text-red-600',
        border: isSelected ? 'border-red-400' : 'border-red-200',
        hover: 'hover:border-red-400'
      },
      purple: {
        bg: isSelected ? 'bg-purple-100' : 'bg-purple-50',
        text: 'text-purple-600',
        border: isSelected ? 'border-purple-400' : 'border-purple-200',
        hover: 'hover:border-purple-400'
      },
      blue: {
        bg: isSelected ? 'bg-blue-100' : 'bg-blue-50',
        text: 'text-blue-600',
        border: isSelected ? 'border-blue-400' : 'border-blue-200',
        hover: 'hover:border-blue-400'
      }
    }
    return colors[color]
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Attack Demonstrations</h1>
        <p className="text-gray-500">
          See how the system detects different types of attacks. Each attack shows why we need BOTH signatures AND blockchain.
        </p>
      </div>

      {/* Minimum blocks warning */}
      {chainLength < 3 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <p className="font-medium text-yellow-800">Need more documents</p>
            <p className="text-sm text-yellow-700">
              Add at least 2 documents (you have {chainLength - 1}) to run attack demos.
            </p>
          </div>
        </div>
      )}

      {/* Attack Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {attacks.map((attack) => {
          const colors = getColorClasses(attack.color, selectedAttack === attack.id)
          const Icon = attack.icon

          return (
            <motion.div
              key={attack.id}
              whileHover={{ scale: 1.02 }}
              className={`glass-card rounded-2xl p-6 border-2 cursor-pointer transition-all ${colors.border} ${colors.hover}`}
              onClick={() => setSelectedAttack(attack.id)}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${colors.text}`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{attack.name}</h3>
                  <p className="text-sm text-gray-500 mb-2">{attack.description}</p>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span className="text-xs text-green-600 font-medium">Detected by: {attack.detectedBy}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Selected Attack Details */}
      <AnimatePresence mode="wait">
        {selectedAttack && (
          <motion.div
            key={selectedAttack}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-card rounded-2xl p-6"
          >
            {(() => {
              const attack = attacks.find(a => a.id === selectedAttack)!
              const colors = getColorClasses(attack.color, true)

              return (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center`}>
                        <attack.icon className={`w-5 h-5 ${colors.text}`} />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">{attack.name}</h2>
                        <p className="text-sm text-gray-500">Attack Simulation</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => runAttack(selectedAttack)}
                        disabled={isRunning || chainLength < 3}
                        className={`flex items-center gap-2 px-4 py-2 ${colors.bg} ${colors.text} rounded-lg font-medium disabled:opacity-50`}
                      >
                        <Play className="w-4 h-4" />
                        {isRunning ? 'Running...' : 'Run Attack'}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleReset}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg font-medium"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Reset
                      </motion.button>
                    </div>
                  </div>

                  {/* Explanation */}
                  <div className="bg-gray-50 rounded-xl p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-gray-700 mb-3">{attack.explanation}</p>
                        <p className="font-medium text-gray-900 mb-2">What verification will detect:</p>
                        <ul className="space-y-1">
                          {attack.whatBreaks.map((item, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                              <XCircle className="w-4 h-4 text-red-500" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Results */}
                  {result && verificationResult && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-4"
                    >
                      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <AlertTriangle className="w-5 h-5 text-red-600" />
                          <span className="font-semibold text-red-700">Attack Executed: {result.message}</span>
                        </div>
                        <p className="text-sm text-red-600">Now see how verification detects this attack...</p>
                      </div>

                      <div className={`rounded-xl p-4 ${
                        verificationResult.is_valid
                          ? 'bg-green-50 border border-green-200'
                          : 'bg-red-50 border border-red-200'
                      }`}>
                        <div className="flex items-center gap-2 mb-4">
                          {verificationResult.is_valid ? (
                            <>
                              <CheckCircle className="w-6 h-6 text-green-600" />
                              <span className="font-semibold text-green-700">Chain Valid (This shouldn't happen!)</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-6 h-6 text-red-600" />
                              <span className="font-semibold text-red-700">ATTACK DETECTED! Chain Invalid</span>
                            </>
                          )}
                        </div>

                        <div className="space-y-2">
                          {verificationResult.blocks?.map((block: any, i: number) => (
                            <div
                              key={i}
                              className={`flex items-center justify-between p-3 rounded-lg ${
                                block.is_valid ? 'bg-green-100' : 'bg-red-100'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <span className={`font-bold ${block.is_valid ? 'text-green-700' : 'text-red-700'}`}>
                                  #{block.index}
                                </span>
                                <span className="text-gray-700">{block.title}</span>
                              </div>
                              <div className="flex items-center gap-4 text-sm">
                                <span className={block.signature_valid ? 'text-green-600' : 'text-red-600'}>
                                  Sig: {block.signature_valid ? '✓' : '✗'}
                                </span>
                                <span className={block.hash_link_valid ? 'text-green-600' : 'text-red-600'}>
                                  Link: {block.hash_link_valid ? '✓' : '✗'}
                                </span>
                                {block.is_valid ? (
                                  <CheckCircle className="w-5 h-5 text-green-600" />
                                ) : (
                                  <XCircle className="w-5 h-5 text-red-600" />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </>
              )
            })()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Summary Card */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Why We Need Both Signatures AND Blockchain</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-blue-700">ML-DSA-44 Signatures Detect:</span>
            </div>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>• Content modification (someone changed the text)</li>
              <li>• Fake document insertion (forged signatures fail)</li>
              <li>• Proves WHO signed the document</li>
            </ul>
          </div>
          <div className="bg-purple-50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-5 h-5 text-purple-600" />
              <span className="font-medium text-purple-700">Blockchain Hash Chain Detects:</span>
            </div>
            <ul className="space-y-2 text-sm text-purple-800">
              <li>• Document deletion (gaps in the chain)</li>
              <li>• Document reordering (wrong predecessors)</li>
              <li>• Proves the ORDER and COMPLETENESS of history</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
