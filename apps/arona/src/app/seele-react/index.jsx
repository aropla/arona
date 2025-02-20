import { createContext } from 'react'
import { useRef } from 'react'
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
  const [_, render] = useState(Date.now())

  return () => {
    render(Date.now())
  }
}

const SeeleContext = createContext()

export function useSeeleQuery(queryBuilder, options = {}) {
  const seele = useContext(SeeleContext)
  const query = useRef()
  const render = useRenderer()

  if (query.current === undefined) {
    query.current = seele.query(queryBuilder)
  }

  useEffect(() => {
    query.current.on('size:changed', () => {
      console.log('size:changed')
      render()
    })

    return () => {
      query.current.off('size:changed', render)
    }
  }, [])

  return query.current
}

export function SeeleProvider({ children, seele }) {
  return (
    <SeeleContext.Provider value={seele}>
      {children}
    </SeeleContext.Provider>
  )
}
