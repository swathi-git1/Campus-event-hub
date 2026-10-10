import React, { useEffect, useRef } from 'react'

const PARTICLES = [
  ['7%', '18%', 18, 0], ['17%', '72%', 11, 1.8], ['29%', '28%', 7, 3.2],
  ['42%', '83%', 14, 2.4], ['57%', '14%', 9, 4.6], ['68%', '62%', 6, 1.1],
  ['79%', '24%', 13, 3.8], ['91%', '78%', 8, 5.2], ['12%', '91%', 5, 2.7],
  ['51%', '48%', 5, 4.1], ['88%', '47%', 6, .7], ['35%', '64%', 8, 5.8]
]

export default function AnimatedBackground() {
  const backgroundRef = useRef(null)

  useEffect(() => {
    const background = backgroundRef.current
    if (!background || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    let frame = 0
    const handlePointerMove = (event) => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const x = (event.clientX / window.innerWidth - 0.5) * 2
        const y = (event.clientY / window.innerHeight - 0.5) * 2
        background.style.setProperty('--pointer-x', x.toFixed(3))
        background.style.setProperty('--pointer-y', y.toFixed(3))
      })
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', handlePointerMove)
    }
  }, [])

  return (
    <div className="animated-background" ref={backgroundRef} aria-hidden="true">
      <div className="ambient-blob ambient-blob-one" />
      <div className="ambient-blob ambient-blob-two" />
      <div className="ambient-blob ambient-blob-three" />
      <div className="ambient-ribbon ambient-ribbon-one" />
      <div className="ambient-ribbon ambient-ribbon-two" />
      <svg className="ambient-waves" viewBox="0 0 1440 900" preserveAspectRatio="none">
        <path d="M-80 210 C 230 60, 360 330, 680 190 S 1110 70, 1520 250" />
        <path d="M-100 720 C 220 560, 420 850, 760 680 S 1190 550, 1530 710" />
        <path d="M230 -80 C 420 170, 330 360, 520 560 S 720 820, 900 980" />
      </svg>
      <div className="ambient-particles">
        {PARTICLES.map(([left, top, size, delay], index) => (
          <span
            key={index}
            className="ambient-particle"
            style={{ '--particle-left': left, '--particle-top': top, '--particle-size': `${size}px`, '--particle-delay': `${delay}s` }}
          />
        ))}
      </div>
    </div>
  )
}
