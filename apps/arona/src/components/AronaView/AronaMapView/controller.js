import { buildController } from '@/components'
import Position from '@arona/components/Position'
import Vec3 from '@arona/components/Vec3'
import Camera from '@arona/entities/Camera'
import arona from '@arona'
import { useEffect } from 'react'
import gsap from 'gsap'

const aronaMapView = () => {
  const camera = arona.createEntity(Camera)
  let expectZoom = camera[Vec3].z

  const viewport = {
    width: 0,
    height: 0,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  }

  return {
    get viewport() {
      return viewport
    },
    get camera() {
      return camera
    },
    setViewport(rect) {
      viewport.width = rect.width
      viewport.height = rect.height
      viewport.top = rect.top
      viewport.right = rect.right
      viewport.bottom = rect.bottom
      viewport.left = rect.left
    },
    pan(position, props = {}) {
      gsap.to(camera[Position], {
        x: position.x,
        y: position.y,
        duration: 0.5,
        ...props,
      })
    },
    lookAt(position) {
      camera[Position].x = position.x
      camera[Position].y = position.y
    },
    zoom(zoom, props = {}) {
      expectZoom = zoom
      gsap.to(camera[Vec3], {
        z: zoom,
        duration: 0.5,
        ...props,
      })
    },
    getExpectZoom() {
      return expectZoom
    },
    /**
     * 当使用 scale 来进行 zoom 时，使用该公式
     * x: -(camera[Position].x - viewport.width / 2) * camera[Vec3].z,
     * y: -(camera[Position].y - viewport.height / 2) * camera[Vec3].z,
     *
     * 当使用 zoom 时来进行 zoom 时，使用该公式
     * x: -(camera[Position].x - viewport.width / 2 / camera[Vec3].z),
     * y: -(camera[Position].y - viewport.height / 2 / camera[Vec3].z),
     *
     * @returns
     */
    getVision() {
      return {
        x: -(camera[Position].x - viewport.width / 2 / camera[Vec3].z),
        y: -(camera[Position].y - viewport.height / 2 / camera[Vec3].z),
        z: camera[Vec3].z,
      }
    },
    screenToMapView(position) {
      return {
        x: position.x - viewport.left - viewport.width / 2 + camera[Position].x,
        y: position.y - viewport.top - viewport.height / 2 + camera[Position].y,
      }
    },
    mapViewToRender(position) {
      return {
        x: position.x - viewport.width / 2,
        y: position.y - viewport.height / 2,
      }
    },
    dispose() {
      arona.removeEntity(camera)
    },
  }
}

export const useAronaMapView = buildController(aronaMapView, mapView => {
  useEffect(() => {
    return () => {
      mapView.dispose()
    }
  }, [])
})
