import { AronaScrollView, useAronaScrollView } from '@/components/AronaView/AronaScrollView/AronaScrollView'
import { useMemo } from 'react'
import gsap from 'gsap'
import { useCallback } from 'react'
import { useState } from 'react'
import classNames from 'classnames'
import { List } from '@utils'
import { Position } from '@arona/components'
import { createContext } from 'react'
import { Noop } from '@utils'
import { useContext } from 'react'
import { useEffect } from 'react'
import { useAndExecutor } from '@hooks'
import { useRef } from 'react'

const AronaDigitPickerGroupContext = createContext()

const TRIGGERS = {
  USE_EFFECT: 0,
  SCROLLER_READY: 1,
}

export function AronaDigitPicker({ className, children, digit = 0, position = 0, min = 0, max = 9, onSelect = Noop, size = { width: 80, height: 80 }, onCarryChange = Noop }) {
  const groupContext = useContext(AronaDigitPickerGroupContext)

  const count = useMemo(() => max - min + 1, [max, min])
  const chunksCount = 3
  const prevDigit = useRef(-1)

  /**
   * 用来保证以下两个条件都触发时，才进行的初始滚动动画：
   * 1. scroller 完成各个所需 DOM 的初始化 size 测量
   * 2. useEffect 被触发，（即传入了新的 digit）
   */
  const executor = useAndExecutor((props) => {
    const digit = props[TRIGGERS.USE_EFFECT]
    const chunkY = view.contentSize.y / chunksCount

    view.scrollTo({ y: chunkY + size.height * digit }, true)
  })

  /**
   * 由于可能存在如分、秒等有数字范围的情况，比如 0-59。并且该组件的值域为 0-99。
   * 当以下情况发生时，会出现数字滚动动画播放错误的 Bug：
   * 向外传出一个大于 59 的值，比如 98，那么父组件对值进行 clamp(98, 0, 59) = 59。
   * 那么 digit 当前为 59。再次滚动数字到 99，那么父组件对值进行 clamp(99, 0, 59) = 59。
   * 此时由于两次 digit 皆为 59，那么不会触发 useEffect，从而不会触发数字滚动动画的播放。
   * 所以这里的处理是记录上一次的 digit，如果当前的 digit 与上一次的 digit 不一致，则触发 useEffect
   */
  if (prevDigit.current !== digit) {
    executor.trigger(TRIGGERS.USE_EFFECT, digit)
    prevDigit.current = digit
  }

  const view = useAronaScrollView({
    infinite: true,
    friction: 1,
    accelerationFriction: 0.3,
    scroller: {
      friction: 0.8,
    },
    onReady: useCallback(() => {
      executor.trigger(TRIGGERS.SCROLLER_READY)
    }, []),
    onScroll: useCallback((_, velocity) => {
      const y = view.scroller[Position].y
      const chunkY = view.contentSize.y / chunksCount
      const carryY = (y - chunkY) / (chunkY - size.height + size.height * 0.5)

      if (carryY > 1 && velocity > 0) {
        view.scrollBy({ y: -chunkY })
        onCarryChange(1)
      } else if (carryY < 0 && velocity < 0) {
        view.scrollBy({ y: chunkY })
        onCarryChange(-1)
      }
    }, [onCarryChange]),
    onScrollEnd: useCallback(() => {
      const y = view.scroller[Position].y
      const offset = y % size.height
      const offsetY = offset >= (size.height * 0.5) ? size.height - offset : -offset
      const finalY = y + offsetY

      const num = (finalY / size.height) % count

      groupContext.onSelect?.(num, position)
      onSelect(num, position)
      prevDigit.current = num

      view.scrollTo({ y: finalY }, {
        duration: 0.5,
        ease: "elastic",
      })
    }, [position, onSelect, groupContext.onSelect])
  })

  const cells = useMemo(() => List(count), [count])

  return (
    <div
      className={classNames(
        "scrollable-picker-cell flex flex-col relative box-border",
        "rounded bg-white/10",
        className
      )}
      style={{
        width: size.width,
        height: size.height,
      }}
    >
      <AronaScrollView controller={view} hideScrollbar>
        {
          cells.map(cell => (
            <DigitPickerCell key={0 * count + cell} className="bg-transparent! color-white/10" digit={cell}></DigitPickerCell>
          ))
        }
        {
          cells.map(cell => (
            <DigitPickerCell key={1 * count + cell} className="bg-transparent! color-white/10" digit={cell}></DigitPickerCell>
          ))
        }
        {
          cells.map(cell => (
            <DigitPickerCell key={2 * count + cell} className="bg-transparent! color-white/10" digit={cell}></DigitPickerCell>
          ))
        }
      </AronaScrollView>
      {children}
    </div >
  )
}

function DigitPickerCell({ className, digit }) {
  // TODO: Change font-family
  return (
    <div
      className={classNames(
        "picker-cell relative flex justify-center items-center flex-none box-border w-20 h-20 p-3 border-2 border-solid border-transparent ",
        "text-15",
        className
      )}
    >
      {digit % 10}
    </div>
  )
}

export function AronaDigitPickerGroup({ children, className, digits, fixedLength, ranges = [], onSelect = Noop, onCarryChange = Noop }) {
  const nums = (() => {
    if (Number(fixedLength)) {
      const digitsLength = String(digits).length
      const chars = digitsLength < fixedLength ? '0'.repeat(fixedLength - digitsLength) + digits : String(digits)
      const arr = List(fixedLength).map((_, index) => Number(chars[index]))

      return arr
    } else {
      return String(digits).split('').map(Number)
    }
  })()

  const handleSelect = useCallback((digit, position) => {
    nums[position] = digit

    const digitsStr = nums.join('')
    const digits = Number(digitsStr)

    onSelect(digits)
  }, [nums, onSelect])

  const handleCarryChange = useCallback(position => carry => {
    onCarryChange(carry, position)
  }, [])

  return (
    <AronaDigitPickerGroupContext.Provider value={{ onSelect: handleSelect }}>
      <div className={classNames('arona-digit-picker flex space-x-1', className)}>
        {
          children
            ? children
            : nums.map((num, index) => {
              const [min, max] = ranges[index] ?? []

              return (
                <AronaDigitPicker digit={num} key={index} position={index} min={min} max={max} onCarryChange={handleCarryChange(index)}></AronaDigitPicker>
              )
            })
        }
      </div>
    </AronaDigitPickerGroupContext.Provider>
  )
}
