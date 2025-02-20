import { useEffect } from 'react'
import { useRef } from 'react'
import arona from '@arona'
import { travler } from '../../mocks'

export default function Traveler({ traveler }) {
  const fpsRef = useRef(0)

  useEffect(() => {
    const timer = setInterval(() => {
      fpsRef.current.textContent = arona.loop.getFPS()
    }, 1000 / 60 * 2)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className={'main travler flex'}>
      <div className="avatar">
        <img src={travler.avatar} alt="traveler avatar" className="w-30 h-30 rounded-full" />
      </div>
      <div className="info ml-4">
        <div className="name text-4">{traveler.info.name}</div>
        <div className="fps text-3 color-gray" ref={fpsRef}>-</div>
      </div>
    </div>
  )
}
