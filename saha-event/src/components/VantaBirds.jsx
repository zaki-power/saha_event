import { useEffect, useRef } from 'react'

export default function VantaBirds() {
  const vantaRef = useRef(null)
  const vantaEffectRef = useRef(null)

  useEffect(() => {
    const loadVanta = async () => {
      // Load Three.js
      const THREE = await import('three')

      // Load Vanta Birds
      const VantaBirds = await import('vanta/dist/vanta.birds.min')

      if (vantaRef.current && !vantaEffectRef.current) {
        vantaEffectRef.current = VantaBirds.default.BIRDS({
          el: vantaRef.current,
          THREE: THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200,
          minWidth: 200,
          scale: 1,
          scaleMobile: 1,
          // App color scheme - using the brand colors
          backgroundColor: 0xffffff,
          color1: 0x6B21A8, // Primary purple
          color2: 0xEC4899, // Accent pink
          birdSize: 1.5,
          quantity: 4,
          separation: 50
        })
      }
    }

    loadVanta()

    return () => {
      if (vantaEffectRef.current) {
        vantaEffectRef.current.destroy()
        vantaEffectRef.current = null
      }
    }
  }, [])

  return (
    <div
      ref={vantaRef}
      className="w-full h-full absolute top-0 left-0"
      style={{ zIndex: 0 }}
    />
  )
}
