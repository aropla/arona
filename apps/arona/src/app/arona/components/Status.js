import { defineComponent } from 'seele'

export const Status = defineComponent((props = {}) => ({
  status: props.status ?? 0,
}), 'Status')
