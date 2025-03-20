import { defineComponent } from 'seele'

export const CreatedTime = defineComponent((props = {}) => ({
  time: props.time ?? Date.now(),
}), 'CreatedTime')
