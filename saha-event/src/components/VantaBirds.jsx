import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import VANTA from 'vanta/dist/vanta.birds.min'

export default function VantaBirds() {
  const vantaRef = useRef(null)

  useEffect(() => {
    let vantaEffect = null

    // Ensure THREE is available
    if (vantaRef.current && !vantaEffect) {
      vantaEffect = VANTA.BIRDS({
        el: vantaRef.current,
        THREE: THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200,
        minWidth: 200,
        scale: 1,
        scaleMobile: 1,
        // App color scheme
        backgroundColor: 0xffffff,
        color1: 0x6B21A8, // Primary purple
        color2: 0xEC4899, // Accent pink
        birdSize: 1.5,
        quantity: 4,
        separation: 50
      })
    }

    return () => {
      if (vantaEffect) {
        vantaEffect.destroy()
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
