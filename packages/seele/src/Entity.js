import { BitSet, isFunction, isNotNullObject } from './utils'

export function EntityManager(componentManager, bus) {
  const archetypeMap = new Map()
  const nameToArchetypeMap = new Map()
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

    if (isValidArchetypeName(archetype.name)) {
      nameToArchetypeMap.set(archetype.name, archetype)
    }

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
    getByName(name) {
      if (isValidArchetypeName(name)) {
        return nameToArchetypeMap.get(name)
      }

      return
    },
    /**
     * 1. Get Archetype
     * 2. Create Entity
     */
    createEntity(archetypeBuilder, entity, count = 1) {
      const archetype = register(archetypeBuilder)

      if (isNotNullObject(entity)) {
        entity = defaultOnCreateProps(entity)
      }

      if (count === 1) {
        return archetype.create(entity)
      }

      const entities = []

      for (let i = 0; i < count; i++) {
        entities.push(archetype.create(entity))
      }

      return entities
    },
    pureCreateEntity(archetypeBuilder, entity, count = 1) {
      const archetype = register(archetypeBuilder)

      if (isNotNullObject(entity)) {
        entity = defaultOnCreateProps(entity)
      }

      if (count === 1) {
        return archetype.pureCreate(entity)
      }

      const entities = []

      for (let i = 0; i < count; i++) {
        entities.push(archetype.pureCreate(entity))
      }

      return entities
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
    hydrate(dehydration, patcher) {
      const components = dehydration.components
      const name = dehydration.name
      const entities = dehydration.entities

      let archetype = name === '' ? null : nameToArchetypeMap.get(name)

      if (!archetype) {
        const archetypeBuilder = ArchetypeBuilder()

        for (let i = 0; i < components.length; i++) {
          const oldComponent = components[i]
          const component = patcher.getNew(oldComponent) ?? oldComponent

          archetypeBuilder.addComponent(component)
        }

        archetype = register(archetypeBuilder)
      }

      archetype.hydrate(entities, patcher)
    },
    dehydrate() {
      const result = []

      archetypes.forEach(archetype => {
        if (archetype.size() === 0) {
          return
        }

        result.push(archetype.dehydrate())
      })

      return result
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

    const creator = onCreateProps => {
      const instance = Object.create(null)

      for (let i = 0; i < components.length; i++) {
        const component = components[i]
        const props = isFunction(onCreateProps) ? onCreateProps(propsMap[component], component) : propsMap[component]

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

  const components = archetypeBuilder.values()
  const name = archetypeBuilder.getName()

  return {
    name,
    entities,
    get mask() {
      return archetypeBuilder.mask
    },
    create,
    pureCreate(onCreateProps) {
      return creator(onCreateProps)
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
    hydrate(dehydration, patcher) {
      for (let i = 0; i < dehydration.length; i++) {
        const oldEntity = dehydration[i]

        create((props, component) => {
          const oldComponent = patcher.getOld(component) ?? component
          const newProps = oldEntity[oldComponent]

          if (isNotNullObject(props) && isNotNullObject(newProps)) {
            return { ...props, ...newProps }
          }

          return newProps
        })
      }
    },
    dehydrate() {
      return {
        components,
        name,
        entities,
      }
    },
  }

  function create(onCreateProps) {
    const entity = creator(onCreateProps)

    bus.emit('entity:created', { archetype: self, entity })

    return add(entity)
  }

  function hasComponent(component) {
    return archetypeBuilder.hasComponent(component)
  }

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
  const options = {
    name: ''
  }
  let mask = BitSet(8)
  let propsMap = Object.create(null)

  return {
    getName() {
      return options.name
    },
    name(value) {
      if (!isValidArchetypeName(value)) {
        console.error(`[Seele.ArchetypeBuilder] Archetype name ${value} is not valid`)

        return this
      }

      options.name = value

      return this
    },
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
    values() {
      return mask.values()
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

function isValidArchetypeName(value) {
  return typeof value === 'string' && value !== ''
}

function defaultOnCreateProps(entity) {
  return (props, component) => {
    const newProps = entity[component]

    if (typeof props === 'object' && typeof newProps === 'object') {
      return { ...props, ...newProps }
    }

    return newProps ?? props
  }
}
