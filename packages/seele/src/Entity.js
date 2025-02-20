import { BitSet } from "./utils"

export function EntityManager(componentManager, bus) {
  const archetypeMap = new Map()
  const archetypes = []

  const register = archetypeBuilder => {
    const archetypeKey = archetypeBuilder.key()
    let archetype = archetypeMap.get(archetypeKey)

    if (archetype) {
      return archetype
    }

    archetype = createArchetype(archetypeBuilder, componentManager, bus)
    archetypeMap.set(archetypeKey, archetype)
    archetypes.push(archetype)

    bus.emit('archetype:created', { archetype })

    return archetype
  }

  return {
    archetypes,
    register,
    find,
    has(archetypeBuilder) {
      return archetypeMap.has(archetypeBuilder.key())
    },
    /**
     * 1. Get Archetype
     * 2. Create Entity
     */
    createEntity(archetypeBuilder, count = 1) {
      const archetype = register(archetypeBuilder)

      if (count === 1) {
        return archetype.create()
      }

      for (let i = 0; i < count; i++) {
        archetype.create()
      }
    },
    removeEntity(entity) {
      const archetype = find(entity)

      if (archetype) {
        archetype.remove(entity)
      }
    },
    instantiate(archetypeBuilder) {
      const creator = creatorMap.get(archetypeBuilder)

      return creator()
    },
    traverse(cb) {
      for (let i = 0; i < archetypes.length; i++) {
        cb(archetypes[i])
      }
    },
  }

  function find(entity) {
    for (let i = 0; i < archetypes.length; i++) {
      if (archetypes[i].has(entity)) {
        return archetypes[i]
      }
    }
  }

  function createArchetype(archetypeBuilder, componentManager, bus) {
    const creator = buildEntityCreator(archetypeBuilder.mask, archetypeBuilder.propsMap)
    const archetype = Archetype(archetypeBuilder, creator, register, componentManager, bus)

    archetype.setThis(archetype)

    return archetype
  }

  function buildEntityCreator(mask, propsMap) {
    const components = mask.values()
    const creators = components.map(componentManager.get)

    const creator = () => {
      const instance = Object.create(null)

      for (let i = 0; i < components.length; i++) {
        const component = components[i]
        const props = propsMap[component] ?? {}

        instance[component] = creators[i](props)
      }

      return instance
    }

    return creator
  }
}

export function Archetype(archetypeBuilder, creator, register, componentManager, bus) {
  const entities = []
  const entityPositionMap = new Map()
  const adjacent = new Map()

  let self = null

  return {
    entities,
    get mask() {
      return archetypeBuilder.mask
    },
    create() {
      const entity = creator()

      bus.emit('entity:created', { archetype: self, entity })

      return add(entity)
    },
    add,
    remove,
    has(entity) {
      return entityPositionMap.has(entity)
    },
    clear() {
      entities.length = 0
    },
    size() {
      return entities.length
    },
    hasComponent,
    addComponent(entity, component, props) {
      if (hasComponent(component)) {
        archetypeBuilder.addComponent(component, props)

        return
      }

      let newArchetype = adjacent.get(component)

      if (!newArchetype) {
        const newArchetypeBuilder = archetypeBuilder.clone()
        newArchetypeBuilder.addComponent(component, props)

        newArchetype = register(newArchetypeBuilder)

        addAdjacent(component, newArchetype)
        newArchetype.addAdjacent(component, self)
      }

      componentManager.addComponent(entity, component, props, self, newArchetype)

      remove(entity, newArchetype, false)
      newArchetype.add(entity)
    },
    removeComponent(entity, component) {
      if (!hasComponent(component)) {
        return
      }

      let newArchetype = adjacent.get(component)

      if (!newArchetype) {
        const newArchetypeBuilder = archetypeBuilder.clone()
        newArchetypeBuilder.removeComponent(component)

        newArchetype = register(newArchetypeBuilder)

        addAdjacent(component, newArchetype)
        newArchetype.addAdjacent(component, self)
      }

      componentManager.removeComponent(entity, component, self, newArchetype)

      remove(entity, newArchetype, false)
      newArchetype.add(entity)
    },
    addAdjacent,
    setThis(instance) {
      self = instance
    },
  }

  function hasComponent(component) {
    return archetypeBuilder.hasComponent(component)
  }

  /**
   *
   * @param {*} entity
   * @param {*} newArchetype
   * @returns
   */
  function add(entity) {
    entities.push(entity)
    entityPositionMap.set(entity, entities.length - 1)

    return entity
  }

  function remove(entity, newArchetype, isEmit = true) {
    const tailEntity = entities[entities.length - 1]

    if (tailEntity !== entity) {
      const index = entityPositionMap.get(entity)

      entities[index] = tailEntity
      entityPositionMap.set(tailEntity, index)
    }

    entities.pop()
    entityPositionMap.delete(entity)

    if (isEmit) {
      bus.emit('entity:removed', { archetype: self, entity, newArchetype })
    }
  }

  function addAdjacent(component, anotherArchetype) {
    adjacent.set(component, anotherArchetype)
  }
}

export function ArchetypeBuilder() {
  let mask = BitSet(8)
  let propsMap = Object.create(null)

  return {
    addComponent(component, props) {
      mask.or(component)
      propsMap[component] = props

      return this
    },
    removeComponent(component) {
      if (mask.has(component)) {
        mask.xor(component)
      }

      propsMap[component] = undefined

      return this
    },
    hasComponent(component) {
      return mask.has(component)
    },
    clone() {
      const builder = ArchetypeBuilder()

      builder.setMask(mask.clone())
      builder.setPropsMap({ ...propsMap })

      return builder
    },
    key() {
      return mask.toString()
    },
    setMask(value) {
      mask = value
    },
    get mask() {
      return mask
    },
    setPropsMap(value) {
      propsMap = value
    },
    get propsMap() {
      return propsMap
    },
  }
}
