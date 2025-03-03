import { defineComponent } from 'seele'

export const Position = defineComponent((props = {}) => ({
  x: props.x ?? 0,
  y: props.y ?? 0,
}), 'Position')
