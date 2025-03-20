import { defineSystem } from 'seele'
import { Position, Physical, Velocity } from '@arona/components'

export const MoveSystem = defineSystem(seele => {
  const env = {
    friction: 0.8,
    threshold: 0.02,
  }

  const query = seele.query(q => q.every(Position).some(Velocity))

  return {
    onUpdate(delta) {
      query.traverse(entity => {
        const velocity = entity[Velocity]

        if (velocity.x === 0 && velocity.y === 0) {
          return
        }

        const position = entity[Position]
        const physical = entity[Physical] ?? {}

        position.x += velocity.x * delta
        position.y += velocity.y * delta

        const friction = physical.friction ?? env.friction

        const v = friction * delta * 0.01
        velocity.x -= velocity.x * v
        velocity.y -= velocity.y * v

        const threshold = physical.threshold ?? env.threshold

        if (Math.abs(velocity.x) < threshold) {
          velocity.x = 0
        }

        if (Math.abs(velocity.y) < threshold) {
          velocity.y = 0
        }
      })
    },
  }
})
