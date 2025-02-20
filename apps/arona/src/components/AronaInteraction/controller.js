import { defineControllerWithName, buildController } from '@/components'

const aronaFormController = defineControllerWithName(({ render, traverse, subscribe }, defaultData = {}, options) => {
  let data = {
    ...defaultData,
  }

  return {
    get data() {
      return data
    },
    setData(value) {
      if (value != null) {
        data = value
      }

      traverse(name => {
        set(name, get(name))
      })
    },
    set,
    get,
    clear() {
      data = Object.create(null)

      render('')
    },
    submit,
    validate,
    subscribe(name, listener) {
      const key = normalizeKey(name)
      const unsubscribe = subscribe(key, listener)

      return unsubscribe
    },
  }

  function set(name, value) {
    setField(name, value)

    const key = normalizeKey(name)
    render(key, value)
  }

  function setField(name, value) {
    let node = data
    const names = Array.isArray(name) ? name : String(name).split('.')

    for (let i = 0; i < names.length - 1; i++) {
      const pathName = names[i]

      if (node[pathName] === undefined) {
        node[pathName] = Object.create(null)
      }

      node = node[pathName]
    }

    node[names[names.length - 1]] = value
  }

  function get(name) {
    if (name === undefined) {
      return data
    }

    let node = data
    const names = Array.isArray(name) ? name : String(name).split('.')

    for (let i = 0; i < names.length - 1; i++) {
      const pathName = names[i]

      if (node[pathName] === undefined) {
        return undefined
      }

      node = node[pathName]
    }

    return node[names[names.length - 1]]
  }

  function submit() {
    console.log('data', data)
  }

  function validate() {

  }
})

export function normalizeKey(name) {
  if (Array.isArray(name)) {
    return name.join('.')
  }

  if (typeof name === 'string') {
    return name
  }

  return String(name)
}

export const useAronaForm = buildController(aronaFormController)
