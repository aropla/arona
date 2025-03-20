import { Seele } from 'seele'
import {
  MiracleRef,
  MiracleNodeRef,
  TravelerRef,
  MemoRef,
  OwnerRef,
  MiracleID,
  MiracleNodeID,
  TravelerID,
  MemoID,
  Mine,
  Profile,
  Temp,
  Velocity,
  Position,
  Physical,
  Renderer,
  Noa,
  CreatedTime,
  Selfie,
  Status,
  Toki,
  Timer,
} from '@arona/components'

import {
  Miracle,
  MiracleNode,
  Camera,
  RenderObj,
  Traveler,
  Memo,
} from '@arona/entities'

import {
  TravelersQuery,
  MiraclesQuery,
  MiracleNodesQuery,
  MemosQuery,
  MeQuery,
} from '@arona/queries'

import {
  RenderSystem,
  MoveSystem,
  TokiSystem,
} from '@arona/systems'

import * as mocks from '@mocks'

import SeeleReact, { useSeeleQuery } from '@app/seele-react'
import SeeleLocalStore from '@app/seele-local-store'

function Arona() {
  const seele = Seele()

  seele.vollerei()
    .registerComponent(MiracleID)
    .registerComponent(MiracleNodeID)
    .registerComponent(TravelerID)
    .registerComponent(MemoID)
    .registerComponent(MiracleRef)
    .registerComponent(MiracleNodeRef)
    .registerComponent(TravelerRef)
    .registerComponent(MemoRef)
    .registerComponent(OwnerRef)
    .registerComponent(Mine)
    .registerComponent(Profile)
    .registerComponent(Temp)
    .registerComponent(Position)
    .registerComponent(Velocity)
    .registerComponent(Physical)
    .registerComponent(Renderer)
    .registerComponent(Noa)
    .registerComponent(CreatedTime)
    .registerComponent(Selfie)
    .registerComponent(Status)
    .registerComponent(Toki)
    .registerComponent(Timer)

    .registerEntity(Miracle)
    .registerEntity(MiracleNode)
    .registerEntity(Traveler)
    .registerEntity(Camera)
    .registerEntity(RenderObj)
    .registerEntity(Memo)

    .registerSystem(MoveSystem)
    .registerSystem(TokiSystem)

    .registerPlugin(SeeleReact)
    .registerPlugin(SeeleLocalStore)

    .registerSystem(RenderSystem)

  console.log('dehydrate', seele.dehydrate())

  /* Deserialize */
  const dehydration = JSON.parse(localStorage.getItem('arona'))

  /* Mocks */
  if (!dehydration) {
    mocks.miracles.forEach(miracle => {
      const entity = seele.createEntity(Miracle, miracle)

      // entity[MiracleID] = miracle[MiracleID]
      // entity[MiracleRef] = miracle[MiracleRef]
      // entity[Profile] = miracle[Profile]
    })

    mocks.miracleNodes.forEach(miracleNode => {
      const entity = seele.createEntity(MiracleNode, miracleNode)

      // entity[MiracleNodeID] = miracleNode[MiracleNodeID]
      // entity[MiracleNodeRef] = miracleNode[MiracleNodeRef]
      // entity[MiracleRef] = miracleNode[MiracleRef]
      // entity[Profile] = miracleNode[Profile]
      // entity[Position] = miracleNode[Position]
    })

    console.log(mocks.travelers)
    mocks.travelers.forEach(traveler => {
      const entity = seele.createEntity(Traveler, traveler)

      seele.addComponent(entity, Mine)

      console.log('[Traveler]', entity)
    })
  }

  console.log('old', JSON.parse(JSON.stringify(dehydration)))

  console.group('upgrade')
  console.log(seele.hydrate(dehydration))
  console.groupEnd('upgrade')

  const hydration = seele.dehydrate()
  console.log('cur', hydration)
  seele.loop.setSimulationTimestep(1000 / 60 / 2)
  seele.start()

  const travelersQuery = seele.query(TravelersQuery)
  const miraclesQuery = seele.query(MiraclesQuery)
  const miracleNodesQuery = seele.query(MiracleNodesQuery)
  const memosQuery = seele.query(MemosQuery)
  const meQuery = seele.query(MeQuery)

  return {
    ...seele,
    traveler: {
      get(travelerID) {
        return travelersQuery.find(entity => entity[TravelerID] === travelerID)
      }
    },
    miracle: {
      get(miracleID) {
        return miraclesQuery.find(entity => entity[MiracleID] === miracleID)
      },
    },
    miracleNode: {
      get(miracleNodeID) {
        return miracleNodesQuery.find(entity => entity[MiracleNodeID] === miracleNodeID)
      }
    },
    memo: {
      get(memoID) {
        return memosQuery.find(entity => entity[MemoID] === memoID)
      }
    },
    me() {
      return meQuery.find(() => true)
    },
  }
}

export const arona = Arona()

export function useMe() {
  const [_, meQuery] = useSeeleQuery(MeQuery)

  return meQuery.get()
}


/* #debug */
window.arona = arona





























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
//   seele.createEntity(Cat, null, 2)
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
