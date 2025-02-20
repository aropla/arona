import { defineComponent, defineQuery, defineSystem } from 'seele'

export const LocalStore = defineComponent('local-store')
export const LocalStoreQuery = defineQuery(q => q.every(LocalStore))

const LocalStoreSystem = defineSystem(seele => {
  const localStoreEntities = seele.query(LocalStoreQuery)

  seele.on('component:added', ({ entity, component, archetype }) => {
    if (component === LocalStore) {
      console.log('component:added', entity, component, archetype, LocalStore)
    }
  })
})

export default function SeeleLocalStore(seele) {
  seele
    .registerComponent(LocalStore)
    .registerSystem(LocalStoreSystem)
}
