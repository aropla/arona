import { defineEntity } from 'seele'
import { MiracleID, MiracleRef, Profile, Position, Noa, Selfie, CreatedAt } from '@arona/components'

export const Miracle = defineEntity(entity => {
  entity
    .name('Miracle')
    .addComponent(MiracleID)
    .addComponent(MiracleRef)
    .addComponent(Profile, {
      name: '[Miracle]',
      desc: '',
    })
    .addComponent(Selfie, {
      url: '/default-miracle.jpg',
    })
    .addComponent(Position)
    .addComponent(Noa)
    .addComponent(CreatedAt)
})
