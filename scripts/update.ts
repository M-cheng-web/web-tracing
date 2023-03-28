import { updatePackageJSON } from './utils'

async function run() {
  await Promise.all([updatePackageJSON()])
}

run()
