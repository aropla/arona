import { MiracleNodeID, Profile, CreatedTime, MiracleNodeRef, OwnerRef, Toki, MiracleRef, MiracleID, Timer } from '@arona/components'
import { arona } from '@arona'
import { TheTravelerSelfie } from '@pages/globalComponents'
import { AronaTime, AronaTimeFromNow } from '@/components/AronaDisplay/AronaTime'
import classNames from 'classnames'
import { useCallback } from 'react'
import { MiraclesQuery, MiracleNodesQuery } from '@arona/queries'
import { useSeeleQuery } from '@app/seele-react'
import { TheMiracleII } from '@pages/globalComponents/Miracle/Miracle'
import { TheMiracleNodeII } from '@pages/globalComponents/MiracleNode/MiracleNode'
import { useState } from 'react'
import { useEffect } from 'react'
import { useRef } from 'react'
import { useStopPropagation, useFadeAnimation } from '@hooks'
import { List, Noop } from '@utils'
import dayjs from 'dayjs'
import { AronaDigitPickerGroup } from '@/components/AronaPicker/AronaDigitPicker/AronaDigitPicker'
import { useMemo } from 'react'
import gsap from 'gsap'

function PickerCell({ className, children, data, onSelect = Noop, selected = false, backgroundText, hidden = false }) {
  const ref = useRef()

  useEffect(() => {
    if (hidden) {
      gsap.to(ref.current, {
        opacity: 0,
        duration: 0.3,
        delay: Math.random() * 0.2 + 0.1
      })
    } else {
      gsap.to(ref.current, {
        opacity: 1,
        duration: 0.3,
        delay: Math.random() * 0.2 + 0.1
      })
    }
  }, [hidden])

  const handleSelect = useCallback(() => {
    if (hidden) {
      return
    }

    onSelect(data)
  }, [data, hidden, onSelect])

  // TODO: Change font-family
  return (
    <div
      ref={ref}
      className={classNames(
        "picker-cell relative flex justify-center items-center flex-none box-border w-20 h-20 p-3 border-2 border-solid border-transparent",
        "rounded bg-white/10 text-15",
        className
      )}
      onClick={handleSelect}
    >
      <BackgroundText size={40} right={-6} bottom={-6} className={classNames("font-700 transition ease-in-out duration-300", { "text-blue-300/80!": selected })}>{backgroundText}</BackgroundText>
      {children}
    </div>
  )
}

function AronaYearPicker({ date, onSelect = Noop }) {
  const year = dayjs(date).year()

  const handleSelectYear = useCallback(year => {
    onSelect(year)
  }, [onSelect])

  return (
    <div className="arona-year-picker flex space-x-1">
      <AronaDigitPickerGroup digits={year} onSelect={handleSelectYear} />
      <PickerCell className="color-white/60">年</PickerCell>
    </div>
  )
}

function AronaMonthPicker({ date, onSelect = Noop }) {
  const month = dayjs(date).month()

  const handleSelectMonth = useCallback(m => {
    m = m - 1
    onSelect(m < 0 ? 0 : m > 11 ? 11 : m)
  }, [onSelect])

  return (
    <div className="arona-month-picker flex space-x-1">
      <AronaDigitPickerGroup digits={month + 1} fixedLength={2} onSelect={handleSelectMonth} />
      <PickerCell className="color-white/60">月</PickerCell>
    </div>
  )
}

function AronaDayPicker({ date, curDate, onSelect = Noop }) {
  const day = dayjs(date).date()
  const daysInMonth = useMemo(() => dayjs(date).daysInMonth(), [date])

  const handleSelectDay = useCallback(day => {
    onSelect(day < 1 ? 1 : day <= daysInMonth ? day : daysInMonth)
  }, [onSelect])

  return (
    <div className="arona-day-picker flex space-x-1">
      <AronaDigitPickerGroup digits={day} fixedLength={2} onSelect={handleSelectDay} />
      <PickerCell className="color-white/60">日</PickerCell>
    </div>
  )
}

function AronaDayCalendar({ className, date, onSelect = Noop }) {
  const cells = useMemo(() => List(31), [])
  const daysInMonth = useMemo(() => dayjs(date).daysInMonth(), [date])

  const handleSelectDay = useCallback((day, event) => {
    onSelect(day, event)
  }, [onSelect])

  return (
    <div className={classNames("day-picker flex-none grid grid-cols-[repeat(7,auto)] grid-rows-5 gap-1 place-content-start", className)}>
      {
        cells.map(d => {
          const targetDay = date.date(d + 1)
          const isToday = date.isSame(targetDay, 'day')

          return (
            <PickerCell
              key={d}
              data={d + 1}
              selected={isToday}
              onSelect={handleSelectDay}
              backgroundText={d + 1}
              hidden={d + 1 > daysInMonth}
            />
          )
        })
      }
    </div>
  )
}

function AronaMinutePicker({ date, onSelect }) {
  const minute = dayjs(date).minute()

  const handleSelectMinute = useCallback(minute => {
    onSelect(minute < 60 ? minute : 59)
  }, [onSelect])

  return (
    <div className="arona-time-picker flex space-x-1">
      <AronaDigitPickerGroup digits={minute} fixedLength={2} onSelect={handleSelectMinute} />
      <PickerCell className="color-white/60">分</PickerCell>
    </div>
  )
}
function AronaSecondPicker({ date, onSelect }) {
  const second = dayjs(date).second()

  const handleSelectSecond = useCallback(second => {
    onSelect(second < 60 ? second : 59)
  }, [onSelect])

  return (
    <div className="arona-time-picker flex space-x-1">
      <AronaDigitPickerGroup digits={second} fixedLength={2} onSelect={handleSelectSecond} />
      <PickerCell className="color-white/60">秒</PickerCell>
    </div>
  )
}

function AronaDatePicker({ className, date, show, setShow, onSelect = Noop }) {
  const curDate = dayjs(date)
  const [time, setTime] = useState(dayjs(date))

  useEffect(() => {
    setTime(dayjs(date))
  }, [date])

  const ref = useRef()

  useHandleClickOutside(ref, useCallback(() => {
    show && setShow(false)
  }, [show, setShow]))

  useFadeAnimation(ref, {
    duration: 0.4,
    x: 0,
    opacity: 1,
    display: 'flex',
    startAt: {
      x: 16,
      opacity: 0,
    },
  }, {
    observe: () => show,
  })

  const selectTime = useCallback(newTime => {
    setTime(newTime ?? dayjs())
    onSelect(newTime)
  }, [onSelect])

  const handleSelectYear = useCallback(year => {
    const newTime = time.year(year)
    setTime(newTime)
    onSelect(newTime)
  }, [time, onSelect])
  const handleSelectMonth = useCallback(month => {
    const newTime = time.month(month)
    setTime(newTime)
    onSelect(newTime)
  }, [time, onSelect])
  const handleSelectDay = useCallback(day => {
    const newTime = time.date(day)
    setTime(newTime)
    onSelect(newTime)
  }, [time, onSelect])
  const handleSelectMinute = useCallback(minute => {
    const newTime = time.minute(minute)
    setTime(newTime)
    onSelect(newTime)
  }, [time, onSelect])
  const handleSelectSecond = useCallback(second => {
    const newTime = time.second(second)
    setTime(newTime)
    onSelect(newTime)
  }, [time, onSelect])

  return (
    <div
      className={classNames("arona-date-picker absolute hidden px-3 py-3", className)}
      ref={ref}
    >
      <div className="left flex flex-col pr-3">
        <div className="year-picker mb-1">
          <AronaYearPicker curDate={curDate} date={time} onSelect={handleSelectYear} />
        </div>

        <div className="month-and-day-picker flex space-x-1 mb-1">
          <AronaMonthPicker curDate={curDate} date={time} onSelect={handleSelectMonth} />
          <AronaDayPicker date={time} onSelect={handleSelectDay} />
        </div>

        <div className="time-picker flex space-x-1">
          <AronaMinutePicker curDate={curDate} date={time} onSelect={handleSelectMinute} />
          <AronaSecondPicker curDate={curDate} date={time} onSelect={handleSelectSecond} />
        </div>

        <div className="arona-day-calendar mt-6">
          <AronaDayCalendar date={time} onSelect={handleSelectDay}></AronaDayCalendar>
        </div>
      </div>

      <div className="right w-60 pl-3 flex flex-col space-y-3">
        <div className="section arona flex-[1]">
          <div className="name text-3 mb-3 p-3 flex rounded bg-blue-400/50">阿洛娜推荐</div>
          <div className="list space-y-1">
            <div className="item h-10 flex items-center rounded bg-white/10">
              <div className="value pl-3">2025年03月25日 16:00</div>
            </div>
            <div className="item h-10 flex items-center rounded bg-white/10">
              <div className="value pl-3">现在就开始哦</div>
            </div>
          </div>
        </div>

        <div className="section arona flex-[1]">
          <div className="name text-3 mb-3 p-3 flex rounded bg-pink-300/50">最近使用</div>
          <div className="list space-y-1">
            <div className="item h-10 flex items-center rounded bg-white/10">
              <div className="value pl-3">现在</div>
            </div>
            <div className="item h-10 flex items-center rounded bg-white/10">
              <div className="value pl-3">+30 分钟</div>
            </div>
          </div>
        </div>

        <div className="section arona flex-[2]">
          <div className="name text-3 mb-3 p-3 flex rounded bg-gray-00/50">常用时间</div>
          <div className="list space-y-1">
            <div className="item h-10 flex items-center rounded bg-white/10" onClick={() => selectTime(undefined)}>
              <div className="value pl-3">Clear</div>
            </div>
            <div className="item h-10 flex items-center rounded bg-white/10" onClick={() => selectTime(dayjs())}>
              <div className="value pl-3">现在</div>
            </div>
            <div className="item h-10 flex items-center rounded bg-white/10" onClick={() => selectTime(time.add(30, 'minute'))}>
              <div className="value pl-3">+30 分钟</div>
            </div>
            <div className="item h-10 flex items-center rounded bg-white/10" onClick={() => selectTime(time.add(1, 'day'))}>
              <div className="value pl-3">+1 天</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function MiraclePicker({ className, onSelect, show, setShow }) {
  const [miracles] = useSeeleQuery(MiraclesQuery)

  const handleSelectMiracle = useCallback((miracle, event) => {
    onSelect(miracle, event)
  }, [onSelect])

  const ref = useRef()

  useHandleClickOutside(ref, useCallback(() => {
    show && setShow(false)
  }, [show, setShow]))

  useFadeAnimation(ref, {
    duration: 0.4,
    x: 0,
    opacity: 1,
    display: 'block',
    startAt: {
      x: 16,
      opacity: 0,
    },
  }, {
    observe: () => show,
  })

  return (
    <div
      className={classNames(
        "arona-miracle-picker absolute hidden",
        className,
      )}
      ref={ref}
    >
      <div className="pick-list space-y-4">
        {
          miracles.map(miracle => (
            <TheMiracleII key={miracle[MiracleID]} miracle={miracle} onSelect={handleSelectMiracle} />
          ))
        }
      </div>
    </div>
  )
}

function MiracleNodePicker({ className, miracle, onSelect, show, setShow }) {
  const [allMiracleNodes] = useSeeleQuery(MiracleNodesQuery)
  const miracleNodes = allMiracleNodes.filter(miracleNode => miracleNode[MiracleRef] === miracle?.[MiracleID])

  const handleSelectMiracleNode = useCallback((miracleNode, event) => {
    onSelect(miracleNode, event)
  }, [onSelect])

  const ref = useRef()

  useHandleClickOutside(ref, useCallback(() => {
    show && setShow(false)
  }, [show, setShow]))

  useFadeAnimation(ref, {
    duration: 0.4,
    x: 0,
    opacity: 1,
    display: 'block',
    startAt: {
      x: 16,
      opacity: 0,
    },
  }, {
    observe: () => show,
  })

  return (
    <div
      className={classNames(
        "arona-miracle-node-picker absolute hidden",
        className,
      )}
      ref={ref}
    >
      <div className="pick-list space-y-4">
        {
          miracleNodes.map(miracleNode => (
            <TheMiracleNodeII key={miracleNode[MiracleNodeID]} miracleNode={miracleNode} onSelect={handleSelectMiracleNode} />
          ))
        }
      </div>
    </div>
  )
}

export function MemoEditor({ memo, onUpdate }) {
  const author = arona.traveler.get(memo?.[OwnerRef])
  const miracleNode = arona.miracleNode.get(memo?.[MiracleNodeRef])

  return (
    <>
      {
        memo ? (
          <div className="memo-editor h-full w-full flex flex-col">
            <div className="memo flex-1 flex relative">
              <div className="flex-1 relative px-8 py-8 flex flex-col space-y-4">
                <SectionHeader memo={memo} onUpdate={onUpdate} />
                <SectionAuthor memo={memo} author={author} />
                <SectionNoa memo={memo} />
              </div>

              <div className="extra box-border w-100 pt-8 mr-8 space-y-4">
                <SectionMiracleInfo
                  memo={memo}
                  miracleNode={miracleNode}
                  onUpdate={onUpdate}
                />
                <SectionScheduleTime memo={memo} onUpdate={onUpdate} />
                <SectionToki memo={memo} />
              </div>
            </div>
          </div>
        ) : null
      }
    </>
  )
}

function SectionHeader({ memo, onUpdate }) {
  const handleMemoNameChange = useCallback(event => {
    const value = event.target.value
    memo[Profile].name = value

    onUpdate(memo)
  }, [memo, onUpdate])

  const handleMemoDescChange = useCallback(event => {
    const value = event.target.value
    memo[Profile].desc = value

    onUpdate(memo)
  }, [memo, onUpdate])

  return (
    <div className="section memo-profile">
      <div className="profile flex flex-col">
        <input
          className="input-reset name text-6 font-bold color-white"
          type="text"
          value={memo[Profile].name}
          onChange={handleMemoNameChange}
        />

        <input
          className="input-reset desc text-4 text-white/60 mt-2! min-h-4"
          type="text"
          value={memo[Profile].desc}
          onChange={handleMemoDescChange}
        />
      </div>
    </div>
  )
}

function SectionAuthor({ memo, author }) {
  return (
    <div className="section mt-8 author flex">
      <TheTravelerSelfie className="mr-2" traveler={author} />

      <div className="profile flex flex-col justify-between">
        <div className="name text-3 mt-1">{author?.[Profile].name}</div>
        <div className="time flex mb-1">
          <div className="text text-white/60">创建于</div>
          <AronaTime
            className="text-white/40 ml-1"
            time={memo[CreatedTime].time}
          />

          {/* TODO: 根据指定的 x 相差时间，来调整颜色的亮度 */}
          <AronaTimeFromNow
            className="text-white/40 ml-4"
            time={memo[CreatedTime].time}
          />
        </div>
      </div>
    </div>
  )
}

function SectionNoa({ memo }) {
  return (
    <div className="section-noa flex-1">
      <div className="noa">
        <div className="noa-block text-4 text-white/60 leading-6">
          Memo Editor 所包含的内容：
        </div>
        <div className="noa-block text-4 text-white/60 leading-6">
          - Markdown 语法
        </div>
        <div className="noa-block text-4 text-white/60 leading-6">
          - @ 语法
        </div>
        <div className="noa-block text-4 text-white/60 leading-6">
          - Checklist / Todolist
        </div>
        <div className="noa-block text-4 text-white/60 leading-6">
          - Code block
        </div>
        <div className="noa-block text-4 text-white/60 leading-6">
          - Image
        </div>
        <div className="noa-block text-4 text-white/60 leading-6">
          - Stream Media
        </div>
      </div>
    </div>
  )
}

function SectionToki({ memo }) {
  const toki = memo[Toki]

  return (
    <div className="section-toki text-white/50">
      <div className="name">定时任务</div>
    </div>
  )
}

function SectionMiracleInfo({ memo, miracleNode, onUpdate }) {
  const [miracle, setMiracle] = useState()
  const [miraclePickerShow, setMiraclePickerShow] = useState(false)
  const [miracleNodePickerShow, setMiracleNodePickerShow] = useState(false)

  useEffect(() => {
    setMiracle(arona.miracle.get(miracleNode?.[MiracleRef]))
  }, [miracleNode])

  const handleSetMiracle = useCallback(() => {
    if (miraclePickerShow) {
      setMiraclePickerShow(false)
    } else {
      setMiraclePickerShow(true)
      setMiracleNodePickerShow(false)
    }
  }, [miraclePickerShow])

  const handleSelectMiracle = useCallback(targetMiracle => {
    setMiraclePickerShow(false)
    setMiracle(targetMiracle)
  }, [setMiracle])

  const handleSetMiracleNode = useCallback(() => {
    if (miracleNodePickerShow) {
      setMiracleNodePickerShow(false)
    } else {
      setMiracleNodePickerShow(true)
      setMiraclePickerShow(false)
    }
  }, [miracleNodePickerShow])

  const handleSelectMiracleNode = useCallback(targetMiracleNode => {
    setMiracleNodePickerShow(false)

    memo[MiracleNodeRef] = targetMiracleNode[MiracleNodeID]
    onUpdate(memo)
  }, [setMiracle, onUpdate])

  const handleStopPropagation = useStopPropagation()

  return (
    <div className="section-miracle-info flex flex-col">
      <MiraclePicker
        className="box-border w-100 px-3 py-3 mx-8 my-8 right-104 top-0 bottom-0 rounded bg-gray-900"
        show={miraclePickerShow}
        setShow={setMiraclePickerShow}
        onSelect={handleSelectMiracle}
      />

      <MiracleNodePicker
        className="box-border w-100 px-3 py-3 mx-8 my-8 right-104 top-0 bottom-0 rounded bg-gray-900"
        miracle={miracle}
        show={miracleNodePickerShow}
        setShow={setMiracleNodePickerShow}
        onSelect={handleSelectMiracleNode}
      />

      <div className="miracle relative" onMouseDown={handleStopPropagation}>
        <TheMiracleII miracle={miracle} memo={memo} onSelect={handleSetMiracle} />
        <BackgroundText>Miracle</BackgroundText>
      </div>

      <div className="miracle-node relative mt-4" onMouseDown={handleStopPropagation}>
        <TheMiracleNodeII miracleNode={miracleNode} onSelect={handleSetMiracleNode} />
        <BackgroundText>Node</BackgroundText>
      </div>
    </div >
  )
}

function SectionScheduleTime({ memo, onUpdate }) {
  const [startTimeDatePickerShow, setStartTimeDatePickerShow] = useState(false)
  const [expireTimeDatePickerShow, setExpireTimeDatePickerShow] = useState(false)

  const handleStopPropagation = useStopPropagation()

  const handleSetStartTime = useCallback(() => {
    if (startTimeDatePickerShow) {
      setStartTimeDatePickerShow(false)
    } else {
      setStartTimeDatePickerShow(true)
      setExpireTimeDatePickerShow(false)
    }
  }, [startTimeDatePickerShow])

  const handleSetExpireTime = useCallback(() => {
    if (expireTimeDatePickerShow) {
      setExpireTimeDatePickerShow(false)
    } else {
      setExpireTimeDatePickerShow(true)
      setStartTimeDatePickerShow(false)
    }
  }, [expireTimeDatePickerShow])

  const handleSelectStartTime = useCallback(date => {
    const startTime = date ? dayjs(date).millisecond(0).valueOf() : date

    if (!memo[Timer]) {
      arona.addComponent(memo, Timer, {
        startTime,
      })

      return
    }

    memo[Timer].startTime = startTime
    onUpdate(memo)
  }, [memo, onUpdate])

  const handleSelectExpireTime = useCallback(date => {
    const expireTime = date ? dayjs(date).millisecond(0).valueOf() : date

    if (!memo[Timer]) {
      arona.addComponent(memo, Timer, {
        expireTime,
      })

      return
    }

    memo[Timer].expireTime = expireTime
    onUpdate(memo)
  }, [memo, onUpdate])

  console.log('expireTime', memo[Timer]?.expireTime)

  return (
    <div className="section-schedule-time flex flex-col">
      <AronaDatePicker
        date={memo[Timer]?.startTime}
        className="box-border mx-8 my-8 right-104 top-0 bottom-0 rounded bg-gray-900"
        show={startTimeDatePickerShow}
        setShow={setStartTimeDatePickerShow}
        onSelect={handleSelectStartTime}
      />

      <AronaDatePicker
        date={memo[Timer]?.expireTime}
        className="box-border mx-8 my-8 right-104 top-0 bottom-0 rounded bg-gray-900"
        show={expireTimeDatePickerShow}
        setShow={setExpireTimeDatePickerShow}
        onSelect={handleSelectExpireTime}
      />

      <div className="timer relative rounded bg-white/10 overflow-hidden" onMouseDown={handleStopPropagation}>
        <BackgroundText>计划</BackgroundText>

        <div className="start-time flex p-3" onClick={handleSetStartTime}>
          <div className="name mr-4">开始时间</div>
          <AronaTime
            className="text-white/40 ml-1"
            time={memo[Timer]?.startTime}
          />
        </div>
        <div className="expire-time flex p-3" onClick={handleSetExpireTime}>
          <div className="name mr-4">结算时间</div>
          <AronaTime
            className="text-white/40 ml-1"
            time={memo[Timer]?.expireTime}
          />
        </div>
      </div>
    </div>
  )
}

function BackgroundText({ className, children, size = 80, bottom = -20, right = 8 }) {
  return (
    <div className="background-text absolute inset-0 overflow-hidden flex justify-end z--1">
      <div
        className={classNames("text-white/10 absolute", className)}
        style={{ bottom, right, 'fontSize': size }}
      >
        {children}
      </div>
    </div>
  )
}

function useHandleClickOutside(ref, onClickOutside, type = 'mousedown') {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        onClickOutside(event)
      }
    }

    document.addEventListener(type, handleClickOutside)

    return () => {
      document.removeEventListener(type, handleClickOutside)
    }
  }, [onClickOutside])
}
