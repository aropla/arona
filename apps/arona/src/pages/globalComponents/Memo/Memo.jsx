import classNames from 'classnames'
import { useCallback } from 'react'
import { Profile } from '@arona/components'

export function TheMemo({ memo, selected, onSelect }) {
  const handleSelectMemo = useCallback(event => {
    event.stopPropagation()

    onSelect(memo)
  }, [memo, onSelect])

  return (
    <div
      className={classNames(
        "memo h-10 flex items-center rounded bg-white/20 select-none",
        { 'text-blue-300': selected }
      )}
      onClick={handleSelectMemo}
    >
      <div className="profile text-3 ml-2">
        <div className="name">{memo[Profile].name}</div>
      </div>
    </div>
  )
}
