import { join, resolve } from 'path'
import fs from 'fs-extra'
import fg from 'fast-glob'
import { $fetch } from 'ohmyfetch'
import { packages } from '../meta/packages'

export const DOCS_URL = 'https://fastuse.github.io/morehook'

export const DIR_ROOT = resolve(__dirname, '..')
export const DIR_SRC = resolve(__dirname, '../packages')
export const GUID_CATE_SRC = resolve(__dirname, '../packages/guide')
const DIR_TYPES = resolve(__dirname, '../types/packages')

/**
 * 获取 ts 声明
 * @param pkg 包类别
 * @param name 包名
 * @returns
 */
export async function getTypeDefinition(
  pkg: string,
  name: string
): Promise<string | undefined> {
  const typingFilepath = join(DIR_TYPES, `${pkg}/${name}/index.d.ts`)

  if (!fs.existsSync(typingFilepath)) return

  let types = await fs.readFile(typingFilepath, 'utf-8')

  if (!types) return

  // clean up types
  types = types
    .replace(/import\(.*?\)\./g, '')
    .replace(/import[\s\S]+?from ?["'][\s\S]+?["']/g, '')
    .replace(/export {}/g, '')

  const prettier = await import('prettier')
  return prettier
    .format(types, {
      semi: false,
      parser: 'typescript'
    })
    .trim()
}

export function uniq<T extends any[]>(a: T) {
  return Array.from(new Set(a))
}

export function replacer(
  code: string,
  value: string,
  key: string,
  insert: 'head' | 'tail' | 'none' = 'none'
) {
  const START = `<!--${key}_STARTS-->`
  const END = `<!--${key}_ENDS-->`
  const regex = new RegExp(`${START}[\\s\\S]*?${END}`, 'im')

  const target = value ? `${START}\n${value}\n${END}` : `${START}${END}`

  if (!code.match(regex)) {
    if (insert === 'none') return code
    else if (insert === 'head') return `${target}\n\n${code}`
    else return `${code}\n\n${target}`
  }

  return code.replace(regex, target)
}

export async function updateCountBadge(indexes: any) {
  const functionsCount = indexes.functions.filter(i => !i.internal).length
  const url = `https://img.shields.io/badge/-${functionsCount}%20functions-13708a`
  const data = await $fetch(url, { responseType: 'text' })
  await fs.writeFile(
    join(DIR_ROOT, 'packages/public/badge-function-count.svg'),
    data,
    'utf-8'
  )
}

/**
 * 填充 目标子包下的 index.ts 文件的导入导出
 */
export async function updateImport(packages) {
  for (const { dir } of Object.values(packages) as any) {
    const files = await fg('*', {
      // onlyDirectories: true, // 只获取目录
      cwd: `${dir}/src`,
      ignore: ['_*', 'dist', 'node_modules']
    })

    const imports: string[] = files
      .sort()
      .map(name => name.split('.')[0])
      .map(name => `export * from './src/${name}'`)

    await fs.writeFile(join(dir, 'index.ts'), `${imports.join('\n')}\n`)

    // await fs.remove(join(dir, 'index.mjs'))
  }
}

/**
 * 更改每个子包的 packages
 */
export async function updatePackageJSON() {
  const { version } = await fs.readJSON('package.json')

  for (const {
    name,
    description,
    author,
    iife,
    keywords,
    moduleJs
  } of packages) {
    const packageDir = join(DIR_SRC, name)
    const packageJSONPath = join(packageDir, 'package.json')
    const packageJSON = await fs.readJSON(packageJSONPath)

    packageJSON.version = version
    packageJSON.description = description || packageJSON.description
    packageJSON.author =
      author || 'M-cheng-web <https://github.com/M-cheng-web>'
    packageJSON.bugs = {
      url: 'https://github.com/FastUse/morehook/issues'
    }
    packageJSON.homepage = 'https://github.com/FastUse/morehook#readme'
    packageJSON.repository = {
      type: 'git',
      url: 'git+https://github.com/FastUse/morehook.git',
      directory: `packages/${name}`
    }
    packageJSON.types = './dist/index.d.ts'
    packageJSON.main = moduleJs ? './dist/index.mjs' : './dist/index.cjs'
    packageJSON.module = './dist/index.mjs'
    if (iife !== false) {
      packageJSON.unpkg = './dist/index.iife.min.js'
      packageJSON.jsdelivr = './dist/index.iife.min.js'
    }
    packageJSON.exports = {
      ...packageJSON.exports,
      '.': {
        import: './dist/index.mjs',
        require: './dist/index.cjs',
        types: './dist/index.d.ts'
      },
      './*': './*'
    }
    if (keywords) {
      packageJSON.keywords = [...keywords]
    }

    await fs.writeJSON(packageJSONPath, packageJSON, { spaces: 2 })
  }
}

export function isValidKey(
  key: string | number | symbol,
  object: object
): key is keyof typeof object {
  return key in object
}
