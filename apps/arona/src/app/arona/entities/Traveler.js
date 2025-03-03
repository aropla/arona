import { defineEntity } from 'seele'
import { TravelerID, Profile, Selfie } from '@arona/components'

export const Traveler = defineEntity(entity => {
  entity
    .name('Traveler')
    .addComponent(TravelerID, '1')
    .addComponent(Profile, {
      name: '旅行者',
      desc: '私と一緒に、海に帰ろう',
    })
    .addComponent(Selfie)
})
