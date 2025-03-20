import classNames from 'classnames'
import { Profile } from '@arona/components'
import { useCallback } from 'react'
import { Noop } from '@utils'
import { MIRACLE_SELFIE_SIZE, TheMiracleSelfie } from './MiracleSelfie'

export function TheMiracle({ className, miracle, onSelect = Noop }) {
  const handleSelect = useCallback(event => {
    onSelect(miracle, event)
  }, [onSelect])

  return (
    <div
      className={classNames(
        "miracle box-border relative w-30 h-30 flex justify-center items-end rounded overflow-hidden bg-white/10 text-3",
        className,
      )}
      onClick={handleSelect}
    >
      <TheMiracleSelfie className="absolute inset-0 opacity-20 rounded" miracle={miracle} size={MIRACLE_SELFIE_SIZE.FULL} />
      <div className="profile flex flex-col items-center mb-2 relative">
        <div className="name text-3.5 font-600">{miracle[Profile].name}</div>
        <div className="name text-3 text-white/50 h-3">{miracle[Profile].desc}</div>
      </div>
    </div>
  )
}

export function TheMiracleII({ className, miracle, memo, onSelect = Noop }) {
  const handleSelect = useCallback(event => {
    onSelect(miracle, event)
  }, [onSelect, miracle])

  return (
    <div
      className={classNames("miracle relative flex-1 flex rounded bg-white/10 p-3", className)}
      onClick={handleSelect}
    >
      <TheMiracleSelfie miracle={miracle} />
      <div className="profile">
        <div className="name pl-2 pt-2">{miracle?.[Profile]?.name}</div>
        <div className="name pl-2 pt-2 text-white/50">{miracle?.[Profile]?.desc}</div>
      </div>
    </div>
  )
}
