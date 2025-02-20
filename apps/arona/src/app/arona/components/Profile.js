import { defineComponent } from 'seele'

export default defineComponent(props => ({
  name: props.name ?? '',
  desc: props.desc ?? '',
}), 'profile')
