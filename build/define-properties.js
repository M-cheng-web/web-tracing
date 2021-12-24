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
  'process.env.TEST_REPORT_URL': JSON.stringify(props.TEST_REPORT_URL),
  'process.env.PROD_REPORT_URL': JSON.stringify(props.PROD_REPORT_URL),
  'process.env.REPORT_URL': process.env.BUILD_ENV === 'test' ? JSON.stringify(props.TEST_REPORT_URL) : JSON.stringify(props.PROD_REPORT_URL),
};
