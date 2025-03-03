import { defineEntity } from 'seele'
import { Renderer } from '@arona/components'

export const RenderObj = defineEntity(entity => {
  entity
    .name('RenderObj')
    .addComponent(Renderer)
})
