import { useRef } from "react"
import { useCallback } from "react"
import { useEffect } from "react"

const mouse = {
  x: 0,
  y: 0,
  isDown: false,
  context: Object.create(null),
}

const mouseEvents = {
  down: [],
  move: [],
  up: [],
}

export function useMouse() {
  return [mouse]
}

export function useMouseEvent(type, fn) {
  useEffect(() => {
    mouseEvents[type].push(fn)

    return () => {
      mouseEvents[type] = mouseEvents[type].filter(event => event !== fn)
    }
  }, [fn])
}

export function useMouseRegistry() {
  const handleMouseDown = useCallback(event => {
    mouse.isDown = true

    for (let i = 0; i < mouseEvents.down.length; i++) {
      mouseEvents.down[i](mouse, event)
    }
  })

  const handleMouseMove = useCallback(event => {
    mouse.x = event.clientX
    mouse.y = event.clientY

    for (let i = 0; i < mouseEvents.move.length; i++) {
      mouseEvents.move[i](mouse, event)
    }
  })

  const handleMouseUp = useCallback(event => {
    mouse.isDown = false

    for (let i = 0; i < mouseEvents.up.length; i++) {
      mouseEvents.up[i](mouse, event)
    }
  })

  useEffect(() => {
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  return [mouse]
}
