'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText,
  Hash,
  Link as LinkIcon,
  Shield,
  CheckCircle,
  XCircle,
  Play,
  RotateCcw,
  AlertTriangle,
  ArrowRight,
  ArrowDown
} from 'lucide-react'

type DemoStep = 'idle' | 'typing' | 'hashing' | 'linking' | 'signing' | 'complete'
type TamperStep = 'idle' | 'original' | 'tampering' | 'tampered' | 'verifying' | 'failed'

export default function HowItWorksPage() {
  const [activeDemo, setActiveDemo] = useState<'signing' | 'tampering'>('signing')
  const [signingStep, setSigningStep] = useState<DemoStep>('idle')
  const [tamperStep, setTamperStep] = useState<TamperStep>('idle')
  const [typedContent, setTypedContent] = useState('')
  const [currentHash, setCurrentHash] = useState('')
  const [showSignature, setShowSignature] = useState(false)

  const sampleContent = "Hello World!"
  const sampleHash = "7f83b1657ff1fc..."
  const fullHash = "7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069"

  // Signing Demo Animation
  const runSigningDemo = async () => {
    setSigningStep('typing')
    setTypedContent('')
    setCurrentHash('')
    setShowSignature(false)

    // Type content letter by letter
    for (let i = 0; i <= sampleContent.length; i++) {
      await new Promise(r => setTimeout(r, 100))
      setTypedContent(sampleContent.slice(0, i))
    }

    await new Promise(r => setTimeout(r, 500))
    setSigningStep('hashing')

    // Show hash being calculated
    for (let i = 0; i <= sampleHash.length; i++) {
      await new Promise(r => setTimeout(r, 50))
      setCurrentHash(sampleHash.slice(0, i))
    }

    await new Promise(r => setTimeout(r, 800))
    setSigningStep('linking')

    await new Promise(r => setTimeout(r, 1200))
    setSigningStep('signing')

    await new Promise(r => setTimeout(r, 1500))
    setShowSignature(true)
    setSigningStep('complete')
  }

  // Tamper Demo Animation
  const runTamperDemo = async () => {
    setTamperStep('original')
    await new Promise(r => setTimeout(r, 1500))

    setTamperStep('tampering')
    await new Promise(r => setTimeout(r, 2000))

    setTamperStep('tampered')
    await new Promise(r => setTimeout(r, 1500))

    setTamperStep('verifying')
    await new Promise(r => setTimeout(r, 2000))

    setTamperStep('failed')
  }

  const resetDemo = () => {
    setSigningStep('idle')
    setTamperStep('idle')
    setTypedContent('')
    setCurrentHash('')
    setShowSignature(false)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">How It Works</h1>
        <p className="text-gray-500">Interactive visual explanation of the blockchain signing process</p>
      </div>

      {/* Demo Selector */}
      <div className="flex gap-4">
        <button
          onClick={() => { resetDemo(); setActiveDemo('signing'); }}
          className={`px-6 py-3 rounded-xl font-medium transition-all ${
            activeDemo === 'signing'
              ? 'bg-black text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Document Signing
        </button>
        <button
          onClick={() => { resetDemo(); setActiveDemo('tampering'); }}
          className={`px-6 py-3 rounded-xl font-medium transition-all ${
            activeDemo === 'tampering'
              ? 'bg-black text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Tamper Detection
        </button>
      </div>

      {/* Signing Demo */}
      {activeDemo === 'signing' && (
        <div className="glass-card rounded-2xl p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-semibold text-gray-900">How a Document Gets Signed</h2>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={runSigningDemo}
                disabled={signingStep !== 'idle' && signingStep !== 'complete'}
                className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg disabled:opacity-50"
              >
                <Play className="w-4 h-4" />
                {signingStep === 'idle' ? 'Start Demo' : signingStep === 'complete' ? 'Run Again' : 'Running...'}
              </motion.button>
              {signingStep !== 'idle' && (
                <button onClick={resetDemo} className="p-2 hover:bg-gray-100 rounded-lg">
                  <RotateCcw className="w-5 h-5 text-gray-500" />
                </button>
              )}
            </div>
          </div>

          {/* Visual Steps */}
          <div className="grid grid-cols-5 gap-4 mb-8">
            {/* Step 1: Document */}
            <div className={`text-center transition-all duration-500 ${signingStep === 'typing' ? 'scale-110' : ''}`}>
              <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-3 transition-all ${
                signingStep !== 'idle' ? 'bg-blue-100' : 'bg-gray-100'
              }`}>
                <FileText className={`w-8 h-8 ${signingStep !== 'idle' ? 'text-blue-600' : 'text-gray-400'}`} />
              </div>
              <p className="font-medium text-gray-900">1. Document</p>
              <p className="text-xs text-gray-500">Your content</p>
            </div>

            <div className="flex items-center justify-center">
              <ArrowRight className={`w-6 h-6 transition-colors ${signingStep === 'hashing' ? 'text-black' : 'text-gray-300'}`} />
            </div>

            {/* Step 2: Hash */}
            <div className={`text-center transition-all duration-500 ${signingStep === 'hashing' ? 'scale-110' : ''}`}>
              <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-3 transition-all ${
                ['hashing', 'linking', 'signing', 'complete'].includes(signingStep) ? 'bg-purple-100' : 'bg-gray-100'
              }`}>
                <Hash className={`w-8 h-8 ${['hashing', 'linking', 'signing', 'complete'].includes(signingStep) ? 'text-purple-600' : 'text-gray-400'}`} />
              </div>
              <p className="font-medium text-gray-900">2. Hash</p>
              <p className="text-xs text-gray-500">SHA-256 fingerprint</p>
            </div>

            <div className="flex items-center justify-center">
              <ArrowRight className={`w-6 h-6 transition-colors ${signingStep === 'linking' ? 'text-black' : 'text-gray-300'}`} />
            </div>

            {/* Step 3: Link */}
            <div className={`text-center transition-all duration-500 ${signingStep === 'linking' ? 'scale-110' : ''}`}>
              <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-3 transition-all ${
                ['linking', 'signing', 'complete'].includes(signingStep) ? 'bg-orange-100' : 'bg-gray-100'
              }`}>
                <LinkIcon className={`w-8 h-8 ${['linking', 'signing', 'complete'].includes(signingStep) ? 'text-orange-600' : 'text-gray-400'}`} />
              </div>
              <p className="font-medium text-gray-900">3. Link</p>
              <p className="text-xs text-gray-500">Previous block hash</p>
            </div>
          </div>

          {/* Signing Step */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-4">
              <ArrowDown className={`w-6 h-6 transition-colors ${signingStep === 'signing' ? 'text-black' : 'text-gray-300'}`} />
              <div className={`text-center transition-all duration-500 ${signingStep === 'signing' ? 'scale-110' : ''}`}>
                <div className={`w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-3 transition-all ${
                  ['signing', 'complete'].includes(signingStep) ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  <Shield className={`w-10 h-10 ${['signing', 'complete'].includes(signingStep) ? 'text-green-600' : 'text-gray-400'}`} />
                </div>
                <p className="font-medium text-gray-900">4. Sign with ML-DSA-44</p>
                <p className="text-xs text-gray-500">Quantum-resistant signature</p>
              </div>
              <ArrowDown className={`w-6 h-6 transition-colors ${signingStep === 'complete' ? 'text-black' : 'text-gray-300'}`} />
            </div>
          </div>

          {/* Live Preview */}
          <div className="grid grid-cols-2 gap-6">
            {/* Input */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Document Content
              </h3>
              <div className="bg-white rounded-lg p-4 min-h-[80px] font-mono text-lg">
                {typedContent || <span className="text-gray-300">Waiting...</span>}
                {signingStep === 'typing' && (
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="inline-block w-0.5 h-5 bg-black ml-1"
                  />
                )}
              </div>
            </div>

            {/* Output */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                <Hash className="w-4 h-4" />
                SHA-256 Hash (Fingerprint)
              </h3>
              <div className="bg-white rounded-lg p-4 min-h-[80px]">
                {currentHash ? (
                  <code className="text-purple-600 text-sm break-all">{currentHash}</code>
                ) : (
                  <span className="text-gray-300 text-sm">Hash will appear here...</span>
                )}
              </div>
            </div>
          </div>

          {/* Signature Result */}
          <AnimatePresence>
            {showSignature && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 bg-green-50 border border-green-200 rounded-xl p-6"
              >
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <h3 className="font-semibold text-green-700">Document Signed Successfully!</h3>
                </div>
                <p className="text-sm text-green-600 mb-2">ML-DSA-44 Signature Generated:</p>
                <code className="text-xs text-green-700 bg-green-100 px-3 py-2 rounded block overflow-hidden">
                  4xdQU3LBfpI6HLc17FOPq87RzXchu/yTo31NdfTX...
                </code>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Explanation */}
          <div className="mt-8 p-6 bg-blue-50 rounded-xl">
            <h3 className="font-semibold text-blue-900 mb-3">What just happened?</h3>
            <div className="grid grid-cols-2 gap-4 text-sm text-blue-800">
              <div className="flex items-start gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-200 flex items-center justify-center flex-shrink-0 text-xs font-bold">1</span>
                <p>Your text "Hello World!" was taken as input</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-200 flex items-center justify-center flex-shrink-0 text-xs font-bold">2</span>
                <p>SHA-256 created a unique fingerprint (same input = same hash, always)</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-200 flex items-center justify-center flex-shrink-0 text-xs font-bold">3</span>
                <p>The previous block's hash was added to link the chain</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-200 flex items-center justify-center flex-shrink-0 text-xs font-bold">4</span>
                <p>ML-DSA-44 signed everything with a quantum-resistant signature</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tampering Demo */}
      {activeDemo === 'tampering' && (
        <div className="glass-card rounded-2xl p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-semibold text-gray-900">How Tampering is Detected</h2>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={runTamperDemo}
                disabled={tamperStep !== 'idle' && tamperStep !== 'failed'}
                className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg disabled:opacity-50"
              >
                <Play className="w-4 h-4" />
                {tamperStep === 'idle' ? 'Start Demo' : tamperStep === 'failed' ? 'Run Again' : 'Running...'}
              </motion.button>
              {tamperStep !== 'idle' && (
                <button onClick={resetDemo} className="p-2 hover:bg-gray-100 rounded-lg">
                  <RotateCcw className="w-5 h-5 text-gray-500" />
                </button>
              )}
            </div>
          </div>

          {/* Visual Chain */}
          <div className="flex items-center justify-center gap-4 mb-8">
            {/* Block 0 */}
            <motion.div
              className={`p-4 rounded-xl border-2 transition-all ${
                tamperStep === 'failed' ? 'bg-green-50 border-green-300' : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="text-center">
                <div className="w-12 h-12 mx-auto rounded-lg bg-gray-200 flex items-center justify-center mb-2 font-bold text-gray-600">
                  #0
                </div>
                <p className="text-sm font-medium">Genesis</p>
                <p className="text-xs text-gray-500">prev: 0000...</p>
                <p className="text-xs text-gray-500">hash: abc1...</p>
                {tamperStep === 'failed' && (
                  <CheckCircle className="w-5 h-5 text-green-500 mx-auto mt-2" />
                )}
              </div>
            </motion.div>

            <div className="flex flex-col items-center">
              <div className={`w-8 h-1 rounded ${tamperStep === 'failed' ? 'bg-red-400' : 'bg-gray-300'}`} />
              {tamperStep === 'failed' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-red-500 mt-1"
                >
                  BROKEN!
                </motion.div>
              )}
            </div>

            {/* Block 1 - The tampered one */}
            <motion.div
              animate={{
                scale: tamperStep === 'tampering' ? [1, 1.1, 1] : 1,
                borderColor: tamperStep === 'tampered' || tamperStep === 'verifying' || tamperStep === 'failed'
                  ? '#ef4444'
                  : tamperStep === 'original' ? '#22c55e' : '#e5e7eb'
              }}
              transition={{ duration: 0.5 }}
              className={`p-4 rounded-xl border-2 transition-all ${
                tamperStep === 'failed' ? 'bg-red-50' :
                tamperStep === 'original' ? 'bg-green-50' : 'bg-gray-50'
              }`}
            >
              <div className="text-center">
                <div className={`w-12 h-12 mx-auto rounded-lg flex items-center justify-center mb-2 font-bold ${
                  tamperStep === 'failed' ? 'bg-red-200 text-red-600' :
                  tamperStep === 'original' ? 'bg-green-200 text-green-600' : 'bg-gray-200 text-gray-600'
                }`}>
                  #1
                </div>
                <p className="text-sm font-medium">
                  {tamperStep === 'tampering' && (
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.3, repeat: Infinity }}
                    >
                      Changing...
                    </motion.span>
                  )}
                  {tamperStep === 'original' && 'Document A'}
                  {(tamperStep === 'tampered' || tamperStep === 'verifying' || tamperStep === 'failed') && (
                    <span className="text-red-600">HACKED!</span>
                  )}
                  {tamperStep === 'idle' && 'Document A'}
                </p>
                <p className="text-xs text-gray-500">prev: abc1...</p>
                <p className="text-xs text-gray-500">
                  hash: {tamperStep === 'tampered' || tamperStep === 'verifying' || tamperStep === 'failed'
                    ? <span className="text-red-500">xyz9...</span>
                    : 'def2...'}
                </p>
                {tamperStep === 'failed' && (
                  <div className="mt-2">
                    <XCircle className="w-5 h-5 text-red-500 mx-auto" />
                    <p className="text-xs text-red-500">Signature Invalid!</p>
                  </div>
                )}
              </div>
            </motion.div>

            <div className="flex flex-col items-center">
              <div className={`w-8 h-1 rounded ${tamperStep === 'failed' ? 'bg-red-400' : 'bg-gray-300'}`} />
              {tamperStep === 'failed' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-red-500 mt-1"
                >
                  BROKEN!
                </motion.div>
              )}
            </div>

            {/* Block 2 */}
            <motion.div
              className={`p-4 rounded-xl border-2 transition-all ${
                tamperStep === 'failed' ? 'bg-red-50 border-red-300' : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="text-center">
                <div className={`w-12 h-12 mx-auto rounded-lg flex items-center justify-center mb-2 font-bold ${
                  tamperStep === 'failed' ? 'bg-red-200 text-red-600' : 'bg-gray-200 text-gray-600'
                }`}>
                  #2
                </div>
                <p className="text-sm font-medium">Document B</p>
                <p className="text-xs text-gray-500">prev: def2...</p>
                <p className="text-xs text-gray-500">hash: ghi3...</p>
                {tamperStep === 'failed' && (
                  <div className="mt-2">
                    <XCircle className="w-5 h-5 text-red-500 mx-auto" />
                    <p className="text-xs text-red-500">Chain Broken!</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Status Messages */}
          <div className="min-h-[100px]">
            <AnimatePresence mode="wait">
              {tamperStep === 'original' && (
                <motion.div
                  key="original"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-green-50 border border-green-200 rounded-xl p-4 text-center"
                >
                  <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="font-medium text-green-700">Original Chain - All Valid</p>
                  <p className="text-sm text-green-600">Every block's hash matches, signatures are valid</p>
                </motion.div>
              )}

              {tamperStep === 'tampering' && (
                <motion.div
                  key="tampering"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-center"
                >
                  <AlertTriangle className="w-8 h-8 text-orange-500 mx-auto mb-2 animate-pulse" />
                  <p className="font-medium text-orange-700">Attacker Modifying Block #1...</p>
                  <p className="text-sm text-orange-600">Changing "Document A" to "HACKED!"</p>
                </motion.div>
              )}

              {tamperStep === 'tampered' && (
                <motion.div
                  key="tampered"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center"
                >
                  <AlertTriangle className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                  <p className="font-medium text-yellow-700">Block Modified!</p>
                  <p className="text-sm text-yellow-600">Attacker also updated the hash (trying to hide their tracks)</p>
                  <p className="text-sm text-yellow-600">But they can't forge the ML-DSA-44 signature!</p>
                </motion.div>
              )}

              {tamperStep === 'verifying' && (
                <motion.div
                  key="verifying"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center"
                >
                  <Shield className="w-8 h-8 text-blue-500 mx-auto mb-2 animate-spin" />
                  <p className="font-medium text-blue-700">Verifying Chain...</p>
                  <p className="text-sm text-blue-600">Checking signatures and hash links</p>
                </motion.div>
              )}

              {tamperStep === 'failed' && (
                <motion.div
                  key="failed"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-red-50 border border-red-200 rounded-xl p-4"
                >
                  <XCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                  <p className="font-medium text-red-700 text-center mb-4">Tampering Detected!</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-white rounded-lg p-3">
                      <p className="font-medium text-red-600 mb-1">Block #1 Failed:</p>
                      <p className="text-gray-600">Signature doesn't match the modified content</p>
                    </div>
                    <div className="bg-white rounded-lg p-3">
                      <p className="font-medium text-red-600 mb-1">Block #2 Failed:</p>
                      <p className="text-gray-600">Previous hash (def2...) doesn't match Block #1's new hash (xyz9...)</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Key Insight */}
          <div className="mt-6 p-6 bg-purple-50 rounded-xl">
            <h3 className="font-semibold text-purple-900 mb-3">Why This Works</h3>
            <div className="space-y-3 text-sm text-purple-800">
              <p>
                <strong>1. Signature Protection:</strong> The attacker can change the content and even update the hash,
                but they CAN'T create a valid ML-DSA-44 signature without the private key.
              </p>
              <p>
                <strong>2. Chain Reaction:</strong> Even if they somehow forged Block #1's signature, Block #2
                stores Block #1's OLD hash. The chain would still break!
              </p>
              <p>
                <strong>3. No Escape:</strong> To successfully tamper with one block, an attacker would need to
                re-sign EVERY subsequent block - impossible without the private key.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Hash Demo */}
      <HashDemo />
    </div>
  )
}

// Interactive Hash Demo
function HashDemo() {
  const [input, setInput] = useState('Hello')
  const [hash, setHash] = useState('')

  useEffect(() => {
    const calculateHash = async () => {
      const encoder = new TextEncoder()
      const data = encoder.encode(input)
      const hashBuffer = await crypto.subtle.digest('SHA-256', data)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
      setHash(hashHex)
    }

    if (input) {
      calculateHash()
    } else {
      setHash('')
    }
  }, [input])

  return (
    <div className="glass-card rounded-2xl p-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Try It Yourself: SHA-256 Hashing</h2>
      <p className="text-gray-500 mb-6">Type anything below and watch the hash change completely with each character!</p>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Input Text</label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-black/20 focus:border-transparent transition-all text-lg"
            placeholder="Type something..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">SHA-256 Hash</label>
          <div className="px-4 py-3 rounded-xl bg-purple-50 border border-purple-200 min-h-[52px]">
            <code className="text-purple-600 text-sm break-all">
              {hash || 'Hash will appear here...'}
            </code>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-yellow-50 rounded-xl">
        <p className="text-sm text-yellow-800">
          <strong>Notice:</strong> Even a tiny change (like adding a space or changing one letter)
          produces a completely different hash. This is called the "avalanche effect" -
          it's impossible to predict how the hash will change!
        </p>
      </div>
    </div>
  )
}
