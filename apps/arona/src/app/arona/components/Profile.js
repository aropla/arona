import { defineComponent } from 'seele'

export const Profile = defineComponent((props = {}) => ({
  name: props.name ?? '',
  desc: props.desc ?? '',
}), 'Profile')
