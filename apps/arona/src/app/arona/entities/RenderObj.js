import { defineEntity } from 'seele'
import Renderer from '@arona/components/Renderer'

export default defineEntity(entity => {
  entity
    .addComponent(Renderer)
})
