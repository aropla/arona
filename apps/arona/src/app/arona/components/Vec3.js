import { defineComponent } from 'seele'

export const Vec3 = defineComponent((props = {}) => ({
  x: props.x ?? 0,
  y: props.y ?? 0,
  z: props.z ?? 0,
}), 'Vec3')
