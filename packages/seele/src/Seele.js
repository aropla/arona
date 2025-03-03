import { EntityManager, ArchetypeBuilder } from './Entity'
import { Loop } from './Loop'
import { QueryManager, QueryBuilder } from './Query'
import { ComponentManager, ComponentRegistry } from './Component'
import { SystemManager } from './System'
import { Bus } from './fairy'
import { PluginManager } from './Plugin'
import { Upgrader } from './Upgrader'
import { isFunction } from './utils'

export const componentRegistry = ComponentRegistry()

export function Seele() {
  const seele = {
    value: null,
  }

  const state = {
    ready: false,
  }

  const bus = Bus()

  const componentManager = ComponentManager(componentRegistry, bus)
  const entityManager = EntityManager(componentManager, bus)
  const queryManager = QueryManager(bus)
  const systemManager = SystemManager(seele, bus)
  const pluginManager = PluginManager()
  const upgrader = Upgrader(seele)
  const loop = Loop()

  const delayTasks = []

  init()

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
    createEntity(archetypeBuilder, entity, count) {
      return entityManager.createEntity(archetypeBuilder, entity, count)
    },
    pureCreateEntity(archetypeBuilder, entity, count) {
      return entityManager.pureCreateEntity(archetypeBuilder, entity, count)
    },
    removeEntity(entity) {
      return entityManager.removeEntity(entity)
    },
    query(queryBuilderOrQueryCreator) {
      let queryBuilder = queryBuilderOrQueryCreator

      if (isFunction(queryBuilderOrQueryCreator)) {
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
        return componentRegistry.getName(component)
      }
    },
    hydrate(dehydration) {
      if (dehydration == null) {
        return
      }

      const { patcher, added, removed, changed } = upgrader.resolve(dehydration)
      const oldArchetypes = dehydration.archetypes

      for (let i = 0; i < oldArchetypes.length; i++) {
        const oldArchetype = oldArchetypes[i]

        entityManager.hydrate(oldArchetype, patcher)
      }

      return { patcher, added, removed, changed }
    },
    dehydrate(options = {}) {
      const dehydration = Object.create(null)

      if (options.component !== false) {
        dehydration.component = componentManager.dehydrate()
      }

      if (options.archetype !== false) {
        dehydration.archetypes = entityManager.dehydrate()
      }

      return dehydration
    },
  }

  function init() {
    loop.setBegin(beforeUpdate)
    loop.setUpdate(update)
    loop.setDraw(renderer)
    loop.setEnd(afterUpdate)
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
  return componentRegistry.add(name, () => true)
}

export function defineComponent(componentCreator, name) {
  if (typeof componentCreator === 'string' && name === undefined) {
    name = componentCreator
    return defineTagComponent(name)
  }

  return componentRegistry.add(name, componentCreator)
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
