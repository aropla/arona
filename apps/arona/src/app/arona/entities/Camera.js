import { defineEntity } from 'seele'
import { Profile, Physical, Vec3, Position } from '@arona/components'

export const Camera = defineEntity(entity => {
  entity
    .name('Camera')
    .addComponent(Profile, {
      name: 'Camera',
    })
    .addComponent(Physical, {
      friction: 0.86,
    })
    .addComponent(Vec3, {
      x: 0,
      y: 0,
      z: 1,
    })
    .addComponent(Position)
})
