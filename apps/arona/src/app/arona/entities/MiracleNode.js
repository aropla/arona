import { defineEntity } from 'seele'
import { MiracleNodeID, Profile, CreatedAt, Noa, AuthorRef, Position, MiracleNodeRef, MiracleRef } from '@arona/components'

export const MiracleNode = defineEntity(entity => {
  entity
    .name('MiracleNode')
    .addComponent(MiracleNodeID)
    .addComponent(MiracleRef)
    .addComponent(MiracleNodeRef)
    .addComponent(Profile)
    .addComponent(CreatedAt)
    .addComponent(Noa)
    .addComponent(AuthorRef)
    .addComponent(Position)
})
