import { useEffect, useRef } from 'react'

const VantaBackground = () => {
  const vantaRef = useRef(null)

  useEffect(() => {
    if (vantaRef.current) {
      window.VANTA.BIRDS({
        el: vantaRef.current,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        backgroundColor: 0x1a1a2e,
        color1: 0x6B21A8,
        color2: 0xF59E0B,
        birdSize: 1.00,
        wingSpan: 35.00,
        speedLimit: 4.00,
        separation: 20.00,
        alignment: 15.00,
        cohesion: 5.00,
      })
    }

    return () => {
      if (vantaRef.current) {
        vantaRef.current.innerHTML = ''
      }
    }
  }, [])

  return <div ref={vantaRef} className="vanta-background" />
}

export default VantaBackground