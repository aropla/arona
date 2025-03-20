import { useCallback } from "react"
import { createContext } from "react"
import { useContext } from "react"
import { normalizeKey } from "./controller"
import { useEffect } from "react"
import { useState } from "react"
import { useMemo } from "react"
import classNames from "classnames"
import { Noop } from '@utils'

const AronaFormItemContext = createContext()
const AronaFormContext = createContext()

export function AronaForm({ children, controller, className }) {
  return (
    <AronaFormContext.Provider value={controller}>
      <div className={classNames('arona-form', className)}>
        {children}
      </div>
    </AronaFormContext.Provider>
  )
}

export function AronaFormItem({ children, name, className, onChange = Noop }) {
  const form = useContext(AronaFormContext)
  const [value, setValue] = useState(form.get(name) ?? '')

  useEffect(() => {
    const unsubscribe = form.subscribe(name, setValue)

    return () => unsubscribe()
  }, [name, form])

  const handleChange = useCallback((value, event) => {
    form.set(name, value)
    onChange(value, event, name)
  }, [form, name])

  return (
    <AronaFormItemContext.Provider value={{
      name,
      value,
      onChange: handleChange,
    }}>
      <div className={classNames("arona-form-item text-3.5", className)}>
        {children}
      </div>
    </AronaFormItemContext.Provider>
  )
}

export function AronaInput({ type = 'text', placeholder = '', className, autocomplete }) {
  const { name, value, onChange } = useContext(AronaFormItemContext)

  const handleChange = useCallback(event => {
    onChange(event.target.value, event)
  }, [onChange])

  const memoName = useMemo(() => normalizeKey(name), [name])

  return (
    <>
      <div className="arona-input">
        <input
          className={classNames(
            "w-full border-none px-2 rounded h-8 outline-none box-border",
            className,
          )}
          name={memoName}
          type={type}
          placeholder={placeholder}
          value={value ?? ''}
          onChange={handleChange}
          autoComplete={autocomplete}
        />
      </div>
    </>
  )
}
