import { MemoID } from '@arona/components'
import { AronaButtonGroup } from '@/components/AronaButton/AronaButtonGroup'
import { AronaButton } from '@/components/AronaButton/AronaButton'
import { useCallback } from 'react'
import { TheMemo } from '@globalComponents'
import { AronaScrollView } from '@/components/AronaView/AronaScrollView/AronaScrollView'

export function DailyMemoBox({ memos, selectedMemo, onCreate, onRemove, onSelect, onUnselect }) {
  const handleCreateMemo = useCallback(event => {
    event.stopPropagation()

    onCreate()
  }, [])

  const handleUnselectMemo = useCallback(() => {
    onUnselect(selectedMemo)
  }, [selectedMemo])

  const handleSelectMemo = useCallback(memo => {
    if (selectedMemo?.[MemoID] === memo[MemoID]) {
      onUnselect(selectedMemo)
    } else {
      onSelect(memo)
    }
  }, [selectedMemo, onSelect, onUnselect])

  const handleRemoveMemo = useCallback(() => {
    onRemove(selectedMemo)
  }, [onRemove, selectedMemo])

  return (
    <div className="daily-memo-box flex flex-col justify-between flex-1 min-h-0" onClick={handleUnselectMemo}>
      <AronaScrollView
        scrollbarClassName="my-3"
        scrollableOffset={{ y: [0, -64], containViewportMax: false }}
      >
        <div className="memos flex flex-col flex-1 p-3 pr-5">
          <div className="list flex flex-col gap-y-3">
            {
              memos.map(memo => (
                <TheMemo
                  memo={memo}
                  selected={memo[MemoID] === selectedMemo?.[MemoID]}
                  key={memo[MemoID]}
                  onSelect={handleSelectMemo}
                />
              ))
            }
          </div>
        </div>
      </AronaScrollView>

      <AronaButtonGroup className="ml-3 my-3">
        <AronaButton onClick={handleCreateMemo}>+</AronaButton>
        <AronaButton onClick={handleRemoveMemo}>-</AronaButton>
      </AronaButtonGroup>
    </div>
  )
}
