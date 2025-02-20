import { defineComponent } from 'seele'

export default defineComponent(props => ({
  x: props.x ?? 0,
  y: props.y ?? 0,
  z: props.z ?? 0,
}), 'vec3')
