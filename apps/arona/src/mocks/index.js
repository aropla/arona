import { Mine, TravelerID, Selfie, MiracleID, MiracleNodeID, Profile, MiracleRef, MiracleNodeRef, Position } from '@arona/components'

export const travelers = [
  {
    [TravelerID]: '10005950',
    [Profile]: {
      name: '彩りん',
      desc: '请与我一同, 回归海的怀抱',
    },
    [Selfie]: {
      url: '/default-traveler-selfie.jpg'
    },
  },
]

export const miracles = [
  {
    [MiracleID]: '1',
    [Profile]: {
      name: 'Arona',
      desc: '阿洛娜',
    },
  },
  {
    [MiracleID]: '2',
    [Profile]: {
      name: '3D Art',
      desc: 'What is render',
    },
  }
]

export const miracleNodes = [
  {
    [MiracleNodeID]: '1',
    [MiracleRef]: '1',
    [MiracleNodeRef]: '1',
    [Profile]: {
      name: 'Arona',
      desc: 'A.r.o.n.a 阿洛娜',
    },
    [Position]: {
      x: 0,
      y: 0,
    }
  },
  {
    [MiracleNodeID]: '2',
    [MiracleRef]: '1',
    [MiracleNodeRef]: '1',
    [Profile]: {
      name: 'Miracle Editor',
      desc: 'Miracle 绘制编辑器',
    },
    [Position]: {
      x: 0,
      y: 100,
    }
  },
  {
    [MiracleNodeID]: '3',
    [MiracleRef]: '1',
    [MiracleNodeRef]: '1',
    [Profile]: {
      name: 'Miracle 视图',
      desc: '',
    },
    [Position]: {
      x: 300,
      y: 0,
    }
  },
  {
    [MiracleNodeID]: '100',
    [MiracleRef]: '2',
    [MiracleNodeRef]: '100',
    [Profile]: {
      name: 'Blender',
      desc: '',
    },
    [Position]: {
      x: 80,
      y: 20,
    },
  },
  {
    [MiracleNodeID]: '101',
    [MiracleRef]: '2',
    [MiracleNodeRef]: '100',
    [Profile]: {
      name: '每日练习',
      desc: 'A.A.O',
    },
    [Position]: {
      x: 200,
      y: 120,
    },
  },
]
