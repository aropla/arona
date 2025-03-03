import { IDGenerator, isFunction } from './utils'

export function ComponentManager(componentRegistry, bus) {
  const creatorMap = new Map()

  return {
    register(component) {
      creatorMap.set(component, componentRegistry.get(component))
    },
    has(component) {
      return creatorMap.has(component)
    },
    get(component) {
      return creatorMap.get(component)
    },
    create,
    addComponent(entity, component, props, archetype, newArchetype) {
      entity[component] = create(component, props)

      bus.emit('component:added', { archetype, newArchetype, entity, component })
    },
    removeComponent(entity, component, archetype, newArchetype) {
      entity[component] = undefined

      bus.emit('component:removed', { archetype, newArchetype, entity, component })
    },
    getMaxID() {
      return componentRegistry.getID()
    },
    dehydrate() {
      const names = []
      const components = []

      creatorMap.forEach((_, id) => {
        const name = componentRegistry.getName(id)

        names.push(name)
        components.push(id)
      })

      return {
        names,
        components,
      }
    },
  }

  function create(component, props) {
    const creator = creatorMap.get(component)

    if (!creator) {
      console.error(`[Seele.ComponentManager] create component failed, component ${component} not found`)

      return {}
    }

    return creator(props)
  }
}

export function ComponentRegistry(idGen) {
  idGen = (idGen && isFunction(idGen)) ? idGen : IDGenerator()
  const idMap = new Map() // id -> name
  const nameMap = new Map() // name -> id
  const creatorMap = new Map() // id -> creator
  const metaMap = new Map() // id -> meta

  return {
    add(name, creator, meta) {
      const component = nameMap.get(name)

      if (component != null) {
        return component
      }

      const id = idGen.gen()

      nameMap.set(name, id)
      idMap.set(id, name)
      creatorMap.set(id, creator)
      metaMap.set(id, meta)

      return id
    },
    get(id) {
      return creatorMap.get(id)
    },
    getName(id) {
      return idMap.get(id)
    },
    getMeta(id) {
      return metaMap.get(id)
    },
    setID(value) {
      idGen.set(value)
    },
    getID() {
      return idGen.get()
    },
    dehydrate() {
      const names = []
      const components = []

      nameMap.forEach((id, name) => {
        names.push(name)
        components.push(id)
      })

      return {
        names,
        components,
      }
    },
  }
}
