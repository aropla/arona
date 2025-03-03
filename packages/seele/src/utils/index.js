export * from './BitSet'
export * from './IDGenerator'

export function Noop() { }

export function isFunction(obj) {
  return typeof obj === 'function'
}

export function isNotNullObject(obj) {
  return obj !== null && typeof obj === 'object'
}
