import classNames from 'classnames'
import { List } from '@utils'
import { useMemo } from "react"
import { AronaScrollView, useAronaScrollView } from '@/components/AronaView/AronaScrollView/AronaScrollView'
import { useCallback } from 'react'
import { useState } from 'react'
import { useEffect } from 'react'

function TicksChunk({ level, count, Template, props }) {
  const ticks = useMemo(() => List(count), [count])

  return (
    <>
      {
        ticks.map(i => {
          const index = level * count + i

          return <Template key={index} index={index} {...props} />
        })
      }
    </>
  )
}

export function AronaTimeline({ className, children, chunksCount = 3, ticksCountPerChunk = 10, Template = Tick, ...props }) {
  const options = {
    offset: 0.2,
  }

  const [level, setLevel] = useState(1)

  const view = useAronaScrollView({
    axis: "x",
    hideScrollbar: true,
    infinite: true,
    onScroll: useCallback(distance => {
      if (distance > (level - options.offset)) {
        setLevel(level => level + 1)
        view.scrollBy({ x: -view.contentSize[view.axis] / chunksCount })
      } else if (distance < (level - 1 + options.offset)) {
        setLevel(level => level - 1)
        view.scrollBy({ x: view.contentSize[view.axis] / chunksCount })
      }
    }, [level]),
  })

  const chunks = useMemo(() => List(chunksCount), [chunksCount])

  return (
    <div className={classNames(
      "arona-timeline relative w-full flex flex-col",
      className,
    )}>
      {children}
      <AronaScrollView
        controller={view}
      >
        <div className="ticks flex-1 flex">
          {
            chunks.map(chunk => (
              <TicksChunk
                key={chunk - 1}
                level={level + chunk - 1}
                count={ticksCountPerChunk}
                Template={Template}
                props={props}
              />
            ))
          }
        </div>
      </AronaScrollView>
    </div>
  )
}

export function AronaPaimon({ className }) {
  const zoomMap = ['60分钟', '8小时', '24小时', '7天', '15天', '30天', '3个月', '6个月', '12个月']
  const zoomWidthPercent = 1.0
  const ticksMap = [12, 8, 24, 7, 15, 30, 3, 6, 12]

  const zoomLevel = 2

  const ticksCount = ticksMap[zoomLevel]
  const ticks = useMemo(() => List(ticksCount), [ticksCount])

  console.log('ticks', ticks)

  return (
    <div className={classNames(
      "arona-paimon w-full h-15 rounded bg-white/10",
      className,
    )}>
      <div className="timeline h-0.5 bg-white/50 rounded-tl rounded-tr"></div>
      <div className="ticks flex justify-between">
        {
          ticks.map(index => (
            <div key={index} className="tick w-0.5 h-2 rounded-bl rounded-br bg-white/20"></div>
          ))
        }
      </div>
    </div>
  )
}
