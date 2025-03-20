import { defineSystem } from 'seele'
import { Toki } from '@arona/components'

export const TokiSystem = defineSystem(seele => {
  const tokiQuery = seele.query(q => q.every(Toki))

  return {
    onUpdate(delta) {

    },
  }
})
