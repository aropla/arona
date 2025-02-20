import { Seele } from 'seele'
import ID from '@arona/components/ID'
import Ref from '@arona/components/Ref'
import Timer from '@arona/components/Timer'
import Profile from '@arona/components/Profile'
import Temp from '@arona/components/Temp'
import Vec2 from '@arona/components/Vec2'
import Vec3 from '@arona/components/Vec3'
import MiracleRef from '@arona/components/MiracleRef'
import Position from '@arona/components/Position'
import Physical from '@arona/components/Physical'
import Renderer from '@arona/components/Renderer'

import Traveler from '@arona/entities/Traveler'
import Miracle from '@arona/entities/Miracle'
import Camera from '@arona/entities/Camera'
import RenderObj from '@arona/entities/RenderObj'

import MoveSystem from '@arona/systems/MoveSystem'
import RenderSystem from '@arona/systems/RenderSystem'

import SeeleReact from '@app/seele-react'
import SeeleLocalStore from '@app/seele-local-store'

import * as mocks from '@mocks'

function Arona() {
  const seele = Seele()

  seele.vollerei()
    .registerComponent(ID)
    .registerComponent(Ref)
    .registerComponent(MiracleRef)
    .registerComponent(Timer)
    .registerComponent(Profile)
    .registerComponent(Temp)
    .registerComponent(Position)
    .registerComponent(Vec2)
    .registerComponent(Vec3)
    .registerComponent(Physical)
    .registerComponent(Renderer)

    .registerEntity(Traveler)
    .registerEntity(Miracle)
    .registerEntity(Camera)
    .registerEntity(RenderObj)

    .registerSystem(MoveSystem)

    .registerPlugin(SeeleReact)
    .registerPlugin(SeeleLocalStore)

    .registerSystem(RenderSystem)

  const nodes = mocks.miracleNodes

  nodes.forEach(node => {
    const entity = seele.createEntity(Miracle)

    entity[ID] = node[ID]
    entity[Ref] = node[Ref]
    entity[MiracleRef] = node[MiracleRef]
    entity[Profile] = node[Profile]
    entity[Position] = node[Position]
  })

  // seele.loop.setSimulationTimestep(1000 / 60 / 2)
  seele.start()

  return {
    seele,
  }
}

const arona = Arona()

window.arona = arona.seele

export default arona.seele


































// function test() {
//   const seele = Seele()

//   const Name = defineComponent(name => name, 'name')
//   const Position = defineComponent(() => ({ x: 0, y: 0 }), 'position')
//   const WalkVector = defineComponent(() => ({ x: 10, y: 10 }), 'walkVector')
//   const SwimVector = defineComponent(() => ({ x: 5, y: 5 }), 'swimVector')
//   const Pet = defineComponent('pet')
//   console.log('Pet', Pet)

//   /* defineEntities */
//   const Cat = defineEntity(entity => {
//     entity
//       .addComponent(Name, 'cat')
//       .addComponent(Position)
//       .addComponent(WalkVector)
//       .addComponent(Pet)
//   })

//   const Fish = defineEntity(entity => {
//     entity
//       .addComponent(Name, 'fish')
//       .addComponent(Position)
//       .addComponent(SwimVector)
//       .addComponent(Pet)
//   })

//   /* defineQueries */
//   const petsQuery = defineQuery(q => q.every(Pet))
//   const walkPetsQuery = defineQuery(q => q.every(Position, WalkVector, Pet))
//   const swimPetsQuery = defineQuery(q => q.every(Position, SwimVector, Pet))

//   const WalkSystem = defineSystem(() => {
//     return {
//       onUpdate: () => {
//         walkPets.traverse(entity => {
//           entity[Position].x += entity[WalkVector].x
//           entity[Position].y += entity[WalkVector].y
//         })
//       },
//     }
//   })

//   const SwimSystem = defineSystem(() => {
//     return {
//       onUpdate: () => {
//         swimPets.traverse(entity => {
//           entity[Position].x += entity[SwimVector].x
//           entity[Position].y += entity[SwimVector].y
//         })
//       },
//     }
//   })

//   /* registerComponent */
//   seele
//     .registerComponent(Name)
//     .registerComponent(Position)
//     .registerComponent(WalkVector)
//     .registerComponent(SwimVector)
//     .registerComponent(Pet)
//     .registerEntity(Cat)
//     .registerEntity(Fish)
//     .registerSystem(WalkSystem)
//     .registerSystem(SwimSystem)

//   // seele.start()
//   seele.ready()

//   /* createEntity */
//   seele.createEntity(Cat, 2)
//   seele.createEntity(Fish)

//   /* query */
//   const pets = seele.query(petsQuery)
//   const walkPets = seele.query(walkPetsQuery)
//   const swimPets = seele.query(swimPetsQuery)

//   console.group('[query]')
//   console.log('pets', pets)
//   console.log('walkPets', walkPets)
//   console.log('swimPets', swimPets)
//   console.groupEnd('[query]')

//   const Animal = defineComponent(() => ({
//     isAnimal: 'animal'
//   }), 'animal')
//   console.log('Animal', Animal)
//   seele.registerComponent(Animal)
//   const animalQuery = defineQuery(q => q.every(Animal))
//   const animal = seele.query(animalQuery, true)

//   console.group('addComponent')
//   console.log('swimPets before', JSON.parse(JSON.stringify(swimPets.archetypes)))
//   swimPets.traverse((entity, archetype) => {
//     archetype.addComponent(entity, Animal)
//     archetype.removeComponent(entity, Position)
//   })
//   console.log('swimPets after', JSON.parse(JSON.stringify(swimPets.archetypes)))
//   console.groupEnd('addComponent')

//   const archetypes = seele.entityManager.archetypes
//   console.group('[archetypes]')
//   archetypes.forEach(archetype => {
//     console.log('archetype', archetype.mask.values(), archetype)
//   })
//   console.groupEnd('archetypes')
//   console.log('[animal]', animal.size())
// }
