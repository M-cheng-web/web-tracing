import { App } from 'vue'

interface ObjType {
  [propName: string]: object
}
interface filesType extends ObjType {
  default: {
    __name: string
    [key: string]: any
  }
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const files: Record<string, filesType> = import.meta.globEager('./*.vue')

export default (app: App) => {
  Object.keys(files).forEach(path => {
    const name = files[path].default.name
    app.component(name, files[path].default)
  })
}
