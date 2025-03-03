import { defineComponent } from 'seele'

export const Vec2 = defineComponent((props = {}) => ({
  x: props.x ?? 0,
  y: props.y ?? 0,
}), 'Vec2')
