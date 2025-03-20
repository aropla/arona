import { defineComponent } from 'seele'

export const Timer = defineComponent((props = {}) => ({
  startTime: props.startTime ?? undefined,
  expireTime: props.expireTime ?? undefined,
}), 'Timer')
