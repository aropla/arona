import { useCallback } from 'react'
import { useEffect } from 'react'
import { forwardRef } from 'react'
import { useRef } from 'react'
import arona from '@arona'
import Renderer from '@arona/components/Renderer'

export { useAronaMapView } from './controller'

export default forwardRef(function AronaMapView({ controller, children, mapViewRef, mapContentRef }, ref) {
  const mapView = controller ?? useAronaMapView()
  mapViewRef = mapViewRef ?? useRef()
  mapContentRef = mapContentRef ?? useRef()

  const handleResize = useCallback(() => {
    const rect = mapViewRef.current.getBoundingClientRect()
    mapView.setViewport(rect)
  }, [])

  useEffect(() => {
    handleResize()

    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    arona.addComponent(mapView.camera, Renderer, (entity, interp) => {
      const vision = mapView.getVision(entity)

      mapContentRef.current.style.transform = `translate(${vision.x}px, ${vision.y}px)`
      mapContentRef.current.style.zoom = vision.z
    })

    return () => {
      arona.removeComponent(mapView.camera, Renderer)
    }
  }, [])

  return (
    <div className="arona-map-view flex-1 flex">
      <div
        ref={mapViewRef}
        className="map-view bg-white/5 rounded flex-1 flex overflow-hidden"
      >
        {/* <div className="camera rounded-full w-2 h-2 absolute bg-red-300 top-1/2 left-1/2" ref={cameraRef}></div> */}
        <div
          ref={mapContentRef}
          className="map-content flex-1 flex flex-col relative origin-center will-change-transform"
        >
          {children}
        </div>
      </div>
    </div>
  )
})
