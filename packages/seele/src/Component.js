import { IDGenerator } from "./utils"

export function ComponentManager(componentRecorder, bus) {
  const creatorMap = Object.create(null)

  return {
    register(component) {
      creatorMap[component] = componentRecorder.get(component)
    },
    has(component) {
      return creatorMap[component] !== undefined
    },
    get(component) {
      return creatorMap[component]
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
      return componentRecorder.getID()
    },
  }

  function create(component, props) {
    const creator = creatorMap[component]

    if (!creator) {
      console.error(`[Seele.ComponentManager] create component failed, component ${component} not found`)

      return {}
    }

    return creator(props)
  }
}

export function ComponentRecorder(idGen) {
  idGen = (idGen && typeof idGen.gen === 'function') ? idGen : IDGenerator()
  const idMap = Object.create(null) // id -> name
  const nameMap = Object.create(null) // name -> id
  const creatorMap = Object.create(null) // id -> creator
  const metaMap = Object.create(null) // id -> meta

  return {
    add(name, creator, meta) {
      if (nameMap[name] === undefined) {
        const id = idGen.gen()

        nameMap[name] = id
        idMap[id] = name
        creatorMap[id] = creator
        metaMap[id] = meta
      }

      return nameMap[name]
    },
    get(id) {
      return creatorMap[id]
    },
    getName(id) {
      return idMap[id]
    },
    getMeta(id) {
      return metaMap[id]
    },
    setID(value) {
      idGen.set(value)
    },
    getID() {
      return idGen.get()
    },
  }
}
