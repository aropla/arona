import { useRef } from 'react'

export function defineController(controllerCtor) {
  const listeners = []
  const listenerPositionMap = new Map()

  const helper = {
    subscribe(listener) {
      listeners.push(listener)
      listenerPositionMap.set(listener, listeners.length - 1)

      return () => {
        const position = listenerPositionMap.get(listener)
        const tailListener = listeners[listeners.length - 1]

        if (tailListener !== listener) {
          listeners[position] = tailListener
          listenerPositionMap.set(tailListener, position)
        }

        listeners.pop()
      }
    },

    render(value = Date.now()) {
      listeners.forEach(listener => listener(value))
    },
  }

  return (...args) => {
    const controller = controllerCtor(helper, ...args)

    if (!controller.subscribe) {
      controller.subscribe = helper.subscribe
    }

    return controller
  }
}

export function defineControllerWithName(controllerCtor) {
  const names = []
  const listenersMap = new Map()

  const helper = {
    subscribe(name, listener) {
      let listeners = listenersMap.get(name)

      if (listeners === undefined) {
        listeners = []
        listenersMap.set(name, listeners)
        names.push(name)
      }

      listeners.push(listener)

      return () => {
        const listeners = listenersMap.get(name)
        const index = listeners.findIndex(l => l === listener)

        listeners.splice(index, 1)
      }
    },
    render(name, value = Date.now()) {
      const listeners = listenersMap.get(name)

      listeners?.forEach(listener => listener(value))
    },
    renderAll(value = Date.now()) {
      names.forEach(name => {
        const listeners = listenersMap.get(name)

        listeners?.forEach(listener => listener(value))
      })
    },
    traverse(cb) {
      names.forEach(name => {
        cb(name)
      })
    },
  }

  return (...args) => {
    const controller = controllerCtor(helper, ...args)

    if (!controller.subscribe) {
      controller.subscribe = helper.subscribe
    }

    return controller
  }
}

export function buildController(controller, onCreated) {
  return (...args) => {
    const instance = useRef()

    if (instance.current === undefined) {
      instance.current = controller(...args)
    }

    onCreated && onCreated(instance.current)

    return instance.current
  }
}
