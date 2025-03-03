import { defineEntity } from 'seele'
import { MemoID, Profile, Noa, CreatedAt, Status } from '@arona/components'

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
    .addComponent(Profile, {
      name: 'Memo',
      desc: '',
    })
    .addComponent(Noa)
    .addComponent(CreatedAt)
    .addComponent(Status, {
      status: MEMO_STATUS.PENDING,
    })
})
