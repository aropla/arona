import { defineComponent } from 'seele'

function Noop() {
  return
}

// TOOD
export default defineComponent(value => ({
  render: value ?? Noop,
}), 'renderer', {
  // TODO: skipSerialize is a temporary solution to avoid serialization of the component
  skipSerialize: true,
})
