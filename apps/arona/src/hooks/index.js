import { useEffect, useCallback, useRef } from 'react'
import gsap from 'gsap'
import { Noop, AndExecutor } from '@utils'

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

export function useStopPropagation() {
  const handleStopPropagation = useCallback(event => {
    event.stopPropagation()
  }, [])

  return handleStopPropagation
}

export function useFadeAnimation(ref, gsapOptions = {}, options = {}) {
  const animationRef = useRef()

  useEffect(() => {
    if (!animationRef.current) {
      animationRef.current = gsap.to(ref.current, {
        paused: true,
        ease: 'power1.inOut',
        ...gsapOptions,
      })
    }
  }, [])

  useEffect(() => {
    if (options.observe == null) {
      return
    }

    options.observe() ? animationRef.current.play() : animationRef.current.reverse()
  }, [options.observe])

  return {
    play() {
      animationRef.current.play()
    },
    reverse() {
      animationRef.current.reverse()
    },
    kill() {
      animationRef.current.kill()
    },
    setGsapOptions(gsapOptions) {
      animationRef.current = gsap.to(ref.current, {
        paused: true,
        ...gsapOptions,
      })
    },
  }
}

const supports = {
  ResizeObserver: typeof ResizeObserver === 'function',
}

export function useResize(ref, onResize, enabled = true) {
  const handleResize = useCallback(() => {
    onResize()
  }, [onResize])

  useEffect(() => {
    if (!enabled) {
      return
    }

    if (supports.ResizeObserver) {
      const resizeObserver = new ResizeObserver(handleResize)
      resizeObserver.observe(ref.current)

      return () => resizeObserver.disconnect()
    } else {
      window.addEventListener('resize', handleResize)

      return () => window.removeEventListener('resize', handleResize)
    }
  }, [onResize, enabled])
}

export function useWheel(ref, options = {}) {
  const { onInit = Noop, onWheel = Noop, onWheelStart = Noop, onWheelEnd = Noop, endThreshold = 100 } = options
  let timer = useRef()
  let wheeling = useRef(false)

  const handleWheel = useCallback(event => {
    event.preventDefault()

    if (!wheeling.current) {
      onWheelStart(event)
    }

    wheeling.current = true
    onWheel(event)

    if (timer.current) {
      clearTimeout(timer.current)
    }

    timer.current = setTimeout(() => {
      wheeling.current = false
      onWheelEnd(event)
    }, endThreshold)
  }, [onWheelStart, onWheel, onWheelEnd, endThreshold])

  useEffect(() => {
    const element = ref.current

    if (!element) {
      return
    }

    onInit(element)

    element.addEventListener('wheel', handleWheel)

    return () => {
      element.removeEventListener('wheel', handleWheel)
    }
  }, [handleWheel])
}

export function useAndExecutor(cb) {
  const executor = useRef(AndExecutor(cb))

  return executor.current
}
