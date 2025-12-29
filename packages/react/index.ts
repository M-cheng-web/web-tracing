import {
  useEffect,
  createContext,
  useContext,
  ReactNode,
  createElement
} from 'react'
import { init, InitOptions } from '@web-tracing/core'

// Re-export core functionalities
export * from '@web-tracing/core'

// Context to hold any instance state if needed in the future
// Currently core is a singleton, so we mostly use this for logical wrapping
const WebTracingContext = createContext<boolean>(false)

export interface WebTracingProviderProps {
  options: InitOptions
  children: ReactNode
}

export const WebTracingProvider = ({
  options,
  children
}: WebTracingProviderProps) => {
  useEffect(() => {
    init(options)
  }, [options])

  return createElement(WebTracingContext.Provider, { value: true }, children)
}

export const useWebTracing = () => {
  return useContext(WebTracingContext)
}

// Function mode support is already provided by exporting `init` from core
// but we re-export it explicitly to match the requirement "support function registration"
export { init }
