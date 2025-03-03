import classNames from "classnames"

export function AronaButton({ className, children, onClick, enabled = false }) {
  return (
    <div
      className={classNames(
        "arona-button item w-10 h-10 rounded bg-white/20 flex items-center justify-center transition ease-in-out duration-350 border-1 border-solid border-transparent box-border",
        className,
        { 'border-pink-400!': enabled },
      )}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
