import { defineComponent } from 'seele'

function TokiRule(props) {
  return {
    active: props.active ?? true,
    slices: props.slices ?? [],
    count: props.count ?? 1,
    curCount: props.curCount ?? 0,
    interval: props.interval ?? -1,
    time: props.time ?? -1,

    enabled() {
      this.active = true
    },
    disabled() {
      this.active = false
    },
    between({ start, end }) {
      this.slices.push({ start, end })
    },
    after(time) {
      this.slices.push({ start: time })
    },
    before(time) {
      this.slices.push({ end: time })
    },
    setCount(count) {
      this.count = count
    },
    setTime(time) {
      this.time = time
    },
    setInterval(interval) {
      this.interval = interval
    },
  }
}

export const Toki = defineComponent((props = {}) => {
  return {
    active: props.active ?? true,
    rules: props.rules ?? [],
    matcher: props.matcher ?? null,

    addRule(cb) {
      const rule = TokiRule()
      cb(rule)

      this.rules.push(rule)

      return rule
    },
  }
}, 'Toki')
