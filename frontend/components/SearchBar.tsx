'use client'

import { Search, X } from 'lucide-react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function SearchBar({ value, onChange, placeholder = 'Search documents...' }: SearchBarProps) {
  return (
    <div className="relative max-w-md mx-auto">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-500" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-dark-800 border border-dark-600 rounded-lg pl-10 pr-10 py-2 text-dark-100 placeholder-dark-500 focus:outline-none focus:border-quantum-500 transition-colors"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dark-500 hover:text-dark-300"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  )
}
