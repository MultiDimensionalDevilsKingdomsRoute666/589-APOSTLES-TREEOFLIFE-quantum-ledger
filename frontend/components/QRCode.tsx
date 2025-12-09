'use client'

import { useEffect, useRef } from 'react'

interface QRCodeProps {
  data: string
  size?: number
}

export default function QRCode({ data, size = 128 }: QRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    // Simple QR-like pattern generator (visual representation)
    // For a real QR code, you'd use a library like 'qrcode'
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const moduleCount = 21
    const moduleSize = size / moduleCount

    // Clear canvas
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, size, size)

    // Generate pattern based on data hash
    const hash = simpleHash(data)
    ctx.fillStyle = '#000000'

    // Draw finder patterns (corners)
    drawFinderPattern(ctx, 0, 0, moduleSize)
    drawFinderPattern(ctx, (moduleCount - 7) * moduleSize, 0, moduleSize)
    drawFinderPattern(ctx, 0, (moduleCount - 7) * moduleSize, moduleSize)

    // Draw data modules
    for (let row = 0; row < moduleCount; row++) {
      for (let col = 0; col < moduleCount; col++) {
        // Skip finder pattern areas
        if (isFinderArea(row, col, moduleCount)) continue

        // Use hash to determine if module should be filled
        const index = row * moduleCount + col
        const shouldFill = (hash.charCodeAt(index % hash.length) + index) % 3 !== 0

        if (shouldFill) {
          ctx.fillRect(col * moduleSize, row * moduleSize, moduleSize - 0.5, moduleSize - 0.5)
        }
      }
    }
  }, [data, size])

  const simpleHash = (str: string): string => {
    let hash = ''
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash += String.fromCharCode((char * 7 + i * 13) % 94 + 33)
    }
    return hash.repeat(10)
  }

  const drawFinderPattern = (ctx: CanvasRenderingContext2D, x: number, y: number, moduleSize: number) => {
    // Outer black square
    ctx.fillStyle = '#000000'
    ctx.fillRect(x, y, moduleSize * 7, moduleSize * 7)

    // Inner white square
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(x + moduleSize, y + moduleSize, moduleSize * 5, moduleSize * 5)

    // Center black square
    ctx.fillStyle = '#000000'
    ctx.fillRect(x + moduleSize * 2, y + moduleSize * 2, moduleSize * 3, moduleSize * 3)
  }

  const isFinderArea = (row: number, col: number, moduleCount: number): boolean => {
    // Top-left finder
    if (row < 8 && col < 8) return true
    // Top-right finder
    if (row < 8 && col >= moduleCount - 8) return true
    // Bottom-left finder
    if (row >= moduleCount - 8 && col < 8) return true
    return false
  }

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className="rounded-lg"
      style={{ imageRendering: 'pixelated' }}
    />
  )
}
