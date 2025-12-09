'use client'

import { motion } from 'framer-motion'
import {
  Shield,
  ShieldOff,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Cpu,
  Lock,
  X
} from 'lucide-react'

interface Algorithm {
  name: string
  type: string
  quantum_safe: boolean
  public_key_size: number
  signature_size: number
  security_level: string
  quantum_vulnerability: string
  math_problem: string
  status: string
}

interface QuantumThreat {
  title: string
  description: string
  timeline: string
  solution: string
}

interface ComparisonData {
  algorithms: Algorithm[]
  quantum_threat: QuantumThreat
}

interface AlgorithmComparisonProps {
  data: ComparisonData
  onClose: () => void
}

export default function AlgorithmComparison({ data, onClose }: AlgorithmComparisonProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-dark-800 rounded-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-red-900/50 via-dark-800 to-quantum-900/50 px-6 py-4 flex items-center justify-between border-b border-dark-600">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-quantum-400" />
            <h2 className="text-xl font-bold text-dark-100">
              Classical vs Post-Quantum Cryptography
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-dark-400 hover:text-dark-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Quantum Threat Warning */}
        <div className="p-6 border-b border-dark-700">
          <div className="bg-gradient-to-r from-red-900/30 to-orange-900/30 rounded-xl p-6 border border-red-500/30">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-10 h-10 text-red-400 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-bold text-red-300 mb-2">{data.quantum_threat.title}</h3>
                <p className="text-dark-300 mb-3">{data.quantum_threat.description}</p>
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-dark-900/50 rounded-lg p-3">
                    <span className="text-dark-400 text-sm">Timeline</span>
                    <p className="text-orange-300">{data.quantum_threat.timeline}</p>
                  </div>
                  <div className="bg-dark-900/50 rounded-lg p-3">
                    <span className="text-dark-400 text-sm">Solution</span>
                    <p className="text-green-300">{data.quantum_threat.solution}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Algorithm Comparison Table */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-dark-200 mb-4">Algorithm Comparison</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-dark-900/50">
                  <th className="px-4 py-3 text-left text-dark-300 font-medium">Algorithm</th>
                  <th className="px-4 py-3 text-left text-dark-300 font-medium">Type</th>
                  <th className="px-4 py-3 text-center text-dark-300 font-medium">Quantum Safe</th>
                  <th className="px-4 py-3 text-right text-dark-300 font-medium">Key Size</th>
                  <th className="px-4 py-3 text-right text-dark-300 font-medium">Sig Size</th>
                  <th className="px-4 py-3 text-left text-dark-300 font-medium">Security</th>
                </tr>
              </thead>
              <tbody>
                {data.algorithms.map((algo, index) => (
                  <motion.tr
                    key={algo.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`border-b border-dark-700 ${
                      algo.quantum_safe ? 'bg-green-900/10' : 'bg-red-900/10'
                    }`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {algo.quantum_safe ? (
                          <Shield className="w-4 h-4 text-green-400" />
                        ) : (
                          <ShieldOff className="w-4 h-4 text-red-400" />
                        )}
                        <span className={`font-medium ${algo.name.includes('ML-DSA-44') ? 'text-quantum-300' : 'text-dark-200'}`}>
                          {algo.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs ${
                        algo.type === 'Post-Quantum'
                          ? 'bg-green-900/50 text-green-300'
                          : 'bg-red-900/50 text-red-300'
                      }`}>
                        {algo.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {algo.quantum_safe ? (
                        <CheckCircle className="w-5 h-5 text-green-400 mx-auto" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-400 mx-auto" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-right text-dark-300">{algo.public_key_size} B</td>
                    <td className="px-4 py-3 text-right text-dark-300">{algo.signature_size} B</td>
                    <td className="px-4 py-3 text-dark-300 text-xs">{algo.security_level}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Detailed Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {data.algorithms.map((algo, index) => (
              <motion.div
                key={algo.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className={`rounded-lg p-4 border ${
                  algo.quantum_safe
                    ? 'bg-green-900/10 border-green-500/30'
                    : 'bg-red-900/10 border-red-500/30'
                }`}
              >
                <div className="flex items-center gap-2 mb-3">
                  {algo.quantum_safe ? (
                    <Shield className="w-5 h-5 text-green-400" />
                  ) : (
                    <ShieldOff className="w-5 h-5 text-red-400" />
                  )}
                  <span className="font-semibold text-dark-100">{algo.name}</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-dark-400">Math Problem:</span>
                    <p className="text-dark-300">{algo.math_problem}</p>
                  </div>
                  <div>
                    <span className="text-dark-400">Quantum Vulnerability:</span>
                    <p className={algo.quantum_safe ? 'text-green-300' : 'text-red-300'}>
                      {algo.quantum_vulnerability}
                    </p>
                  </div>
                  <div>
                    <span className="text-dark-400">Status:</span>
                    <p className={algo.quantum_safe ? 'text-green-300' : 'text-orange-300'}>
                      {algo.status}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-dark-900/50 px-6 py-4 text-sm text-dark-400 border-t border-dark-700">
          <p>
            <strong className="text-quantum-400">Why ML-DSA-44?</strong> This application uses ML-DSA-44 because it provides
            NIST Level 2 security (equivalent to AES-128) against quantum attacks while maintaining reasonable key and signature sizes.
            It's the recommended choice for most applications requiring long-term security.
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}
