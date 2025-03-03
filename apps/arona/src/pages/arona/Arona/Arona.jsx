import classNames from "classnames"
import { MemoID, Profile, Temp } from '@arona/components'
import { Memo as MemoEntity } from '@arona/entities'
import { AronaButtonGroup } from '@/components/AronaButton/AronaButtonGroup'
import { AronaButton } from '@/components/AronaButton/AronaButton'
import { useCallback } from "react"
import arona from '@arona'
import { useState } from "react"
import { useSeeleQuery } from '@app/seele-react'
import { MemosQuery } from '@arona/queries'
import { MemoEditor } from "./MemoEditor"

export default function Arona() {
  const [selectedMemo, setSelectedMemo] = useState(null)

  return (
    <div className="arona h-full relative flex text-3">
      {/* Left Bar */}
      <AronaBox className="top-0 w-80 h-10">
        Daily Info
        <DailyInfoBox />
      </AronaBox>
      <AronaBox className="top-10 bottom-40 w-80 mt-4 mb-4 flex flex-col">
        Daily Memo
        <DailyMemoBox
          selectedMemo={selectedMemo}
          setSelectedMemo={setSelectedMemo}
        />
      </AronaBox>

      {/* Right Bar */}
      <AronaBox className="left-80 bottom-40 right-0 top-0 ml-4 mb-4">
        <MemoEditor memo={selectedMemo} />
        Memo Detail
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

function DailyMemoBox({ selectedMemo, setSelectedMemo }) {
  const memosQuery = useSeeleQuery(MemosQuery)
  const memos = memosQuery.array()

  const handleCreateMemo = useCallback(event => {
    event.stopPropagation()
    const entity = arona.createEntity(MemoEntity)

    setSelectedMemo(entity)
  }, [])

  const handleUnselectMemo = useCallback(() => {
    console.log('unselect')
    setSelectedMemo(null)
  }, [])

  const handleSelectMemo = useCallback(memo => {
    console.log('select', memo)
    setSelectedMemo(curMemo => curMemo === memo ? null : memo)
  }, [])

  return (
    <div className="daily-memo-box flex flex-col justify-between flex-1" onClick={handleUnselectMemo}>
      <div className="memos flex flex-col flex-1 p-3 gap-y-3">
        {
          memos.map(memo => (
            <Memo
              memo={memo}
              selectedMemo={selectedMemo}
              key={memo[MemoID]}
              onSelect={handleSelectMemo}
            />
          ))
        }
      </div>

      <AronaButtonGroup className="ml-3 mb-3">
        <AronaButton onClick={handleCreateMemo}>+</AronaButton>
        <AronaButton>-</AronaButton>
      </AronaButtonGroup>
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

function DailyMemo() {
  return (
    <div className="daily-memo"></div>
  )
}

function Memo({ memo, selectedMemo, onSelect }) {
  const handleSelectMemo = useCallback(event => {
    event.stopPropagation()

    onSelect(memo)
  }, [memo, onSelect])

  return (
    <div
      className={classNames(
        "memo h-10 flex items-center rounded bg-white/20 select-none",
        { 'text-blue-300': memo === selectedMemo }
      )}
      onClick={handleSelectMemo}
    >
      <div className="profile text-3 ml-2">
        <div className="name">{memo[Profile].name}</div>
      </div>
    </div>
  )
}

function EditableMemo({ memo, onCreate }) {
  const [name, setName] = useState(memo[Profile].name)

  const handleNameChange = useCallback(event => {
    const value = event.target.value
    setName(value)
  }, [memo])

  const handleNameUpdated = useCallback(() => {
    memo[Profile].name = name
    onCreate(memo, name)
  }, [memo, name])

  return (
    <div
      className={classNames(
        "memo h-10 flex items-center rounded bg-white/20",
        { 'text-blue-300': memo[Temp] }
      )}
    >
      <div className="profile text-3 ml-2">
        <input className="name"
          value={name}
          onChange={handleNameChange}
          onBlur={handleNameUpdated}
        />
      </div>
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
