import { defineComponent } from 'seele'

export const Physical = defineComponent((props = {}) => ({
  friction: props.friction ?? 1,
}), 'Physical')
