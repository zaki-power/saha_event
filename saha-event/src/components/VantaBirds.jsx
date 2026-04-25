import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function VantaBirds() {
  const vantaRef = useRef(null)
  const vantaEffectRef = useRef(null)

  useEffect(() => {
    const loadVanta = async () => {
      try {
        // Load Vanta Birds dynamically
        const { BIRDS } = await import('vanta/dist/vanta.birds.min.js')

        if (vantaRef.current && !vantaEffectRef.current && BIRDS) {
          vantaEffectRef.current = BIRDS({
            el: vantaRef.current,
            THREE: THREE,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200,
            minWidth: 200,
            scale: 1.0,
            scaleMobile: 1.0,
            backgroundColor: 0xffffff,
            color1: 0x6B21A8,
            color2: 0xEC4899,
            birdSize: 1.5,
            quantity: 4,
            separation: 50
          })
        }
      } catch (error) {
        console.error('[v0] Vanta error:', error)
      }
    }

    // Small delay to ensure element is mounted
    const timer = setTimeout(loadVanta, 100)

    return () => {
      clearTimeout(timer)
      if (vantaEffectRef.current && typeof vantaEffectRef.current.destroy === 'function') {
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
