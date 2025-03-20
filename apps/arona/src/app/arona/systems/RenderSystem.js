import { defineSystem } from 'seele'
import { Renderer } from '@arona/components'

export const RenderSystem = defineSystem(seele => {
  const query = seele.query(q => q.every(Renderer))

  return {
    onRender(interp) {
      if (window.freeze) {
        return
      }

      query.traverse(entity => {
        const renderer = entity[Renderer]

        if (typeof renderer.render === 'function') {
          renderer.render(entity, interp)
        }
      })
    },
  }
})
