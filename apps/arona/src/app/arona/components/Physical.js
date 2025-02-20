import { defineComponent } from 'seele'

export default defineComponent(props => ({
  friction: props.friction ?? 1,
}), 'physical')
