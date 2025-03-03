import { defineComponent } from 'seele'

export const Selfie = defineComponent((props = {}) => ({
  url: props.url ?? '',
}), 'Selfie')
