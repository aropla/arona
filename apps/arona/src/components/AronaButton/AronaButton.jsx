import classNames from "classnames"

export function AronaButton({ className, children, onClick, enabled = false }) {
  return (
    <div
      className={classNames(
        "box-border arona-button w-10 h-10 rounded bg-white/20 flex items-center justify-center transition ease-in-out duration-350 border-1 border-solid border-transparent select-none",
        "hover:border-white/50",
        "active:active:border-blue-300 active:bg-white/50",
        className,
        { 'border-pink-400!': enabled },
      )}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
