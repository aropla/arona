import classNames from 'classnames'
import { useEffect } from 'react'
import { useCallback } from 'react'
import { useRef } from 'react'
import { useAronaScrollView } from './controller'
import { useResize, useWheel } from '@hooks'
import { useSeeleFrame } from '@app/seele-react'
import { Renderer } from '@arona/components'
import { useMemo } from 'react'

export { useAronaScrollView }

export function AronaScrollView({ children, className, scrollbarClassName, scrolltrackClassName, thumbClassName, controller, hideScrollbar = false, ...options }) {
  const view = controller ?? useAronaScrollView(options)
  const scrollRef = useRef()
  const viewportRef = useRef()
  const contentRef = useRef()
  const scrollbarRef = useRef()
  const thumbRef = useRef()

  const handleWheel = useCallback(event => view.addAcceleration(event.deltaY * 0.01), [])

  useWheel(scrollRef, { onWheel: handleWheel })
  useSeeleFrame(view.update)

  useEffect(() => {
    const scroller = view.scroller
    const thumb = view.thumb

    const $content = contentRef.current
    const $thumb = thumbRef.current

    arona.addComponent(scroller, Renderer, () => {
      const [position, lastPosition] = view.getScrollerPosition()

      if (position[view.axis] !== lastPosition[view.axis]) {
        $content.style.transform = `translate(${position.x}px, ${position.y}px)`
      }
    })

    if (!hideScrollbar) {
      arona.addComponent(thumb, Renderer, () => {
        const [size, lastSize] = view.getThumbSize()
        const [position, lastPosition] = view.getThumbPosition()

        if (size[view.axis] !== lastSize[view.axis]) {
          if (view.axis === 'y') {
            $thumb.style.height = `${size.y}px`
          } else {
            $thumb.style.width = `${size.x}px`
          }
        }

        if (position[view.axis] !== lastPosition[view.axis]) {
          $thumb.style.transform = `translate(${position.x}px, ${position.y}px)`
        }
      })
    }

    return () => {
      arona.removeComponent(scroller, Renderer)

      if (!hideScrollbar) {
        arona.removeComponent(thumb, Renderer)
      }
    }
  }, [hideScrollbar])

  useResize(viewportRef, useCallback(() => {
    const rect = viewportRef.current?.getBoundingClientRect()

    view.setViewportMaxSize(rect)
  }, []))

  useResize(contentRef, useCallback(() => {
    view.setContentSize({
      width: contentRef.current?.scrollWidth,
      height: contentRef.current?.scrollHeight,
    })
  }, []))

  useResize(scrollbarRef, useCallback(() => {
    const rect = scrollbarRef.current?.getBoundingClientRect()

    view.setScrollbarSize(rect)
  }, []), !hideScrollbar)

  return (
    <div className="arona-scroll-view relative flex-1 flex min-h-0" ref={scrollRef}>
      <div
        ref={viewportRef}
        className={classNames(
          'scroll-view overflow-hidden flex-1 flex flex-col min-h-0',
          className,
        )}
      >
        <div className="content" ref={contentRef}>
          {children}
        </div>
      </div>

      {
        !hideScrollbar && <AronaScrollbar
          scrollbarClassName={scrollbarClassName}
          scrolltrackClassName={scrolltrackClassName}
          thumbClassName={thumbClassName}
          view={view}
          scrollbarRef={scrollbarRef}
          thumbRef={thumbRef}
        />
      }
    </div>
  )
}

function AronaScrollbar({ view, scrollbarRef, thumbRef, scrollbarClassName, scrolltrackClassName, thumbClassName }) {
  const css = useMemo(() => {
    return {
      scrollbar: {
        y: 'mr-1 top-0 bottom-0 right-0',
        x: 'mb-1 left-0 right-0 bottom-0',
      },
      track: {
        y: 'w-2',
        x: 'h-2',
      },
      thumb: {
        y: 'w-full',
        x: 'h-full',
      },
    }
  }, [view.axis])

  return (
    <div
      ref={scrollbarRef}
      className={classNames(
        "arona-scrollbar flex",
        css.scrollbar[view.axis],
        scrollbarClassName,
      )}
    >
      <div className={classNames("track flex-1 rounded bg-white/20", css.track[view.axis], scrolltrackClassName)}>
        <div
          ref={thumbRef}
          className={classNames("thumb rounded bg-white/50", css.thumb[view.axis], thumbClassName)}
        />
      </div>
    </div>
  )
}
