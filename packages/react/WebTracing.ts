import { Component } from 'react'
import type { PropsWithChildren } from 'react'
import { init } from '@web-tracing/core'
import type { InitOptions } from '@web-tracing/core'

export type WebTracingProps = PropsWithChildren<InitOptions>

class WebTracing extends Component<WebTracingProps> {
  constructor(props: WebTracingProps) {
    super(props)
    init({ ...props })
  }

  render() {
    const { children } = this.props
    return children
  }
}

export default WebTracing
