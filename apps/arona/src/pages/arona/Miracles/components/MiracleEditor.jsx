import './index.scss'
import { useRef, useState, useCallback, useEffect } from 'react'
import classNames from 'classnames'
import { useKey } from 'react-use'

import { useMouseEvent } from '@hooks'

import arona from '@arona'

import ID from '@arona/components/ID'
import Profile from '@arona/components/Profile'
import Position from '@arona/components/Position'
import Renderer from '@arona/components/Renderer'
import Ref from '@arona/components/Ref'
import Vec3 from '@arona/components/Vec3'
import Temp from '@arona/components/Temp'
import MiracleRef from '@arona/components/MiracleRef'

import Miracle from '@arona/entities/Miracle'

import { MiraclesQuery } from '@arona/queries'

import { AronaForm, AronaFormItem, AronaInput } from '@/components/AronaInteraction/AronaInteraction'
import { useAronaForm } from '@/components/AronaInteraction/controller'
import AronaMapView, { useAronaMapView } from '@/components/AronaView/AronaMapView/AronaMapView'
import { MiracleEditorBackground } from './MiracleEditorBackground'
import { MiracleNode, toMiracleNodeRenderCoord } from './MiracleNode'
import { useSeeleFrame, useSeeleQuery } from '@app/seele-react'

const MiracleEditorOptions = {
  miracleWidth: 200,
  miracleHeight: 80,
  gapX: 80,
  gapY: 40,
  thresholdDistance: 40,
  magnetX: 40,
  magnetY: 20,
}

function tryGetMiracleNode(position, halfWidth, halfHeight, nodes) {
  const miracle = nodes.find(entity => {
    if (
      position.x > entity[Position].x - halfWidth &&
      position.x < entity[Position].x + halfWidth &&
      position.y > entity[Position].y - halfHeight &&
      position.y < entity[Position].y + halfHeight
    ) {
      return true
    } else {
      return false
    }
  })

  return miracle
}

function useKeyboardEvents() {

}

function useRuler() {
  const startPosition = useRef({
    x: 0,
    y: 0,
  })
  const curPosition = useRef({
    x: 0,
    y: 0,
  })

  return {
    startPosition: startPosition.current,
    curPosition: curPosition.current,
    startAt(position) {
      startPosition.current.x = position.x
      startPosition.current.y = position.y
    },
    moveTo(position) {
      curPosition.current.x = position.x
      curPosition.current.y = position.y
    },
    reset() {
      startPosition.current.x = 0
      startPosition.current.y = 0

      curPosition.current.x = 0
      curPosition.current.y = 0
    },
  }
}

function useDragHelper({
  onDragStart,
  onDragging,
  onDragStop,
}) {
  const ruler = useRuler()
  const isEnabled = useRef(false)
  const context = useRef({})

  return {
    context,
    startPosition: ruler.startPosition,
    curPosition: ruler.curPosition,
    setPosition(position) {
      const currentPosition = dragger.current.currentPosition

      currentPosition.x = position.x
      currentPosition.y = position.y
    },
    start(position) {
      isEnabled.current = true
      ruler.startAt(position)
      cb(ruler.curPosition, ruler.startPosition, context.current)

      onDragStart(ruler.curPosition, ruler.startPosition, context.current)
    },
    dragTo(position) {
      ruler.moveTo(position)

      onDragging(ruler.curPosition, ruler.startPosition, context.current)
    },
    stop(cb) {
      isEnabled.current = false
      cb(ruler.curPosition, ruler.startPosition, context.current)

      onDragStop(state.current, initialState.current, context.current)
    },
    reset() {
      isEnabled.current = false
      ruler.reset()
    },
  }
}

function useMiracleNodeDragger() {
  const mouseDragger = useDragHelper()
  const keyboardDragger = useDragHelper()

  return {

  }
}

export default function MiracleEditor({ miracle, editor = MiracleEditorOptions }) {
  const miracleNodes = useSeeleQuery(MiraclesQuery)
  const nodes = miracleNodes.array().filter(entity => entity[MiracleRef] === miracle[ID])
  const rootNode = nodes.find(node => node[ID] === node[Ref])

  const mapView = useAronaMapView()

  const [sidePanelShow, setSidePanelShow] = useState(false)
  const [selectedMiracleNode, setSelectedMiracleNode] = useState({
    value: null
  })

  const dragging = useRef({
    enabled: false,
    miracleNode: null,
    triggerPosition: {
      x: 0,
      y: 0,
    },
    anchorPosition: {
      x: 0,
      y: 0,
    }
  })

  useEffect(() => {
    setSelectedMiracleNode({ value: null })
    setSidePanelShow(false)

    dragging.current.miracleNode = null
    dragging.current.triggerPosition = {
      x: 0,
      y: 0,
    }
    dragging.current.anchorPosition = {
      x: 0,
      y: 0,
    }

    mapView.zoom(1)
    mapView.lookAt(rootNode[Position])
  }, [miracle])

  useMouseEvent('move', (mouse, event) => {
    if (!dragging.current.enabled) {
      return
    }

    const { miracleNode, triggerPosition, anchorPosition } = dragging.current

    const position = mapView.screenToMapView({
      x: event.clientX,
      y: event.clientY,
    })

    const zoom = mapView.getExpectZoom()

    miracleNode[Position].x = anchorPosition.x + (position.x - triggerPosition.x) / zoom
    miracleNode[Position].y = anchorPosition.y + (position.y - triggerPosition.y) / zoom

    if (selectedMiracleNode.value != null) {
      mapView.pan(miracleNode[Position])
    }
  })

  useMouseEvent('up', (mouse, event) => {
    if (!dragging.current.enabled) {
      return
    }

    const { miracleNode, triggerPosition, anchorPosition } = dragging.current

    const position = mapView.screenToMapView({
      x: event.clientX,
      y: event.clientY,
    })

    const zoom = mapView.getExpectZoom()

    let x = anchorPosition.x + (position.x - triggerPosition.x) / zoom
    let y = anchorPosition.y + (position.y - triggerPosition.y) / zoom

    /* 对齐网格 */
    x = Math.round(x / editor.magnetX) * editor.magnetX
    y = Math.round(y / editor.magnetY) * editor.magnetY

    miracleNode[Position].x = x
    miracleNode[Position].y = y

    if (selectedMiracleNode.value != null) {
      mapView.pan(miracleNode[Position])
    }

    /* 清除上下文信息 */
    dragging.current.enabled = false

    arona.delay(() => {
      arona.removeComponent(miracleNode, Renderer)
    })
  })

  useSeeleFrame(delta => {
    const camera = mapView.camera

    if (keyboard.current.w) {
      camera[Vec3].y -= 0.01 * delta
    }
    if (keyboard.current.s) {
      camera[Vec3].y += 0.01 * delta
    }
    if (keyboard.current.a) {
      camera[Vec3].x -= 0.01 * delta
    }
    if (keyboard.current.d) {
      camera[Vec3].x += 0.01 * delta
    }
  })

  const keyboard = useRef({
    w: false,
    d: false,
    s: false,
    a: false,
    f: false,
  })

  const keyboardContext = useRef({
    f: {
      lock: false,
      keydownTime: 0,
    }
  })

  const keyboardOptions = {
    keyboardDragThreshold: 250, /* 触发拖拽事件的长按时间 */
  }

  useKey('w', () => keyboard.current.w = true, { event: 'keydown' })
  useKey('w', () => keyboard.current.w = false, { event: 'keyup' })
  useKey('a', () => keyboard.current.a = true, { event: 'keydown' })
  useKey('a', () => keyboard.current.a = false, { event: 'keyup' })
  useKey('s', () => keyboard.current.s = true, { event: 'keydown' })
  useKey('s', () => keyboard.current.s = false, { event: 'keyup' })
  useKey('d', () => keyboard.current.d = true, { event: 'keydown' })
  useKey('d', () => keyboard.current.d = false, { event: 'keyup' })

  useKey('f', () => {
    const miracleNode = tryGetMiracleNode(mapView.camera[Position], editor.miracleWidth / 2, editor.miracleHeight / 2, nodes)

    if (miracleNode == null) {
      return
    }

    /* keydown 会持续触发, 为了防止重复操作, 只在初次触发后进行拖拽前置判断 */
    if (!keyboardContext.current.lock) {
      dragging.current.miracleNode = miracleNode

      keyboard.current.f = true
      keyboardContext.current.f.keydownTime = Date.now()
    }
  }, { event: 'keydown' }, [nodes])

  useKey('f', () => {
    keyboard.current.f = false
    keyboardContext.current.lock = false

    /* 如果未激活 dragging 逻辑, 处理 selected 逻辑 */
    if (!dragging.current.enabled) {
      const miracleNode = tryGetMiracleNode(mapView.camera[Position], editor.miracleWidth / 2, editor.miracleHeight / 2, nodes)

      if (!miracleNode) {
        handleMiracleNodeSelect({ miracleNode: null })
      } else {
        if (selectedMiracleNode.value == null) {
          handleMiracleNodeSelect({ miracleNode })
        } else {
          if (selectedMiracleNode.value === miracleNode) {
            handleMiracleNodeSelect({ miracleNode: null })
          } else {
            handleMiracleNodeSelect({ miracleNode })
          }
        }
      }

      return
    }

    /* 处理 dragging 逻辑 */
    const { miracleNode, triggerPosition, anchorPosition } = dragging.current

    const position = mapView.camera[Position]

    const zoom = mapView.getExpectZoom()

    let x = anchorPosition.x + (position.x - triggerPosition.x) / zoom
    let y = anchorPosition.y + (position.y - triggerPosition.y) / zoom

    /* 对齐网格 */
    x = Math.round(x / editor.magnetX) * editor.magnetX
    y = Math.round(y / editor.magnetY) * editor.magnetY

    miracleNode[Position].x = x
    miracleNode[Position].y = y

    if (selectedMiracleNode.value != null) {
      mapView.pan(miracleNode[Position])
    }

    /* 清除上下文信息 */
    dragging.current.enabled = false

    arona.delay(() => {
      arona.removeComponent(miracleNode, Renderer)
    })
  }, { event: 'keyup' }, [nodes])

  useSeeleFrame(() => {
    if (!keyboard.current.f) {
      return
    }

    if (!dragging.current.enabled) {
      /* 根据 f 的长按时间，决定是否进入拖拽模式 */
      const duration = Date.now() - keyboardContext.current.f.keydownTime

      if (duration < keyboardOptions.keyboardDragThreshold) {
        return
      }

      const miracleNode = dragging.current.miracleNode
      const $miracleNode = document.getElementById(`miracleNode.${miracleNode[ID]}`)

      if (!$miracleNode) {
        return
      }

      dragging.current.enabled = true

      setDraggingContext(miracleNode, miracleNode[Position], mapView.camera[Position])

      arona.addComponent(miracleNode, Renderer, entity => {
        const position = toMiracleNodeRenderCoord(entity, editor, mapView.getExpectZoom())
        $miracleNode.style.transform = `translate(${position.x}px, ${position.y}px)`
      })

      return
    }

    if (dragging.current.enabled) {
      const { miracleNode, triggerPosition, anchorPosition } = dragging.current

      const position = mapView.camera[Position]

      const zoom = mapView.getExpectZoom()

      miracleNode[Position].x = anchorPosition.x + (position.x - triggerPosition.x) / zoom
      miracleNode[Position].y = anchorPosition.y + (position.y - triggerPosition.y) / zoom
    }
  })

  const handleMiracleNodeUnselect = useCallback(() => {
    if (dragging.current.enabled) {
      return
    }

    if (selectedMiracleNode.value) {
      handleMiracleNodeSelect({ miracleNode: null })
    }
  }, [selectedMiracleNode])

  const handleMiracleNodeSelect = useCallback(({ miracleNode }) => {
    if (miracleNode == null) {
      mapView.zoom(1)
      setSidePanelShow(false)
      setSelectedMiracleNode({ value: null })

      return
    }

    setSelectedMiracleNode(prevMiracleNode => {
      if (prevMiracleNode.value != null && prevMiracleNode.value[ID] === miracleNode[ID]) {
        mapView.zoom(1)
        setSidePanelShow(false)

        return { value: null }
      } else {
        mapView.zoom(1.3)
        mapView.pan(miracleNode[Position])
        setSidePanelShow(true)

        return { value: miracleNode }
      }
    })
  }, [])

  const setDraggingContext = useCallback((miracleNode, anchorPosition, triggerPosition) => {
    dragging.current.miracleNode = miracleNode
    dragging.current.anchorPosition = {
      x: anchorPosition.x,
      y: anchorPosition.y,
    }
    dragging.current.triggerPosition = {
      x: triggerPosition.x,
      y: triggerPosition.y,
    }
  }, [])

  const handleMiracleNodeDragStart = useCallback(({ miracleNode, event }) => {
    dragging.current.enabled = true

    const position = mapView.screenToMapView({
      x: event.clientX,
      y: event.clientY,
    })

    setDraggingContext(miracleNode, miracleNode[Position], position)
  }, [])

  const handleMiracleNodeSave = useCallback(() => {
    setSidePanelShow(false)
    mapView.zoom(1)
  }, [])

  const handleMiracleNodeRemove = useCallback(miracleNode => {
    arona.removeEntity(miracleNode)

    setSelectedMiracleNode({ value: null })
    setSidePanelShow(false)
    mapView.zoom(1)
  }, [])

  const handleMiracleNodeCreate = useCallback(() => {
    const entity = arona.createEntity(Miracle)

    arona.addComponent(entity, Temp)
    entity[ID] = String(Date.now())
    entity[Position] = {
      x: parseInt(mapView.camera[Position].x),
      y: parseInt(mapView.camera[Position].y),
    }
    entity[MiracleRef] = miracle[ID]

    setSelectedMiracleNode({ value: entity })
    setSidePanelShow(true)
    mapView.zoom(1.3)

    mapView.pan(entity[Position])
  }, [miracle])

  useKey(
    (event => event.shiftKey && (event.key === 'a' || event.key === 'A')),
    handleMiracleNodeCreate,
    { event: 'keyup' }
  )

  useKey(
    'x',
    () => handleMiracleNodeRemove(selectedMiracleNode.value),
    { event: 'keyup' },
    [selectedMiracleNode]
  )

  return (
    <div className="miracle-editor flex-1 flex relative overflow-hidden select-none" onMouseUp={handleMiracleNodeUnselect}>
      <div className="center-point flex absolute inset-0 items-center justify-center">
        <div className="point rounded-full bg-red-300 w-2 h-2 z-1"></div>
      </div>

      <MiracleEditorBackground
        className="z-0"
        miracle={miracle}
        mapView={mapView}
        editor={editor}
      />
      <AronaMapView controller={mapView}>
        {
          nodes.map(node => (
            <MiracleNode
              key={node[ID]}
              miracleNode={node}
              editor={editor}
              mapView={mapView}
              onSelect={handleMiracleNodeSelect}
              onDragStart={handleMiracleNodeDragStart}
            />
          ))
        }
      </AronaMapView>

      <MiracleEditorSidePanel
        miracleNode={selectedMiracleNode}
        sidePanelShow={sidePanelShow}
        setSidePanelShow={setSidePanelShow}
        onSave={handleMiracleNodeSave}
        onRemove={handleMiracleNodeRemove}
      />

      <MiracleEditorBottomBar
        miracle={miracle}
        miracleNode={selectedMiracleNode}
        mapView={mapView}
        onCreate={handleMiracleNodeCreate}
        onRemove={handleMiracleNodeRemove}
      />
    </div>
  )
}

function MiracleEditorBottomBar({ miracle, miracleNode, mapView, onCreate, onRemove }) {
  const camera = mapView.camera

  const [debug, rerender] = useState()

  useEffect(() => {
    const timer = setInterval(() => {
      rerender(Date.now())
    }, 1000 / 30)

    return () => clearInterval(timer)
  }, [debug])

  const handleMiracleNodeCreate = useCallback(() => {
    onCreate(entity)
  }, [onCreate])

  const handleStopPropagation = useCallback(event => {
    event.stopPropagation()
  }, [])

  const handleMiracleNodeRemove = useCallback(() => {
    onRemove(miracleNode.value)
  }, [onRemove, miracleNode])

  return (
    <div
      className="miracle-editor-bottom-bar absolute bottom-0 left-0 right-0 h-8 px-2 rounded flex items-center"
      onMouseUp={handleStopPropagation}
    >
      <div className="position text-3 flex">
        <div className="name text-gray-500 mr-1">position:</div>
        <div className="value flex text-gray-500">
          <div className="x">({camera[Position].x},</div>
          <div className="y">{camera[Position].y})</div>
        </div>
      </div>

      <div className="menu-bar self-end flex space-x-3 absolute left-4 bottom-8 select-none">
        <div className="item w-10 h-10 rounded bg-white/20 flex items-center justify-center" onClick={handleMiracleNodeCreate}>+</div>
        <div
          className={classNames(
            "action-item w-10 h-10 rounded bg-white/20 flex items-center justify-center transition ease-in-out duration-350 border-1 border-solid border-transparent box-border",
            { 'border-pink-400!': miracleNode.value },
          )}
          onClick={handleMiracleNodeRemove}
        >-</div>
      </div>
    </div>
  )
}

function MiracleEditorSidePanel({ miracleNode, sidePanelShow, onSave, onRemove }) {
  const form = useAronaForm(miracleNode.value)

  useEffect(() => {
    form.setData(miracleNode.value)
  }, [miracleNode])

  const handleMiracleNodeSave = useCallback(() => {
    arona.removeComponent(miracleNode.value, Temp)

    onSave(miracleNode.value)
  }, [miracleNode])

  const handleMiracleNodeRemove = useCallback(() => {
    onRemove(miracleNode.value)
  }, [onRemove, miracleNode])

  const handleStopPropagation = useCallback(event => {
    event.stopPropagation()
  }, [])

  return (
    <div
      className={classNames(
        "miracle-editor-sidebar absolute w-100 right-0 bg-white/20 inset-y-0 rounded p-4 m-4 hidden",
        { 'fade-in': sidePanelShow },
        { 'fade-out': !sidePanelShow },
      )}
      onMouseUp={handleStopPropagation}
    >
      <div className="title-bar h-10">
        <div className="title">编辑 Miracle</div>
      </div>

      <AronaForm
        controller={form}
        className="space-y-4"
      >
        <AronaFormItem name={[Profile, 'name']}>
          <div className="name mb-1">标题</div>
          <AronaInput />
        </AronaFormItem>

        <AronaFormItem name={[Profile, 'desc']}>
          <div className="desc mb-1">描述</div>
          <AronaInput />
        </AronaFormItem>

        <AronaFormItem name={Ref}>
          <div className="ref mb-1">所属节点</div>
          <AronaInput />
        </AronaFormItem>

        <AronaFormItem name={MiracleRef}>
          <div className="ref mb-1">所属 Miracle</div>
          <AronaInput />
        </AronaFormItem>

        <AronaFormItem name={[Position, 'x']}>
          <div className="name mb-1">x</div>
          <AronaInput />
        </AronaFormItem>

        <AronaFormItem name={[Position, 'y']}>
          <div className="desc mb-1">y</div>
          <AronaInput />
        </AronaFormItem>

        {miracleNode.value?.[Temp] && (
          <div className="button" onClick={handleMiracleNodeSave}>保存</div>
        )}

        <div className="button" onClick={handleMiracleNodeRemove}>删除</div>
      </AronaForm>
    </div>
  )
}
