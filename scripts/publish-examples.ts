/**
 * 将 examples 下的所有项目移植到 https://github.com/M-cheng-web/web-tracing-examples 项目
 */
import path from 'path'
import fs from 'fs-extra'
import { packages } from '../meta/packages'
import { version } from '../package.json'
import { execSync as exec } from 'child_process'

const rootDir = path.resolve(__dirname, '..')
const examplesDir = path.resolve(rootDir, 'examples')
const newExamplesDir = path.resolve(rootDir, 'examples-copy')

async function copyFolder(source: string, destination: string) {
  try {
    await fs.remove(destination)
    await fs.ensureDir(destination) // 确保目标文件夹存在，不存在则新建

    // 过滤某些文件夹不复制
    const filterRootFile = ['dist', 'node_modules'] // 这里只支持根目录的过滤
    const filterList: string[] = []
    for (const { exampleName } of packages) {
      for (const rootFileName of filterRootFile) {
        filterList.push(`${exampleName}/${rootFileName}`)
      }
    }

    await fs.copy(source, destination, {
      overwrite: true, // 是否覆盖已存在的文件
      filter: (src: string) => {
        return filterList.every(item => !src.includes(item))
      }
    })
  } catch (error) {
    console.error('文件夹复制失败', error)
  }
}

async function changeFile() {
  for (const { exampleName } of packages) {
    const packageJSON = await fs.readJSON(
      path.join(newExamplesDir, exampleName, 'package.json')
    )

    // 当子类包互相引用时，要手动更改其版本（不改的话则是 workspace）
    for (const key of Object.keys(packageJSON.dependencies || {})) {
      if (key.startsWith('@web-tracing/')) {
        packageJSON.dependencies[key] = version
      }
    }

    await fs.writeJSON(
      path.join(newExamplesDir, exampleName, 'package.json'),
      packageJSON,
      {
        spaces: 2
      }
    )
  }
}

async function publish() {
  const cmd = `cd examples-copy && git init && git add -A && git commit -m 'deploy' && git push -f git@github.com:M-cheng-web/web-tracing-examples.git main`
  exec(cmd)
}

async function start() {
  await copyFolder(examplesDir, newExamplesDir)
  await changeFile()
  await publish()
}

start()
