import { useCallback } from "react"
import { createContext } from "react"
import { useContext } from "react"
import { normalizeKey } from "./controller"
import { useEffect } from "react"
import { useState } from "react"
import { useMemo } from "react"
import classNames from "classnames"

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

export function AronaFormItem({ children, name, className }) {
  const form = useContext(AronaFormContext)
  const [value, setValue] = useState(form.get(name) ?? '')

  useEffect(() => {
    const unsubscribe = form.subscribe(name, setValue)

    return () => unsubscribe()
  }, [name, form])

  const onChange = useCallback((value, _event) => {
    form.set(name, value)
  }, [form, name])

  return (
    <AronaFormItemContext.Provider value={{
      name,
      value,
      onChange,
    }}>
      <div className={classNames("arona-form-item text-3", className)}>
        {children}
      </div>
    </AronaFormItemContext.Provider>
  )
}

export function AronaInput({ type = 'text', placeholder = '' }) {
  const { name, value, onChange } = useContext(AronaFormItemContext)

  const handleChange = useCallback(event => {
    onChange(event.target.value, event)
  }, [onChange])

  const memoName = useMemo(() => normalizeKey(name), [name])

  return (
    <>
      <div className="arona-input">
        <input
          className="w-full border-none p-3 rounded h-8 outline-none box-border"
          name={memoName}
          type={type}
          placeholder={placeholder}
          value={value ?? ''}
          onChange={handleChange}
        />
      </div>
    </>
  )
}
