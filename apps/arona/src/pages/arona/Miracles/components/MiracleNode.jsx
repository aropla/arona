import { useRef, useCallback } from 'react'
import classNames from 'classnames'

import { MiracleNodeID, MiracleNodeRef, Position, Temp, Profile } from '@arona/components'

export function MiracleNode({ miracleNode, editor, mapView, onSelect, onDragStart }) {
  const ref = useRef()
  const isRoot = miracleNode[MiracleNodeID] === miracleNode[MiracleNodeRef]

  const mouseDown = useRef({
    time: 0,
    position: {
      x: 0,
      y: 0,
    },
  })

  const selectModeTimer = useRef()

  /**
   * 1. 我们有 onSelect 的时候, 也自然需要 onUnselect 的时候
   * onSelect 的 mouseUp 绑定在 window 上, onUnselect 将会在外层进行处理
   * 此时冒泡顺序是 onUnselect -> onSelect, 而我们想要的是 onSelect -> onUnselect, 这样才会比较符合认知
   * 所以让 onSelect 在捕获阶段执行来改变顺序
   */
  const handleMouseDown = useCallback(event => {
    mouseDown.current.time = Date.now()
    mouseDown.current.position = {
      x: event.clientX,
      y: event.clientY,
    }

    selectModeTimer.current = setTimeout(() => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp, true)

      onDragStart({ miracleNode, $miracleNode: ref.current, event })
    }, 250)

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp, true) /* 1 */

    function handleMouseMove(event) {
      const distance = Math.sqrt(
        Math.pow(event.clientX - mouseDown.current.position.x, 2) +
        Math.pow(event.clientY - mouseDown.current.position.y, 2)
      )

      if (distance <= 10) {
        return
      }

      clearTimeout(selectModeTimer.current)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp, true)

      onDragStart({ miracleNode, $miracleNode: ref.current, event })
    }

    function handleMouseUp(event) {
      event.stopPropagation()

      const duration = Date.now() - mouseDown.current.time
      const distance = Math.sqrt(
        Math.pow(event.clientX - mouseDown.current.position.x, 2) +
        Math.pow(event.clientY - mouseDown.current.position.y, 2)
      )

      /* Click */
      if (duration <= 250 && distance <= 10) {
        clearTimeout(selectModeTimer.current)
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp, true)

        onSelect({ miracleNode, event })
      }
    }
  }, [miracleNode])

  const position = toMiracleNodeRenderCoord(miracleNode, editor, 1)

  return (
    <div
      ref={ref}
      id={`miracleNode.${miracleNode[MiracleNodeID]}`}
      className={classNames("miracle-node flex rounded select-none absolute", "")}
      style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
      onMouseDown={handleMouseDown}
    >
      <div
        className={classNames(
          "miracle flex box-border w-50 h-20 p-2 rounded bg-white/20 transition ease-in-out duration-350",
          `${miracleNode[Temp] ? 'bg-purple-600!' : ''}`,
          isRoot ? 'bg-blue-500/80!' : '',
        )}
      >
        <div className="profile">
          <div className="name text-3">{miracleNode[Profile].name}</div >
          <div className="desc text-3 text-white/50">{miracleNode[Profile].desc}</div>
        </div>

        <div className="vec2 absolute text-3 flex bottom-0.5 left-0.5 color-gray">
          <div className="x">({miracleNode[Position].x}, </div>
          <div className="y">{miracleNode[Position].y})</div>
          <div className="id">id: {miracleNode[MiracleNodeID]}</div>
        </div>
      </div>
    </div >
  )
}

export function toMiracleNodeRenderCoord(miracle, editor) {
  return {
    x: miracle[Position].x - editor.miracleWidth / 2,
    y: miracle[Position].y - editor.miracleHeight / 2,
  }
}
