import { defineEntity } from 'seele'
import { TravelerID, Profile, Selfie, CreatedTime } from '@arona/components'

export const Traveler = defineEntity(entity => {
  entity
    .name('Traveler')
    .addComponent(TravelerID, '1')
    .addComponent(Selfie)
    .addComponent(Profile, {
      name: '旅行者',
      desc: '私と一緒に、海に帰ろう',
    })
    .addComponent(CreatedTime)
})
