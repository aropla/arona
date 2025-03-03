import classNames from 'classnames'
import { useCallback } from 'react'
import { Profile } from '@arona/components'

export function Miracle({ miracle = {}, setCurMiracle, active, className }) {
  const handleMiracleNodeClick = useCallback(() => {
    setCurMiracle(miracle)
  }, [miracle])

  return (
    <div
      className={
        classNames(
          "miracle h-20 py-1.75 px-3.5 rounded bg-white/25 ease-out duration-300 select-none",
          className,
          { 'text-blue-300 ': active }
        )
      }
      onClick={handleMiracleNodeClick}
    >
      <div className="profile">
        <div className="name text-4">{miracle?.[Profile].name}</div >
        <div className="desc text-3 text-white/50">{miracle?.[Profile].desc}</div>
      </div>
    </div >
  )
}
