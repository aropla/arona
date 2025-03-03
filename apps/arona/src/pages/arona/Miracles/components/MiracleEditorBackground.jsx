import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, OrbitControls, OrthographicCamera } from '@react-three/drei'
import { useRef } from 'react'
import { useEffect } from 'react'
import editorbackgroundVertexShader from '@shaders/miracle-editor/vertex.glsl'
import editorbackgroundFragmentShader from '@shaders/miracle-editor/fragment.glsl'
import { Uniform } from 'three'
import { Position } from '@arona/components'
import plana from '/plana.png'
import classNames from 'classnames'

export function MiracleEditorBackground({ className, miracle, mapView, editor }) {
  return (
    <div className={classNames("background absolute inset-0", className)}>
      <img
        className="absolute right-0 bottom-0 max-w-100 max-h-full opacity-25"
        src={plana}
        alt="plana"
      />
    </div>

    // <Canvas
    //   style={{
    //     position: 'absolute',
    //   }}
    //   camera={{
    //     fov: 75,
    //     near: 0.1,
    //     far: 1000,
    //     position: [0, 0, 5]
    //   }}
    // >
    //   <MiracleEditorExperience editor={editor} mapView={mapView} />
    // </Canvas>
  )
}

function MiracleEditorExperience({ mapView, editor }) {
  const { camera, clock, size, viewport } = useThree()
  const planeRef = useRef()

  console.log(size.width, size.height)

  useEffect(() => {
    if (!planeRef.current) {
      return
    }

    planeRef.current.scale.set(viewport.width, viewport.height, 1)
  }, [viewport])

  const uniforms = useRef({
    uGridSpacingX: new Uniform(editor.gapX),
    uGridSpacingY: new Uniform(editor.gapY),
    uPointDistance: new Uniform(1),
    uX: new Uniform(mapView.camera[Position].x / size.width * viewport.width),
    uY: new Uniform(mapView.camera[Position].y / size.height * viewport.height),
    uResolution: new Uniform({ x: size.width, y: size.height }),
  })

  useFrame(() => {
    uniforms.current.uX.value = mapView.camera[Position].x / size.width * viewport.width
    uniforms.current.uY.value = mapView.camera[Position].y / size.height * viewport.height
  })

  return (
    <>
      <OrthographicCamera makeDefault position={[0, 0, 5]} />
      <OrbitControls />
      <Environment preset="city" />
      <mesh ref={planeRef}>
        <planeGeometry args={[1, 1]} />
        <shaderMaterial
          vertexShader={editorbackgroundVertexShader}
          fragmentShader={editorbackgroundFragmentShader}
          transparent={true}
          uniforms={uniforms.current}
        />
      </mesh>
    </>
  )
}



















function MiracleEditorCanvas({ root, editor, _ }) {
  const containerRef = useRef()
  const canvasRef = useRef()

  const [size, setSize] = useState({
    width: 0,
    height: 0,
  })

  useEffect(() => {
    const container = containerRef.current

    const rect = container.getBoundingClientRect()
    setSize({
      width: rect.width,
      height: rect.height,
    })
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.beginPath()

    const linePositions = getLinesBetweenMiracleNodes(root, editor)

    for (let i = 0; i < linePositions.length; i++) {
      const { cmd, x, y } = linePositions[i]

      ctx[cmd](x, y)
    }

    ctx.strokeStyle = 'white'
    ctx.lineWidth = 0.5
    ctx.stroke()
  }, [root])

  return (
    <div ref={containerRef} className="miracle-editor-canvas absolute inset-0 overflow-hidden">
      <canvas ref={canvasRef} width={size.width} height={size.height}></canvas>
    </div>
  )
}

function calcAndSetTablePosition(root, y = 0, x = 0, rope = { maxY: 0 }) {
  rope.maxY = Math.max(rope.maxY, y)
  root.tablePosition = [rope.maxY, x]

  if (root.children) {
    for (let i = 0; i < root.children.length; i++) {
      calcAndSetTablePosition(root.children[i], rope.maxY + Math.min(i, 1), x + 1, rope)
    }
  }
}

function getLinesBetweenMiracleNodes(root, editorProps = MiracleEditorProps) {
  const linePositions = []

  const halfGapX = editorProps.gapX * 0.5
  const fullGapY = editorProps.gapY + editorProps.miracleHeight

  const originalPoint = {
    x: editorProps.miracleWidth,
    y: editorProps.miracleHeight * 0.5,
  }

  calcAndSetTablePosition(root)

  let nodes = [root]
  let nodesForward = []

  for (; nodes.length > 0;) {
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i]

      if (!node.children || node.children.length === 0) {
        continue
      }

      const [row, col] = node.tablePosition

      const startPoint = {
        x: originalPoint.x + col * (editorProps.gapX + editorProps.miracleWidth),
        y: originalPoint.y + row * (editorProps.gapY + editorProps.miracleHeight),
      }

      linePositions.push({
        cmd: 'moveTo',
        x: startPoint.x,
        y: startPoint.y,
      })

      // j === 0
      linePositions.push({
        cmd: 'lineTo',
        x: startPoint.x + editorProps.gapX,
        y: startPoint.y,
      })

      nodesForward.push(node.children[0])

      let lastChild = node.children[0]
      for (let j = 1; j < node.children.length; j++) {
        const child = node.children[j]
        const [childRow, childCol] = child.tablePosition

        linePositions.push({
          cmd: 'moveTo',
          x: startPoint.x + halfGapX,
          y: startPoint.y + (lastChild.tablePosition[0] - row) * fullGapY,
        })

        linePositions.push({
          cmd: 'lineTo',
          x: startPoint.x + halfGapX,
          y: startPoint.y + (childRow - row) * fullGapY,
        })

        linePositions.push({
          cmd: 'lineTo',
          x: startPoint.x + editorProps.gapX,
          y: startPoint.y + (childRow - row) * fullGapY,
        })

        lastChild = child
        nodesForward.push(child)
      }
    }

    nodes = nodesForward
    nodesForward = []
  }

  return linePositions
}
