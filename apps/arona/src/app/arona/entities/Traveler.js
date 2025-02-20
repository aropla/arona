import { defineEntity } from 'seele'
import ID from '@arona/components/ID'
import Profile from '@arona/components/Profile'

export default defineEntity(entity => {
  entity
    .addComponent(ID, '1')
    .addComponent(Profile, {
      name: 'Hotaru',
      desc: 'P.A.I.M.O.N',
    })
})
