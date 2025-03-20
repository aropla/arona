import { defineEntity } from 'seele'
import { MiracleNodeID, Profile, CreatedTime, Noa, OwnerRef, Position, MiracleNodeRef, MiracleRef } from '@arona/components'

export const MiracleNode = defineEntity(entity => {
  entity
    .name('MiracleNode')
    .addComponent(MiracleNodeID)
    .addComponent(MiracleRef)
    .addComponent(MiracleNodeRef)
    .addComponent(Profile, {
      name: '-',
      desc: '',
    })
    .addComponent(CreatedTime)
    .addComponent(Noa)
    .addComponent(OwnerRef)
    .addComponent(Position)
})
