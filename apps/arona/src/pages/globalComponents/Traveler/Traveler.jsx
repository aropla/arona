import { useEffect } from 'react'
import { useRef } from 'react'
import { arona } from '@arona'
import { Profile, Selfie } from '@arona/components'

export function TheTraveler({ traveler }) {
  const [fpsRef] = useFPS()

  return (
    <div className="main traveler flex">
      <div className="avatar">
        <img src={traveler?.[Selfie].url} alt="traveler avatar" className="box-border w-30 h-30 rounded-full border-solid border-2 border-white" />
      </div>
      <div className="info ml-4">
        <div className="name text-4">{traveler?.[Profile].name}</div>
        <div className="fps text-3 color-gray" ref={fpsRef}>-</div>
      </div>
    </div>
  )
}

function useFPS() {
  const ref = useRef(null)

  useEffect(() => {
    const timer = setInterval(() => {
      ref.current.textContent = arona.loop.getFPS()
    }, 1000 / 60 * 2)

    return () => clearInterval(timer)
  }, [])

  return [ref]
}
