import { defineEntity } from 'seele'
import { Profile, Physical, Velocity, Position } from '@arona/components'

export const Camera = defineEntity(entity => {
  entity
    .name('Camera')
    .addComponent(Profile, {
      name: 'Camera',
    })
    .addComponent(Physical, {
      friction: 0.6,
    })
    .addComponent(Velocity, {
      x: 0,
      y: 0,
      z: 1,
    })
    .addComponent(Position)
    .skipDehyadrate()
})
