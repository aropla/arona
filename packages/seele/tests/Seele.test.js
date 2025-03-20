import { describe } from 'vitest'
import { Seele, defineQuery, defineComponent, defineEntity, defineSystem } from '@'
import { vi } from 'vitest'
import { expect } from 'vitest'

describe('Seele', () => {
  const seele = Seele()

  const testObj = {
    walkPets: {
      realityPositions: [],
      expectPositions: [],
    },
    swimPets: {
      realityPositions: [],
      expectPositions: [],
    },
    flyPets: {
      realityPositions: [],
      expectPositions: [],
    },
  }

  /* defineComponents */
  const Position = defineComponent(() => ({ x: 0, y: 0 }), 'position')
  const WalkVector = defineComponent(() => ({ x: 10, y: 10 }), 'walkVector')
  const SwimVector = defineComponent(() => ({ x: 5, y: 5 }), 'swimVector')
  const Pet = defineComponent('pet')
  const Creature = defineComponent('creature')

  const max = seele.component.getMaxID()
  describe('defineComponent', () => {
    it('return right component id', () => {
      expect([Position, WalkVector, SwimVector, Pet, Creature]).toEqual([max - 4, max - 3, max - 2, max - 1, max])
    })
  })

  /* defineEntities */
  const Cat = defineEntity(entity => {
    entity.addComponent(Position)
      .addComponent(WalkVector)
      .addComponent(Pet)
  })

  const Fish = defineEntity(entity => {
    entity.addComponent(Position)
      .addComponent(SwimVector)
      .addComponent(Pet)
  })

  const Rabbit = defineEntity(entity => {
    entity.addComponent(Pet)
  })

  describe('defineEntity', () => {
    it('cat has right components', () => {
      expect(Cat.hasComponent(Position)).toBeTruthy()
      expect(Cat.hasComponent(WalkVector)).toBeTruthy()
      expect(Cat.hasComponent(SwimVector)).toBeFalsy()
      expect(Cat.hasComponent(Pet)).toBeTruthy()
    })

    it('fish has right components', () => {
      expect(Fish.hasComponent(Position)).toBeTruthy()
      expect(Fish.hasComponent(WalkVector)).toBeFalsy()
      expect(Fish.hasComponent(SwimVector)).toBeTruthy()
      expect(Fish.hasComponent(Pet)).toBeTruthy()
    })
  })

  /* defineQueries */
  const petsQuery = defineQuery(q => q.every(Pet))
  const walkPetsQuery = defineQuery(q => q.every(Position, WalkVector, Pet))
  const swimPetsQuery = defineQuery(q => q.every(Position, SwimVector, Pet))

  /* defineSystems */
  const reality = {
    loopTimes: [],
    creatureCount: [],
    onStartWork: false,
    onUpdateWork: false,
    onStopWork: false,
  }

  let curTimeSlice = -1
  const TestSystem = defineSystem(() => {
    return {
      onStart() {
        reality.onStartWork = true
        reality.loopTimes.push(0)
        curTimeSlice += 1
      },
      onUpdate() {
        reality.onUpdateWork = true
        reality.loopTimes[curTimeSlice] += 1
      },
      onStop() {
        reality.onStopWork = true
      }
    }
  })

  const CreatureCountSystem = defineSystem(() => {
    return {
      onStart: () => {
        const count = pets.size()
        reality.creatureCount[curTimeSlice] = count
      },
    }
  })

  const WalkSystem = defineSystem(() => {
    return {
      onStart() {
        testObj.walkPets.realityPositions[curTimeSlice] = []
        testObj.walkPets.expectPositions[curTimeSlice] = []
      },
      onUpdate: () => {
        walkPets.traverse(entity => {
          entity[Position].x += entity[WalkVector].x
          entity[Position].y += entity[WalkVector].y
        })
      },
      onStop() {
        const realityPositions = testObj.walkPets.realityPositions[curTimeSlice]
        const expectPositions = testObj.walkPets.expectPositions[curTimeSlice]

        walkPets.traverse(entity => {
          realityPositions.push({
            x: entity[Position].x,
            y: entity[Position].y,
          })
          expectPositions.push({
            x: entity[WalkVector].x * reality.loopTimes[curTimeSlice],
            y: entity[WalkVector].y * reality.loopTimes[curTimeSlice],
          })
        })

        walkPets.traverse(entity => {
          entity[Position].x = 0
          entity[Position].y = 0
        })
      },
    }
  })

  const SwimSystem = defineSystem(() => {
    return {
      onStart() {
        testObj.swimPets.realityPositions[curTimeSlice] = []
        testObj.swimPets.expectPositions[curTimeSlice] = []
      },
      onUpdate: () => {
        swimPets.traverse(entity => {
          entity[Position].x += entity[SwimVector].x
          entity[Position].y += entity[SwimVector].y
        })
      },
      onStop() {
        const realityPositions = testObj.swimPets.realityPositions[curTimeSlice]
        const expectPositions = testObj.swimPets.expectPositions[curTimeSlice]

        swimPets.traverse(entity => {
          realityPositions.push({
            x: entity[Position].x,
            y: entity[Position].y,
          })
          expectPositions.push({
            x: entity[SwimVector].x * reality.loopTimes[curTimeSlice],
            y: entity[SwimVector].y * reality.loopTimes[curTimeSlice],
          })
        })

        swimPets.traverse(entity => {
          entity[Position].x = 0
          entity[Position].y = 0
        })
      },
    }
  })

  /* registerComponent */
  seele
    .vollerei()
    .registerComponent(Position)
    .registerComponent(WalkVector)
    .registerComponent(SwimVector)
    .registerComponent(Pet)

  describe('registerComponent', () => {
    it('register components success', () => {
      expect(seele.hasComponent(Position)).toBeTruthy()
      expect(seele.hasComponent(WalkVector)).toBeTruthy()
      expect(seele.hasComponent(SwimVector)).toBeTruthy()
      expect(seele.hasComponent(Pet)).toBeTruthy()
      expect(seele.hasComponent(Creature)).toBeFalsy()
    })
  })

  /* registerEntity */
  seele
    .registerEntity(Cat)
    .registerEntity(Fish)

  describe('registerEntity', () => {
    it('register entities success', () => {
      expect(seele.hasEntity(Cat)).toBeTruthy()
      expect(seele.hasEntity(Fish)).toBeTruthy()
      expect(seele.hasEntity(Rabbit)).toBeFalsy()
    })
  })

  seele.ready()

  /* createEntity */
  const neko = seele.createEntity(Cat)
  const sakana = seele.createEntity(Fish)

  describe('createEntity', () => {
    it('instantiates entities success', () => {
      expect(neko[WalkVector]).toEqual({ x: 10, y: 10 })
      expect(sakana[SwimVector]).toEqual({ x: 5, y: 5 })
    })
  })

  /* query */
  const pets = seele.query(petsQuery)
  const walkPets = seele.query(walkPetsQuery)
  const swimPets = seele.query(swimPetsQuery)

  describe('query', () => {
    const petsCount = pets.size()
    const walkPetsCount = walkPets.size()
    const swimPetsCount = swimPets.size()

    it('all query have right size', () => {
      expect(petsCount).toBe(2)
      expect(walkPetsCount).toBe(1)
      expect(swimPetsCount).toBe(1)
    })
  })

  seele
    .registerSystem(TestSystem)
    .registerSystem(CreatureCountSystem)
    .registerSystem(WalkSystem)
    .registerSystem(SwimSystem)

  vi.useFakeTimers()
  seele.start()
  vi.advanceTimersByTime(1000)
  seele.stop()

  describe('start', () => {
    const curTimeSlice = 0

    it('system works', () => {
      expect(reality.onStartWork).toBeTruthy()
      expect(reality.onUpdateWork).toBeTruthy()
      expect(reality.onStopWork).toBeTruthy()
    })

    it('query works, and 2 entities exist: neko and sakana', () => {
      expect(reality.creatureCount[curTimeSlice]).toBe(2)
    })

    it('cat move', () => {
      expect(testObj.walkPets.realityPositions[curTimeSlice]).toEqual(testObj.walkPets.expectPositions[curTimeSlice])
    })

    it('fish move', () => {
      expect(testObj.swimPets.realityPositions[curTimeSlice]).toEqual(testObj.swimPets.expectPositions[curTimeSlice])
    })
  })

  seele.start()
  vi.advanceTimersByTime(1000)
  seele.stop()

  describe('restart', () => {
    const curTimeSlice = 1

    describe('query', () => {
      const petsCount = pets.size()
      const walkPetsCount = walkPets.size()
      const swimPetsCount = swimPets.size()
      const flyPetsCount = flyPets.size()

      it('query works, and 3 entities exist: neko, sakana and 2 birds', () => {
        expect(petsCount).toBe(4)
        expect(walkPetsCount).toBe(1)
        expect(swimPetsCount).toBe(1)
        expect(flyPetsCount).toBe(2)
      })
    })

    it('cat move', () => {
      expect(testObj.walkPets.realityPositions[curTimeSlice]).toEqual(testObj.walkPets.expectPositions[curTimeSlice])
    })

    it('fish move', () => {
      expect(testObj.swimPets.realityPositions[curTimeSlice]).toEqual(testObj.swimPets.expectPositions[curTimeSlice])
    })

    const FlyVector = defineComponent(() => ({ x: 20, y: 20 }))
    const Bird = defineEntity(entity => {
      entity
        .addComponent(Position)
        .addComponent(FlyVector)
        .addComponent(Pet)
    })

    const FlySystem = defineSystem(() => {
      return {
        onStart() {
          testObj.flyPets.realityPositions[curTimeSlice] = []
          testObj.flyPets.expectPositions[curTimeSlice] = []
        },
        onUpdate: () => {
          flyPets.traverse(entity => {
            entity[Position].x += entity[FlyVector].x
            entity[Position].y += entity[FlyVector].y
          })
        },
        onStop() {
          const realityPositions = testObj.flyPets.realityPositions[curTimeSlice]
          const expectPositions = testObj.flyPets.expectPositions[curTimeSlice]

          flyPets.traverse(entity => {
            realityPositions.push({
              x: entity[Position].x,
              y: entity[Position].y,
            })
            expectPositions.push({
              x: entity[FlyVector].x * reality.loopTimes[curTimeSlice],
              y: entity[FlyVector].y * reality.loopTimes[curTimeSlice],
            })
          })

          flyPets.traverse(entity => {
            entity[Position].x = 0
            entity[Position].y = 0
          })
        },
      }
    })

    seele
      .registerComponent(FlyVector)
      .registerEntity(Bird)
      .registerSystem(FlySystem)

    const flyPetsQuery = defineQuery(q => q.every(Position, FlyVector, Pet))
    seele.createEntity(Bird, null, 2)
    const flyPets = seele.query(flyPetsQuery)

    it('birds move', () => {
      expect(testObj.flyPets.realityPositions[curTimeSlice]).toEqual(testObj.flyPets.expectPositions[curTimeSlice])
    })

    seele.start()
    vi.advanceTimersByTime(1000)
    seele.stop()

    describe('trasnform', () => {
      const Animal = defineComponent(() => ({
        name: 'animal'
      }), 'animal')
      seele.registerComponent(Animal)
      const animalQuery = defineQuery(q => q.every(Animal))
      const animal = seele.query(animalQuery, true)

      it('addComponent', () => {
        pets.traverse((entity, archetype) => {
          archetype.addComponent(entity, Animal)
        })

        expect(animal.size()).toBe(4)
      })

      it('removeComponent', () => {
        animal.traverse((entity, archetype) => {
          archetype.removeComponent(entity, Animal)
        })

        expect(animal.size()).toBe(0)
      })
    })
  })
})

describe('Seele Pure', () => {
  const seele = Seele()

  const Position = defineComponent(() => ({ x: 0, y: 0 }), 'position')

  const Cat = defineEntity(entity => {
    entity.addComponent(Position)
      .name('cat')
  })

  seele
    .vollerei()
    .registerComponent(Position)
    .registerEntity(Cat)
    .ready()

  const catQuery = seele.query(defineQuery(q => q.entity(Cat)))

  seele.createEntity(Cat, null, 3)

  it('cat in seele', () => {
    expect(catQuery.size()).toBe(3)
  })

  const strayCats = seele.createEntityPure(Cat, null, 2)

  it('cat in seele', () => {
    expect(catQuery.size()).toBe(3)
    expect(strayCats.length).toBe(2)
  })
})
