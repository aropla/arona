import classNames from "classnames";

export default function ViewPanel({ children, className = null }) {
  return (
    <div className={classNames('view-panel', className)}>
      {children}
    </div>
  )
}
