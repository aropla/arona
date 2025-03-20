import { defineEntity } from 'seele'
import { MiracleNodeRef, OwnerRef, MemoID, Profile, Noa, CreatedTime, Status } from '@arona/components'

export const MEMO_STATUS = {
  PENDING: 1,
  DOING: 2,
  DONE: 4,
  PENDING: 8,
}

export const Memo = defineEntity(entity => {
  entity
    .name('Memo')
    .addComponent(MemoID)
    .addComponent(OwnerRef)
    .addComponent(MiracleNodeRef) /* #debug */
    .addComponent(Profile, {
      name: '来自未来的记忆',
      desc: '[memo]',
    })
    .addComponent(CreatedTime)
    .addComponent(Noa)
    .addComponent(Status, {
      status: MEMO_STATUS.PENDING,
    })
})
