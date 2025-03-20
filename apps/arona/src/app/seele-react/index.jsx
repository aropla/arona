import { createContext } from 'react'
import { useRef } from 'react'
import { useCallback } from 'react'
import { useMemo } from 'react'
import { useState } from 'react'
import { useContext } from 'react'
import { useEffect } from 'react'
import { defineSystem } from 'seele'

let callbacks = []

const UseFrameSystem = defineSystem(() => {
  return {
    onUpdate(delta) {
      for (let i = 0; i < callbacks.length; i++) {
        callbacks[i](delta)
      }
    }
  }
})

export default function SeeleReact(seele) {
  seele.registerSystem(UseFrameSystem)
}

export function useSeeleFrame(cb, deps = []) {
  useEffect(() => {
    callbacks.push(cb)

    return () => {
      callbacks = callbacks.filter(callback => callback !== cb)
    }
  }, deps)
}


function useRenderer() {
  const [dep, render] = useState(Date.now())

  const rerender = useCallback(() => {
    render(Date.now())
  }, [])

  return [dep, rerender]
}

const SeeleContext = createContext()

export function useSeeleQuery(queryBuilder) {
  const seele = useContext(SeeleContext)
  const query = useRef()
  const [dep, render] = useRenderer()

  if (query.current === undefined) {
    query.current = seele.query(queryBuilder)
  }

  useEffect(() => {
    query.current.on('size:changed', render)

    return () => {
      query.current.off('size:changed', render)
    }
  }, [])

  const list = query.current.array()

  return [list, query.current]
}

export function SeeleProvider({ children, seele }) {
  return (
    <SeeleContext.Provider value={seele}>
      {children}
    </SeeleContext.Provider>
  )
}
