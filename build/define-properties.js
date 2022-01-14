const { resolve } = require('path');
const fs = require('fs');
const properties = require('properties');
const { version } = require('../package.json');

// 读取 env.properties 配置文件
const propsString = fs.readFileSync(resolve(__dirname, '../env.properties'),  'utf-8');
const props = properties.parse(propsString);

module.exports = {
  'process.env.SDK_VERSION': JSON.stringify(version),
  'process.env.LIBRARY_NAME': JSON.stringify(props.LIBRARY_NAME),
};
