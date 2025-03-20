import { defineEntity } from 'seele'
import { MiracleID, MiracleRef, Profile, Position, Noa, Selfie, CreatedTime, OwnerRef } from '@arona/components'

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
    .addComponent(CreatedTime)
    .addComponent(OwnerRef)
    .addComponent(Position)
    .addComponent(Noa)
})
