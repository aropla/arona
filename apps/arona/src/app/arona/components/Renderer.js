import { defineComponent } from 'seele'

function Noop() {
  return
}

// TOOD
export const Renderer = defineComponent(value => ({
  render: value ?? Noop,
}), 'Renderer', {
  // TODO: skipSerialize is a temporary solution to avoid serialization of the component
  skipSerialize: true,
})
