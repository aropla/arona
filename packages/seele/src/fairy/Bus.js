export function Bus() {
  const map = new Map()

  function on(name, fn) {
    let fns = map.get(name)

    if (!fns) {
      fns = []
      map.set(name, fns)
    }

    fns.push(fn)

    return () => {
      off(name, fn)
    }
  }

  function emit(name, ...options) {
    const fns = map.get(name)

    if (!fns) {
      return
    }

    const len = fns.length
    for (let i = len - 1; i >= 0; i--) {
      fns[i](...options)
    }
  }

  function off(name, fn) {
    if (!name) {
      map.clear()

      return
    }

    if (!fn) {
      map.delete(name)

      return
    }

    const fns = map.get(name)

    if (!fns) {
      return
    }

    const index = fns.indexOf(fn)
    fns.splice(index, 1)
  }

  function once(name, fn) {
    const onceFn = options => {
      fn(options)
      off(name, onceFn)
    }

    return on(name, onceFn)
  }

  return {
    on,
    emit,
    off,
    once,
  }
}
