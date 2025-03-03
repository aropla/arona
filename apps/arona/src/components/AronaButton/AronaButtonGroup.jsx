import classNames from "classnames"

export function AronaButtonGroup({ children, className }) {
  return (
    <div className={classNames(
      "arona-button-group flex space-x-3 text-3 select-none",
      className
    )}>
      {children}
    </div>
  )
}
