import { defineSystem } from 'seele'
import Renderer from '@arona/components/Renderer'

export default defineSystem(seele => {
  const query = seele.query(q => q.every(Renderer))

  return {
    onRender(interp) {
      if (window.freeze) {
        return
      }

      query.traverse(entity => {
        const renderer = entity[Renderer]
        renderer.render(entity, interp)
      })
    },
  }
})
