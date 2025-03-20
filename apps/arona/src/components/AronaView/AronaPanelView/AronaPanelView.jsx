import classNames from "classnames";

export function AronaPanelView({ children, className = null }) {
  return (
    <div className={classNames('arona-panel-view flex', className)}>
      {children}
    </div>
  )
}
