import classNames from "classnames"
import { useCallback } from "react"
import { arona, useMe } from '@arona'
import { useState } from "react"
import { MemoEditor } from "./MemoEditor"
import { DailyMemoBox } from './components/DailyMemoBox/DailyMemoBox'
import { useSeeleQuery } from '@app/seele-react'
import { MemosQuery } from '@arona/queries'
import { TravelerID, OwnerRef, Profile } from '@arona/components'
import { Memo } from '@arona/entities'

export default function Arona() {
  const me = useMe()
  const [memos] = useSeeleQuery(MemosQuery)

  const [selectedMemo, setSelectedMemo] = useState({ value: null })

  const handleCreateMemo = useCallback(() => {
    const memo = arona.createEntity(Memo)

    memo[OwnerRef] = me[TravelerID]

    setSelectedMemo({
      value: memo
    })
  }, [])

  const handleRemoveMemo = useCallback(memo => {
    arona.removeEntity(memo)
  }, [])

  const handleSelectMemo = useCallback(memo => {
    setSelectedMemo({
      value: memo
    })
  }, [])

  const handleUnselectMemo = useCallback(() => {
    setSelectedMemo({
      value: null
    })
  }, [])

  const handleUpdateMemo = useCallback(memo => {
    setSelectedMemo({
      value: memo
    })
  }, [])

  return (
    <div className="arona flex-1 relative flex text-3 mb-10">
      {/* Left Bar */}
      <AronaBox className="top-0 w-80 h-10">
        Daily Info
        <DailyInfoBox />
      </AronaBox>
      <AronaBox className="top-10 bottom-40 w-80 mt-4 mb-4 flex flex-col">
        <DailyMemoBox
          memos={memos}
          selectedMemo={selectedMemo.value}
          onCreate={handleCreateMemo}
          onRemove={handleRemoveMemo}
          onSelect={handleSelectMemo}
          onUnselect={handleUnselectMemo}
        />
      </AronaBox>

      {/* Right Bar */}
      <AronaBox className="left-80 bottom-40 right-0 top-0 ml-4 mb-4">
        <MemoEditor memo={selectedMemo.value} onUpdate={handleUpdateMemo} />
      </AronaBox>

      {/* Bottom Bar */}
      <AronaBox className="left-0 right-0 bottom-0 h-40">
        <Paimon />
      </AronaBox>
    </div>
  )
}

function DailyInfoBox() {
  return (
    <div className="daily-info-box flex items-center">
      [日期]
      [时间]
      [天气]
    </div>
  )
}

function AronaBox({ children, className }) {
  return (
    <div className={classNames("arona-box rounded bg-white/10 absolute", className)}>
      {children}
    </div>
  )
}

function Paimon() {
  return (
    <div className="paimon">
      Paimon Timeline
    </div>
  )
}
