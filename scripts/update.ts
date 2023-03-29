import { updatePackageJSON, updateImport } from './utils'

const needUpdateImportPackage = [
  {
    name: 'types',
    dir: 'packages/types'
  },
  {
    name: 'utils',
    dir: 'packages/utils'
  }
]

async function run() {
  await Promise.all([
    updateImport(needUpdateImportPackage),
    updatePackageJSON()
  ])
}

run()
