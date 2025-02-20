import classNames from "classnames"
import { forwardRef } from "react"

export default forwardRef(function AronaScrollView({ children, className }, ref) {
  return (
    <div
      ref={ref}
      className={classNames(
        'arona-scroll-view overflow-hidden flex-1 flex flex-col',
        className,
      )}
    >
      {children}
    </div>
  )
})
