import { Mask } from './utils'
import { Bus } from './fairy'

export function QueryManager(bus) {
  const queries = []
  const queryMap = new Map()

  return {
    get(queryBuilder) {
      return queryMap.get(queryBuilder)
    },
    addQuery(queryBuilder) {
      let query = queryMap.get(queryBuilder)

      if (query) {
        return query
      }

      query = Query(queryBuilder, bus)

      queries.push(query)
      queryMap.set(queryBuilder, query)

      bus.emit('query:created', { query })

      return query
    },
    tryAddArchetype(archetype) {
      for (let i = 0; i < queries.length; i++) {
        const query = queries[i]

        query.tryAddArchetype(archetype)
      }
    },
    traverse(cb) {
      for (let i = 0; i < queries.length; i++) {
        cb(queries[i])
      }
    },
  }
}

export function Query(queryBuilder, bus) {
  const archetypes = []
  const matcher = queryBuilder.build()
  const options = queryBuilder.options
  const queryBus = Bus()

  return {
    archetypes,
    size() {
      let size = 0

      for (let i = 0; i < archetypes.length; i++) {
        size += archetypes[i].size()
      }

      return size
    },
    tryAddArchetype(archetype) {
      if (!matcher(archetype.mask, archetype)) {
        return false
      }

      archetypes.push(archetype)

      return true
    },
    removeArchetype(archetype) {
      const index = archetypes.indexOf(archetype)

      if (index === -1) {
        return false
      }

      archetypes.splice(index, 1)

      return true
    },
    hasArchetype,
    traverse,
    find,
    /**
     * 只有 options.single = true 时才有意义
     */
    get() {
      const len = archetypes.length
      for (let i = len - 1; i >= 0; i--) {
        const archetype = archetypes[i]
        const size = archetype.size()
        const entities = archetype.entities

        for (let j = size - 1; j >= 0; j--) {
          return entities[j]
        }
      }
    },
    map(cb) {
      const result = []

      traverse(entity => {
        result.push(cb(entity))
      })

      return result
    },
    array,
    clear() {
      archetypes.length = 0
    },

    /**
     * support name:
     *  size:changed
     * @param {*} name
     * @param {*} fn
     * @returns
     */
    on(name, fn) {
      if (name === 'size:changed') {
        function entityUpdated({ archetype }) {
          if (hasArchetype(archetype)) {
            queryBus.emit('size:changed')
          }
        }

        function componentUpdated({ archetype, newArchetype }) {
          if (hasArchetype(archetype) && !hasArchetype(newArchetype)) {
            queryBus.emit('size:changed')
          }
        }

        bus.on('entity:created', entityUpdated)
        bus.on('entity:removed', entityUpdated)
        bus.on('component:added', componentUpdated)
        bus.on('component:removed', componentUpdated)

        bus.once('[clear]size:changed', () => {
          bus.off('entity:created', entityUpdated)
          bus.off('entity:removed', entityUpdated)
          bus.off('component:added', componentUpdated)
          bus.off('component:removed', componentUpdated)
        })
      }

      queryBus.on(name, fn)
    },
    off(name, fn) {
      if (name === 'size:changed') {
        bus.emit('[clear]size:changed')
      }

      queryBus.off(name, fn)
    },
    emit(name, ...options) {
      queryBus.emit(name, ...options)
    },
  }

  function array() {
    const result = []

    traverse(entity => {
      result.push(entity)
    })

    return result
  }

  function traverse(cb) {
    const len = archetypes.length
    for (let i = len - 1; i >= 0; i--) {
      const archetype = archetypes[i]
      const size = archetype.size()
      const entities = archetype.entities

      for (let j = size - 1; j >= 0; j--) {
        cb(entities[j], archetype)
      }
    }
  }

  function find(cb) {
    const len = archetypes.length
    for (let i = len - 1; i >= 0; i--) {
      const archetype = archetypes[i]
      const size = archetype.size()
      const entities = archetype.entities

      for (let j = size - 1; j >= 0; j--) {
        if (cb(entities[j], archetype)) {
          return entities[j]
        }
      }
    }
  }

  function hasArchetype(archetype) {
    return archetypes.indexOf(archetype) !== -1
  }
}

export function QueryBuilder() {
  let matchers = []
  const options = {
    single: false,
  }

  return {
    options,
    matchers,
    or(cb) {
      const [first = alwaysTrue, ...rest] = matchers

      matchers = [
        OrMatcher(
          AndMatcher(first, rest),
          cb(QueryBuilder()).matchers,
        )
      ]

      return this
    },
    every(components, ...rest) {
      if (!Array.isArray(components)) {
        components = [components, ...rest]
      }

      if (components.length == 0) {
        return this
      }

      const mask = Mask(components)
      matchers.push(other => other.contains(mask))

      return this
    },
    entity(archetype) {
      matchers.push(other => other.contains(archetype.mask))

      return this
    },
    some(components, ...rest) {
      if (!Array.isArray(components)) {
        components = [components, ...rest]
      }

      if (components.length === 0) {
        return this
      }

      const mask = Mask(components)
      matchers.push(other => other.intersects(mask))

      return this
    },
    not(components, ...rest) {
      if (!Array.isArray(components)) {
        components = [components, ...rest]
      }

      if (components.length === 0) {
        return this
      }

      const mask = Mask(components)
      matchers.push(other => !other.intersects(mask))

      return this
    },

    none(components, ...rest) {
      if (!Array.isArray(components)) {
        components = [components, ...rest]
      }

      if (components.length === 0) {
        return this
      }

      const mask = Mask(components)
      matchers.push(other => !other.contains(mask))

      return this
    },
    all() {
      matchers.push(alwaysTrue)

      return this
    },
    empty() {
      matchers.push(alwaysFalse)

      return this
    },
    custom(matcher) {
      matchers.push(matcher)

      return this
    },
    build() {
      const [first = alwaysTrue, ...rest] = matchers

      return AndMatcher(first, rest)
    },

    single() {
      options.single = true

      return this
    }
  }
}

/**
 * A && B
 */
function AndMatcher(matcher, matchers) {
  return (mask, archetype) => matcher(mask, archetype) && matchers.every(matcher => matcher(mask, archetype))
}

/**
 * A || B
 */
function OrMatcher(matcher, matchers) {
  return (mask, archetype) => matcher(mask, archetype) || matchers.some(matcher => matcher(mask, archetype))
}

function alwaysTrue() {
  return true
}

function alwaysFalse() {
  return false
}
