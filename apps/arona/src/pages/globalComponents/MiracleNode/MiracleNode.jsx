import { Profile } from '@arona/components'
import classNames from 'classnames'
import { Noop } from '@utils'
import { useCallback } from 'react'

export function TheMiracleNodeII({ className, miracleNode, onSelect = Noop }) {
  const handleSelect = useCallback(event => {
    onSelect(miracleNode, event)
  }, [onSelect])

  return (
    <div
      className={classNames("miracle-node rounded bg-white/10 p-3", className)}
      onClick={handleSelect}
    >
      <div className="profile">
        <div className="name h-3">{miracleNode?.[Profile].name}</div>
        <div className="name mt-3 text-white/50 h-3">{miracleNode?.[Profile].desc}</div>
      </div>
    </div>
  )
}
