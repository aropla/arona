import { defineEntity } from 'seele'
import ID from '@arona/components/ID'
import Profile from '@arona/components/Profile'
import MiracleRef from '@arona/components/MiracleRef'
import Ref from '@arona/components/Ref'

export default defineEntity(entity => {
  entity
    .addComponent(ID, '1')
    .addComponent(Ref, '')
    .addComponent(MiracleRef, '')
    .addComponent(Profile, {
      name: 'HotaruA',
      desc: 'P.A.I.M.O.N',
    })
})
