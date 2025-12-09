'use client'

import { motion } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'

interface ThemeToggleProps {
  isDark: boolean
  onToggle: () => void
}

export default function ThemeToggle({ isDark, onToggle }: ThemeToggleProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onToggle}
      className={`relative w-14 h-7 rounded-full transition-colors ${
        isDark ? 'bg-dark-700' : 'bg-yellow-100'
      }`}
    >
      <motion.div
        className={`absolute top-1 w-5 h-5 rounded-full flex items-center justify-center ${
          isDark ? 'bg-dark-500' : 'bg-yellow-400'
        }`}
        animate={{ left: isDark ? '4px' : '32px' }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      >
        {isDark ? (
          <Moon className="w-3 h-3 text-quantum-400" />
        ) : (
          <Sun className="w-3 h-3 text-yellow-600" />
        )}
      </motion.div>
    </motion.button>
  )
}
