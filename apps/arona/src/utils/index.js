export function distance(p1, p2) {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2))
}

export function List(count, value) {
  const result = []

  for (let i = 0; i < count; i++) {
    result[i] = value ?? i
  }

  return result
}

export function Noop() { }

export const OK = 1

export function AndExecutor(cb = Noop, target = 2) {
  let triggers = List(target, 0)
  let props = []

  return {
    trigger(index, prop) {
      triggers[index] = 1
      props[index] = prop

      if (triggers.every(Boolean)) {
        cb(props)
      }
    },
    clear() {
      triggers = List(target, 0)
      props = []
    },
  }
}
