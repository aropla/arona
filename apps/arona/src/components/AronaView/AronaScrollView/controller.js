import { useEffect } from 'react'
import { buildController } from '@/components'
import { Noop } from '@utils'
import { arona } from '@arona'
import { Position, Profile, Physical, Velocity } from '@arona/components'
import { Camera } from '@arona/entities'
import gsap from 'gsap'

function normalizeOptions(options) {
  return {
    /**
     * 初始位置
     */
    startPosition: {
      x: options.startPosition?.x ?? 0,
      y: options.startPosition?.y ?? 0,
    },

    /**
     * 沿着 options.axis 进行滚动
     */
    axis: options.axis ?? 'y',

    /**
     * 是否开启无限滚动
     */
    infinite: options.infinite ?? false,

    /**
     * 加速度倍率
     */
    accelerationFactor: options.accelerationFactor ?? 0.02,

    /**
     * 加速度衰减倍率
     */
    accelerationFriction: options.accelerationFriction ?? 0.5,

    /**
     * 当加速度小于此值时，认为加速度为 0
     */
    accelerationThreshold: options.accelerationThreshold ?? 0.01,

    /**
     * TODO 回弹因子
     */
    elasticity: options.elasticity ?? 0.2,

    /**
     * 可滚动区域偏移
     */
    scrollableOffset: {
      x: options.scrollableOffset?.x ?? [0, 0],
      y: options.scrollableOffset?.y ?? [0, 0],

      /**
       * 是否要在 calcScrollableArea 时算上 viewportMaxSize，
       * 如果为 true，此时在滚动条在内容不足时一般不会允许滚动，这与浏览器默认的滚动条一样。
       * 如果为 false，此时在滚动条在内容不足一般允许滚动，可见 VSCode 在代码只有 2 行时，依旧允许滚动，
       * 配合上 scrollableOffset.y = [0, LINE_HEIGHT]，可以做到与 VSCode 一样的效果
       */
      containViewportMax: options.scrollableOffset?.containViewportMax ?? true,
    },

    /**
     * scroller 配置
     */
    scroller: {
      /**
       * 容器内容滚动时的摩擦力
       */
      friction: options.scroller?.friction ?? 0.3,
    },
    /**
     * thumb 配置
     */
    thumb: {
      /**
       * thumb 滚动时的摩擦力
       */
      friction: options.thumb?.friction ?? 0.3,

      /**
       * thumb 的最小尺寸
       */
      minSize: options.thumb?.minSize ?? 40,
    },

    onReady: options.onReady ?? Noop,
    onScrollStart: options.onScrollStart ?? Noop,
    onScroll: options.onScroll ?? Noop,
    onScrollEnd: options.onScrollEnd ?? Noop,
  }
}

function AronaScrollView(rawOptions = {}) {
  let options = normalizeOptions(rawOptions)

  let scroller = arona.createEntity(Camera, {
    [Profile]: {
      name: 'scroll-view-' + Math.random(),
    },
    [Physical]: {
      friction: options.scroller.friction,
    },
    [Position]: {
      x: options.startPosition.x,
      y: options.startPosition.y,
    },
  })

  let thumb = arona.createEntity(Camera, {
    [Profile]: {
      name: 'thumb-' + Math.random(),
    },
    [Physical]: {
      friction: options.thumb.friction,
    },
  })

  const viewportMaxSize = { x: 0, y: 0 }
  const contentSize = { x: 0, y: 0 }
  const scrollbarSize = { x: 0, y: 0 }
  let oldScrollerPosition = { x: 0, y: 0 }
  let oldThumbPosition = { x: 0, y: 0 }
  let oldThumbSize = { x: 0, y: 0 }

  const scrollableArea = { x: [0, 0], y: [0, 0] }
  const scrollableDistance = { x: 0, y: 0 }
  const viewport = { x: 0, y: 0 }
  const thumbSize = { x: 0, y: 0 }
  const isScrolling = { x: false, y: false }
  const isScrollable = { x: false, y: false }

  const physical = {
    acceleration: 0,
  }

  const status = {
    isViewportReady: false,
    isContentReady: false,
  }

  const animations = {
    scrolling: null
  }

  return {
    setup(rawOptions) {
      options = normalizeOptions(rawOptions)
    },
    get scroller() {
      return scroller
    },
    get thumb() {
      return thumb
    },
    get axis() {
      return options.axis
    },
    get viewportMaxSize() {
      return viewportMaxSize
    },
    get contentSize() {
      return contentSize
    },
    get scrollableDistance() {
      return scrollableDistance
    },
    setViewportMaxSize(size = { x: 0, y: 0 }) {
      viewportMaxSize.x = size.width
      viewportMaxSize.y = size.height

      recalc(viewportMaxSize, contentSize, scrollbarSize, options)

      if (!status.isViewportReady) {
        if (viewportMaxSize.x !== 0 || viewportMaxSize.y !== 0) {
          status.isViewportReady = true

          if (status.isViewportReady && status.isContentReady) {
            options.onReady(viewportMaxSize, contentSize)
          }
        }
      }
    },

    setContentSize(size = { x: 0, y: 0 }) {
      contentSize.x = size.width
      contentSize.y = size.height

      recalc(viewportMaxSize, contentSize, scrollbarSize, options)

      if (!status.isContentReady) {
        if (contentSize.x !== 0 || contentSize.y !== 0) {
          status.isContentReady = true

          if (status.isViewportReady && status.isContentReady) {
            options.onReady(viewportMaxSize, contentSize)
          }
        }
      }
    },
    setScrollbarSize(size = { x: 0, y: 0 }) {
      scrollbarSize.x = size.width
      scrollbarSize.y = size.height

      recalc(viewportMaxSize, contentSize, scrollbarSize, options)
    },
    addAcceleration(acc) {
      physical.acceleration += acc
    },
    setAcceleration(acc) {
      physical.acceleration = acc
    },
    update(delta) {
      const { axis, accelerationFactor, accelerationFriction, accelerationThreshold, infinite, onScrollStart, onScroll, onScrollEnd } = options

      const position = scroller[Position]
      const distance = scrollableDistance[axis]

      /**
       * viewportSize, contentSize 会依赖 DOM 进行计算，
       * 此时可能会由于 viewportSize 或者 contentSize 被 unmount，
       * 导致 scrollableDistance 等值为 0
       * 因此可认为 scrollableDistance 为 0 时无法滚动
       */
      if (distance === 0) {
        return
      }

      if (!isScrolling[axis] && scroller[Velocity][axis] !== 0) {
        isScrolling[axis] = true
        killScrollingAnimation()

        onScrollStart(position[axis] / distance, scroller[Velocity][axis])
      }

      scroller[Velocity][axis] += physical.acceleration * accelerationFactor * delta
      physical.acceleration *= (1 - accelerationFriction)

      if (Math.abs(physical.acceleration) < accelerationThreshold) {
        physical.acceleration = 0
      }

      if (!infinite) {
        if (position[axis] < scrollableArea[axis][0]) {
          scroller[Position][axis] = scrollableArea[axis][0]
          scroller[Velocity][axis] = 0
        } else if (position[axis] > scrollableArea[axis][1]) {
          if (distance > 0) {
            scroller[Position][axis] = scrollableArea[axis][1]
            scroller[Velocity][axis] = 0
          } else {
            scroller[Position][axis] = 0
            scroller[Velocity][axis] = 0
          }
        }
      }

      const normalizedDistance = scroller[Position][axis] / distance

      thumb[Position][axis] = normalizedDistance * (scrollbarSize[axis] - thumbSize[axis])
      thumb[Velocity][axis] = 0

      if (isScrolling[axis]) {
        onScroll(normalizedDistance, scroller[Velocity][axis])
      }

      if (isScrolling[axis] && scroller[Velocity][axis] === 0) {
        isScrolling[axis] = false
        onScrollEnd(normalizedDistance, 0)
      }
    },
    scrollTo,
    scrollBy(position, smooth) {
      scrollTo({
        x: scroller[Position].x + (position.x ?? 0),
        y: scroller[Position].y + (position.y ?? 0),
      }, smooth)
    },
    getScrollerPosition() {
      const newPosition = {
        x: -scroller[Position].x,
        y: -scroller[Position].y,
      }

      const position = oldScrollerPosition
      oldScrollerPosition = newPosition

      return [newPosition, position]
    },
    getThumbPosition() {
      const newPosition = {
        x: thumb[Position].x,
        y: thumb[Position].y,
      }

      const position = oldThumbPosition
      oldThumbPosition = newPosition

      return [newPosition, position]
    },
    getThumbSize() {
      const newThumbSize = {
        x: thumbSize.x,
        y: thumbSize.y,
      }

      const size = oldThumbSize
      oldThumbSize = newThumbSize

      return [newThumbSize, size]
    },
    cleanup() {
      arona.removeEntity(scroller)
    },
  }

  function recalc(viewportMaxSize, contentSize, scrollbarSize, options) {
    const newViewport = calcViewport(viewportMaxSize, contentSize)

    viewport.x = newViewport.x
    viewport.y = newViewport.y

    const newScrollableArea = calcScrollableArea(viewportMaxSize, contentSize, options)

    scrollableArea.x = newScrollableArea.x
    scrollableArea.y = newScrollableArea.y

    scrollableDistance.x = newScrollableArea.x[1] - newScrollableArea.x[0]
    scrollableDistance.y = newScrollableArea.y[1] - newScrollableArea.y[0]

    isScrollable.x = (newScrollableArea.x[1] - newScrollableArea.x[0]) > 0
    isScrollable.y = (newScrollableArea.y[1] - newScrollableArea.y[0]) > 0

    const newThumbSize = calcThumbSize(newViewport, newScrollableArea, scrollbarSize)

    thumbSize.x = newThumbSize.x
    thumbSize.y = newThumbSize.y
  }

  function scrollTo(position, smooth = false) {
    if (!smooth) {
      scroller[Position].x = position.x ?? 0
      scroller[Position].y = position.y ?? 0

      return
    }

    killScrollingAnimation()
    doScrollingAnimation(position, smooth)
  }

  function calcScrollableArea(viewportMaxSize, contentSize, options) {
    const containViewportMax = options.scrollableOffset.containViewportMax

    const x = contentSize.x + options.scrollableOffset.x[1] - (containViewportMax ? viewportMaxSize.x : 0)
    const y = contentSize.y + options.scrollableOffset.y[1] - (containViewportMax ? viewportMaxSize.y : 0)

    return {
      x: [options.scrollableOffset.x[0], x],
      y: [options.scrollableOffset.y[0], y],
    }
  }

  function calcViewport(viewportMaxSize, contentSize) {
    return {
      x: Math.min(viewportMaxSize.x, contentSize.x),
      y: Math.min(viewportMaxSize.y, contentSize.y),
    }
  }

  function calcThumbSize(viewport, scrollableArea, scrollbarSize) {
    return {
      x: isScrollable.x ? viewport.x / (viewport.x + scrollableArea.x[1] - scrollableArea.x[0]) * scrollbarSize.x : scrollbarSize.x,
      y: isScrollable.y ? viewport.y / (viewport.y + scrollableArea.y[1] - scrollableArea.y[0]) * scrollbarSize.y : scrollbarSize.y,
    }
  }

  function killScrollingAnimation() {
    if (animations.scrolling) {
      animations.scrolling.kill()
    }

    animations.scrolling = null
  }

  function doScrollingAnimation(position, options) {
    animations.scrolling = gsap.to(scroller[Position], {
      x: position.x ?? 0,
      y: position.y ?? 0,
      duration: 0.3,
      ...(options ?? {}),
    })
  }
}

export const useAronaScrollView = buildController(AronaScrollView, (view, options) => {
  useEffect(() => {
    view.setup(options)
  }, [options])
})
