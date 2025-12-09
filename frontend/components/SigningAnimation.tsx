'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Lock } from 'lucide-react'

interface SigningAnimationProps {
  isVisible: boolean
  onComplete?: () => void
}

export default function SigningAnimation({ isVisible, onComplete }: SigningAnimationProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-white/90 backdrop-blur-md flex items-center justify-center z-[100]"
        >
          <div className="text-center">
            {/* Animated Shield */}
            <motion.div
              className="relative w-24 h-24 mx-auto mb-6"
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            >
              <Shield className="w-24 h-24 text-gray-800" />

              {/* Orbiting particles */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-gray-800 rounded-full"
                  style={{
                    top: '50%',
                    left: '50%',
                  }}
                  animate={{
                    x: [0, Math.cos(i * Math.PI / 3) * 50, 0],
                    y: [0, Math.sin(i * Math.PI / 3) * 50, 0],
                    opacity: [0, 1, 0],
                    scale: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: 'easeInOut',
                  }}
                />
              ))}
            </motion.div>

            {/* Lock Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mb-4"
            >
              <Lock className="w-8 h-8 text-gray-600 mx-auto" />
            </motion.div>

            {/* Text */}
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xl font-semibold text-gray-900 mb-2"
            >
              Signing with ML-DSA-44
            </motion.h3>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-gray-500"
            >
              Generating quantum-resistant signature...
            </motion.p>

            {/* Progress dots */}
            <div className="flex justify-center gap-2 mt-6">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-gray-400 rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
