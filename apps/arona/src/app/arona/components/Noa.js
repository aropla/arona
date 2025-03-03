import { defineComponent } from 'seele'

export const Noa = defineComponent((props = {}) => ({
  content: props.content ?? '',
}), 'Noa')
