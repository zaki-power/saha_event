import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import BIRDS from 'vanta/src/vanta.birds'

export default function VantaBirds() {
  const vantaRef = useRef(null)
  // Use state to keep track of the effect across renders
  const [vantaEffect, setVantaEffect] = useState(null)

  useEffect(() => {
    // Make THREE global for Vanta
    window.THREE = THREE

    if (!vantaEffect && vantaRef.current) {
      setVantaEffect(
        BIRDS({
          el: vantaRef.current,
          THREE: THREE, // Pass it explicitly too
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200,
          minWidth: 200,
          scale: 1,
          scaleMobile: 1,
          backgroundColor: 0x1a0533,
          color1: 0x6B21A8,
          color2: 0xEC4899,
          birdSize: 1.5,
          quantity: 4,
          separation: 50
        })
      )
    }

    // Cleanup function
    return () => {
      if (vantaEffect) vantaEffect.destroy()
    }
  }, [vantaEffect])

  return (
    <div
      ref={vantaRef}
      className="w-full h-full absolute top-0 left-0"
      style={{ zIndex: 0 }}
    />
  )
}