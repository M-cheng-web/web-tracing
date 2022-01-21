import { uglify } from 'rollup-plugin-uglify';
import coreConfig from './rollup.config'

coreConfig.output.forEach((item) => {
  item.sourcemap = false;
})

coreConfig.plugins = [
  ...coreConfig.plugins,
  uglify(),
]

export default coreConfig;