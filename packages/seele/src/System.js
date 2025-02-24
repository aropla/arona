import { Noop } from './utils'

export function SystemManager(seele) {
  const systems = []

  return {
    register(systemCreator) {
      const system = systemCreator(seele.value) ?? Object.create(null)

      if (system.onBeforeUpdate === undefined) {
        system.onBeforeUpdate = Noop
      }

      if (system.onUpdate === undefined) {
        system.onUpdate = Noop
      }

      if (system.onStart === undefined) {
        system.onStart = Noop
      }

      if (system.onStop === undefined) {
        system.onStop = Noop
      }

      if (system.onRender === undefined) {
        system.onRender = Noop
      }

      if (system.onAfterUpdate === undefined) {
        system.onAfterUpdate = Noop
      }

      systems.push(system)
    },
    traverse(cb) {
      for (let i = 0; i < systems.length; i++) {
        cb(systems[i])
      }
    },
    beforeUpdate(timestamp, delta) {
      for (let i = 0; i < systems.length; i++) {
        systems[i].onBeforeUpdate(timestamp, delta)
      }
    },
    update(delta) {
      for (let i = 0; i < systems.length; i++) {
        systems[i].onUpdate(delta)
      }
    },
    start() {
      for (let i = 0; i < systems.length; i++) {
        systems[i].onStart()
      }
    },
    stop() {
      for (let i = 0; i < systems.length; i++) {
        systems[i].onStop()
      }
    }
  }
}
