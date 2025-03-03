import { defineComponent } from 'seele'

export const CreatedAt = defineComponent((props = {}) => ({
  createdAt: props.createdAt ?? Date.now(),
}), 'CreatedAt')
