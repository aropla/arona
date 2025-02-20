import Profile from '@arona/components/Profile'
import avatar from './avatar.jpg'
import ID from '@arona/components/ID'
import Ref from '@arona/components/Ref'
import Position from '@arona/components/Position'
import MiracleRef from '@arona/components/MiracleRef'

export const travler = {
  uid: '10005950',
  info: {
    name: '彩りん',
    desc: '请与我一同, 回归海的怀抱',
  },
  avatar,
}

export const miracles = [
  {
    [ID]: '1',
    [Profile]: {
      name: 'Arona',
      desc: 'A.r.o.n.a 阿洛娜',
    },
  },
  {
    [ID]: '2',
    [Profile]: {
      name: '3D art',
      desc: '3D 相关',
    },
  }
]

export const miracleNodes = [
  {
    [ID]: '1',
    [MiracleRef]: '1',
    [Ref]: '1',
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
    [ID]: '2',
    [MiracleRef]: '1',
    [Ref]: '1',
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
    [ID]: '3',
    [MiracleRef]: '1',
    [Ref]: '1',
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
    [ID]: '100',
    [MiracleRef]: '2',
    [Ref]: '100',
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
    [ID]: '101',
    [MiracleRef]: '2',
    [Ref]: '100',
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

export const miracleNodes2 = {
  '1': {
    children: [
      {
        [ID]: '1',
        miracleRef: '1',
        [Ref]: '1',
        [Profile]: {
          name: 'Miracle Editor',
          desc: 'Miracle 绘制编辑器',
        },
        children: [
          {
            [ID]: '100',
            miracleRef: '1',
            [Ref]: '1',
            [Profile]: {
              name: 'Miracle 视图',
              desc: '',
            },
            children: [
              {
                [ID]: '101',
                miracleRef: '1',
                [Ref]: '100',
                [Profile]: {
                  name: '滚动视图',
                  desc: '',
                },
              },
              {
                [ID]: '102',
                miracleRef: '1',
                [Ref]: '100',
                [Profile]: {
                  name: '连接线',
                  desc: '',
                },
              }
            ]
          },
          {
            [ID]: '2',
            miracleRef: '1',
            [Ref]: '1',
            [Profile]: {
              name: 'Miracle 创建',
              desc: '',
            },
            children: [
              {
                [ID]: '3',
                miracleRef: '1',
                [Ref]: '2',
                [Profile]: {
                  name: 'Miracle 修改',
                  desc: '',
                },
              },
              {
                [ID]: '8',
                miracleRef: '1',
                [Ref]: '3',
                [Profile]: {
                  name: 'Miracle 删除',
                  desc: '',
                },
              },
            ]
          },
          {
            [ID]: '6',
            miracleRef: '1',
            [Ref]: '1',
            [Profile]: {
              name: 'Miracle 查找',
              desc: '',
            },
          }
        ]
      },
      {
        [ID]: '4',
        miracleRef: '1',
        [Ref]: '1',
        [Profile]: {
          name: 'Anchor',
          desc: '待办事项',
        },
        children: [
          {
            [ID]: '5',
            miracleRef: '1',
            [Ref]: '4',
            [Profile]: {
              name: 'Anchor 创建',
              desc: '',
            },
          }
        ]
      },
    ]
  },
  '2': {
    children: [
      {
        [ID]: '7',
        miracleRef: '2',
        [Profile]: {
          name: 'Blender',
          desc: '',
        },
      },
      {
        [ID]: '8',
        miracleRef: '2',
        [Profile]: {
          name: '建筑学',
          desc: '',
        },
        children: [
          {
            [ID]: '9',
            miracleRef: '2',
            [Ref]: '8',
            [Profile]: {
              name: '建筑学入门',
              desc: 'Building',
            },
          }
        ]
      }
    ]
  }
}
