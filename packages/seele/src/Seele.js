import { EntityManager, ArchetypeBuilder } from './Entity'
import { Loop } from './Loop'
import { QueryManager, QueryBuilder } from './Query'
import { ComponentManager, ComponentRecorder } from './Component'
import { SystemManager } from './System'
import { Bus } from './fairy'
import { PluginManager } from './Plugin'

export const componentRecorder = ComponentRecorder()

/**
 * Build-in components
 */
export const Enabled = defineComponent('Enabled')
export const Disabled = defineComponent('Disabled')
export const Removed = defineComponent('removed')
export const Dirty = defineComponent('dirty')

export function Seele() {
  const seele = {
    value: null,
  }

  const state = {
    ready: false,
  }

  const bus = Bus()

  const componentManager = ComponentManager(componentRecorder, bus)
  const entityManager = EntityManager(componentManager, bus)
  const queryManager = QueryManager(bus)
  const systemManager = SystemManager(seele, bus)
  const pluginManager = PluginManager()
  const loop = Loop()

  const delayTasks = []

  init()
  initBuildinComponents()

  return {
    component: componentManager,
    entity: entityManager,
    loop,
    vollerei() {
      seele.value = this

      return this
    },
    ready,
    start() {
      ready()
      systemManager.start()
      loop.start()
    },
    stop() {
      systemManager.stop()
      loop.stop()
    },
    registerComponent(rawComponent) {
      componentManager.register(rawComponent)

      return this
    },
    registerEntity(rawEntity) {
      entityManager.register(rawEntity)

      return this
    },
    registerSystem(rawSystem) {
      systemManager.register(rawSystem)

      return this
    },
    createComponent(component) {
      return componentManager.get(component)
    },
    createEntity(entity, count) {
      return entityManager.createEntity(entity, count)
    },
    removeEntity(entity) {
      return entityManager.removeEntity(entity)
    },
    query(queryBuilderOrQueryCreator) {
      let queryBuilder = queryBuilderOrQueryCreator

      if (typeof queryBuilderOrQueryCreator === 'function') {
        const queryCreator = queryBuilderOrQueryCreator
        queryBuilder = defineQuery(queryCreator)
      }

      return queryManager.addQuery(queryBuilder)
    },
    getQuery(queryBuilder) {
      return queryManager.get(queryBuilder)
    },
    addComponent(entity, component, props) {
      const archetype = entityManager.find(entity)

      archetype?.addComponent(entity, component, props)
    },
    removeComponent(entity, component) {
      const archetype = entityManager.find(entity)

      archetype?.removeComponent(entity, component)
    },
    hasEntity(entity) {
      return entityManager.has(entity)
    },
    hasComponent(component) {
      return componentManager.has(component)
    },
    registerPlugin(plugin) {
      pluginManager.register(plugin)

      return this
    },
    delay(fn) {
      delayTasks.push(fn)
    },
    on(name, fn) {
      bus.on(name, fn)
    },
    off(name, fn) {
      bus.off(name, fn)
    },
    emit(name, options) {
      bus.emit(name, options)
    },
    debug: {
      getName(component) {
        return componentRecorder.getName(component)
      }
    },
  }

  function init() {
    loop.setBegin(beforeUpdate)
    loop.setUpdate(update)
    loop.setDraw(renderer)
    loop.setEnd(afterUpdate)
  }

  function initBuildinComponents() {
    componentManager.register(Enabled)
    componentManager.register(Disabled)
    componentManager.register(Removed)
    componentManager.register(Dirty)
  }

  function ready() {
    if (state.ready) {
      return
    }

    entityManager.traverse(queryManager.tryAddArchetype)

    bus.on('archetype:created', ({ archetype }) => {
      queryManager.tryAddArchetype(archetype)
    })

    bus.on('query:created', ({ query }) => {
      entityManager.traverse(archetype => {
        query.tryAddArchetype(archetype)
      })
    })

    pluginManager.ready(seele.value)
    pluginManager.release()

    state.ready = true
  }

  function beforeUpdate(timestamp, delta) {
    systemManager.traverse(system => {
      system.onBeforeUpdate(timestamp, delta)
    })
  }

  function update(delta) {
    systemManager.traverse(system => {
      system.onUpdate(delta)
    })
  }

  function renderer(interp) {
    systemManager.traverse(system => {
      system.onRender(interp)
    })
  }

  function afterUpdate(fps, panic) {
    systemManager.traverse(system => {
      system.onAfterUpdate(fps, panic)
    })

    for (let i = 0; i < delayTasks.length; i++) {
      const task = delayTasks[i]
      task()
    }

    delayTasks.length = 0

    if (panic) {
      loop.resetFrameDelta()
    }
  }
}

export function defineTagComponent(name) {
  return componentRecorder.add(name, () => true)
}

export function defineComponent(componentCreator, name) {
  if (typeof componentCreator === 'string' && name === undefined) {
    name = componentCreator
    return defineTagComponent(name)
  }

  return componentRecorder.add(name, componentCreator)
}

export function defineEntity(entityCreator) {
  const archetypeBuilder = ArchetypeBuilder()
  entityCreator(archetypeBuilder)

  return archetypeBuilder
}

export function defineSystem(systemCreator) {
  return systemCreator
}

export function defineQuery(queryCreator) {
  const queryBuilder = QueryBuilder()
  queryCreator(queryBuilder)

  return queryBuilder
}
