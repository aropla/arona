# Intro

## 名字
Arona

## 解决的问题
基于目标驱动的时间管理 APP, 用于管理未来所要做的事与编织过去所做的事


# 需求

## 目标<goal -> miracle>
```ts
interface Miracle {
  id: string
  miracleRef: Miracle.id // 一个大目标, 可拆分成多个小目标
  name: string
  desc: string
  createdAt: Date
}

type MiracleSystem = {
  add: (miracle: Miracle): Result
  remove: (id: ID): Result
  update: (oldMiracle: Miracle, newMiracle: Miracle): Result
  find: (): Miracle[]
}
```

## 事件节点<event -> anchor>
```ts
type AnchorStatus = 'pending' | 'fail' | 'doing' | 'success' | 'blocked'

interface Anchor {
  id: string
  miracleRef: Miracle.id
  name: string
  desc: string
  createdAt: Date
  status: AnchorStatus

  /* status: fail */
  failTip: Tip

  /* status success */
  successTip: Tip

  /* status blocked */
  blockedTip: Tip
}

type AnchorSystem = {
  add: (anchor: Anchor): Result
  remove: (id: ID): Result
  update: (oldAnchor: Anchor, newAnchor: Anchor): Result
  find: (): Anchor[]
}
```

### 定时器<ticktock>
当被添加到一个 Anchor 上时,
自动进行定时添加功能。

规则集:
- 是否启用:
  enabled: 0
- 划定有效范围:
  start: -1
  end: -1
- 固定时间:
  time: -1
- 间隔时间:
  interval: -1
- 有效次数:
  hp: 1
- 自定义动作:
  name: ''
  check: (props) => boolean
  action: '' (需要提前设置)

## 视图面板<view-panel>
参照 blender 那样功能的视图面板

## 探索<explore>
查看其他人的目标安排

## 提醒与通知<toki>
字面意思的通知功能...


# Pages

### arona

### miracles
管理所有 miracles






```ts
const anchor = Anchor()

anchor.addComponent(A, {
  ...props
})
```
