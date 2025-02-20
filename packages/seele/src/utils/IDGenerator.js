export function IDGenerator(id = 0) {
  return {
    gen() {
      return ++id
    },
    get() {
      return id
    },
    set(value) {
      id = value
    },
  }
}
