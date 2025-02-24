export const DELETED_COMPONENT = -1
export const NEW_COMPONENT = -2

export function Upgrader(seele) {
  return {
    resolve(oldDehydration) {
      const patcher = Patcher()

      const curDehydration = seele.value.dehydrate({ archetype: false })
      const { components: curComponents, names: curNames } = curDehydration.component

      /* Debug */
      const added = []
      const removed = []
      const changed = []
      const visitedComponent = Object.create(null)

      for (let i = 0; i < curComponents.length; i++) {
        const component = curComponents[i]
        const name = curNames[i]

        const oldComponent = getOldComponentIDByName(name, oldDehydration)

        /* 检测到了新的 component, 不处理 */
        if (oldComponent < 0) {
          patcher.set(component, NEW_COMPONENT)

          added.push({
            component,
            name,
          })

          continue
        }

        visitedComponent[oldComponent] = 1

        /* 检测到了他们 id 和 name 相同, 不处理 */
        if (component === oldComponent) {
          continue
        }

        patcher.set(oldComponent, component)

        changed.push({
          oldComponent,
          component,
          name,
        })
      }

      const { components: oldComponents, names: oldNames } = oldDehydration.component

      /* get removed */
      for (let i = 0; i < oldComponents.length; i++) {
        const oldComponent = oldComponents[i]
        const name = oldNames[i]

        if (visitedComponent[oldComponent] === undefined) {
          patcher.set(oldComponent, DELETED_COMPONENT)

          removed.push({
            oldComponent,
            name,
          })
        }
      }

      return {
        patcher,
        added,
        removed,
        changed,
      }
    },
  }
}

function getOldComponentIDByName(name, dehydration) {
  const { components, names } = dehydration.component

  const index = names.indexOf(name)

  if (index < 0) {
    return -1
  }

  return components[index]
}

function Patcher() {
  const oldToNew = new Map()
  const newToOld = new Map()
  const changed = new Map()

  return {
    set(component, targetComponent) {
      if (targetComponent >= 0) {
        oldToNew.set(component, targetComponent)
        newToOld.set(targetComponent, component)
      } else if (targetComponent === NEW_COMPONENT) {
        changed.set(component, NEW_COMPONENT)
      } else if (targetComponent === DELETED_COMPONENT) {
        changed.set(component, DELETED_COMPONENT)
      }
    },
    getOld(component) {
      return newToOld.get(component)
    },
    getNew(oldComponent) {
      return oldToNew.get(oldComponent)
    },
    isDeleted(component) {
      return changed.get(component) === DELETED_COMPONENT
    },
    isAdded(component) {
      return changed.get(component) === NEW_COMPONENT
    },
  }
}
