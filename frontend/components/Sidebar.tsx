'use client'

import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Plus,
  Shield,
  Info,
  FileText,
  Download,
  Upload,
  RotateCcw,
  PlayCircle,
  Zap
} from 'lucide-react'

type Page = 'dashboard' | 'add' | 'verify' | 'how-it-works' | 'attack-demo' | 'about'

interface SidebarProps {
  currentPage: Page
  onPageChange: (page: Page) => void
  onExport: () => void
  onImport: () => void
  onReset: () => void
  documentCount: number
}

export default function Sidebar({
  currentPage,
  onPageChange,
  onExport,
  onImport,
  onReset,
  documentCount
}: SidebarProps) {
  const navItems = [
    { id: 'dashboard' as Page, icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'add' as Page, icon: Plus, label: 'Add Document' },
    { id: 'verify' as Page, icon: Shield, label: 'Verify Chain' },
    { id: 'how-it-works' as Page, icon: PlayCircle, label: 'How It Works' },
    { id: 'attack-demo' as Page, icon: Zap, label: 'Attack Demo' },
    { id: 'about' as Page, icon: Info, label: 'About' },
  ]

  return (
    <div className="glass-sidebar w-64 h-screen fixed left-0 top-0 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-black/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-lg text-gray-900">QuantumLedger</h1>
            <p className="text-xs text-gray-500">ML-DSA-44 Secured</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-1">
          {navItems.map((item) => (
            <motion.button
              key={item.id}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onPageChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                currentPage === item.id
                  ? 'bg-black text-white'
                  : 'text-gray-600 hover:bg-black/5'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
              {item.id === 'dashboard' && (
                <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${
                  currentPage === item.id
                    ? 'bg-white/20 text-white'
                    : 'bg-black/10 text-gray-600'
                }`}>
                  {documentCount}
                </span>
              )}
              {item.id === 'attack-demo' && (
                <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${
                  currentPage === item.id
                    ? 'bg-white/20 text-white'
                    : 'bg-red-100 text-red-600'
                }`}>
                  Demo
                </span>
              )}
            </motion.button>
          ))}
        </div>

        {/* Divider */}
        <div className="my-6 border-t border-black/5" />

        {/* Actions */}
        <div className="space-y-1">
          <p className="px-4 text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
            Actions
          </p>

          <motion.button
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
            onClick={onExport}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-black/5 transition-all"
          >
            <Download className="w-5 h-5" />
            <span className="font-medium">Export Chain</span>
          </motion.button>

          <motion.button
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
            onClick={onImport}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-black/5 transition-all"
          >
            <Upload className="w-5 h-5" />
            <span className="font-medium">Import Chain</span>
          </motion.button>

          <motion.button
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
            onClick={onReset}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all"
          >
            <RotateCcw className="w-5 h-5" />
            <span className="font-medium">Reset Ledger</span>
          </motion.button>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-black/5">
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Quick Stats</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{documentCount}</p>
          <p className="text-xs text-gray-500">Documents in chain</p>
        </div>
      </div>
    </div>
  )
}
