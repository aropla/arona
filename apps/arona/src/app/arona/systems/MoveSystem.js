import { defineSystem } from 'seele'
import { Position, Physical, Vec2, Vec3 } from '@arona/components'

export default defineSystem(seele => {
  const env = {
    friction: 0.8,
    threshold: 0.01,
  }

  const query = seele.query(q => q.every(Position).some(Vec2, Vec3))

  return {
    onUpdate(delta) {
      query.traverse(entity => {
        const velocity = entity[Vec2] ?? entity[Vec3]

        if (velocity.x === 0 && velocity.y === 0) {
          return
        }

        const position = entity[Position]
        const physical = entity[Physical] ?? {}

        position.x += velocity.x * delta
        position.y += velocity.y * delta

        const friction = physical.friction ?? env.friction

        velocity.x *= friction
        velocity.y *= friction

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
