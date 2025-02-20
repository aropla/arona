import { defineEntity } from 'seele'
import Profile from '@arona/components/Profile'
import Physical from '@arona/components/Physical'
import Vec3 from '@arona/components/Vec3'
import Position from '@arona/components/Position'

export default defineEntity(entity => {
  entity
    .addComponent(Profile, {
      name: 'Camera~',
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
