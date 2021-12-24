// before publish
const { resolve } = require('path');
const inquirer = require('inquirer');
const semver = require('semver');
const fs = require('fs-extra');
const chalk = require('chalk');
const conventionalChangelog = require('conventional-changelog');
const packageInfo = require('../package.json');
const packageFile = resolve(__dirname, '../package.json');

// 参考 https://www.jianshu.com/p/0409cdf0e396

function confirmVersion(version) {
  return inquirer.prompt([
    {
      type: 'list',
      name: 'level',
      message: '升级版本号',
      default: 'patch',
      choices: [
        {
          name: '主版本',
          value: 'major',
        },
        {
          name: '次版本',
          value: 'minor',
        },
        {
          name: '补丁版本',
          value: 'patch',
        },
        {
          name: '预览版本',
          value: 'prerelease',
        },
      ],
    },
    {
      type: 'list',
      name: 'tag',
      message: '预览名称',
      default: 'beta',
      choices: [
        'alpha', // 内部版本
        'beta', // 公测版本
        'rc', // 正式版本的候选版本
      ],
      when(answer) {
        return answer.level === 'prerelease';
      },
    },
  ]).then((answer) => semver.inc(version, answer.level, answer.tag));
}

function generateChangeLog() {
  const file = resolve(__dirname, '../CHANGELOG.md');

  // 自行使用stream将新内容追加到CHANGELOG.md中,倒序排列
  return conventionalChangelog({
    preset: 'angular',
    append: true,
  }).pipe(fs.createWriteStream(file));
}

return confirmVersion(packageInfo.version).then((version) => {
  console.log(`当前版本: ${chalk.cyan(packageInfo.version)}`);
  console.log(`发布版本: ${chalk.magenta(version)}`);
  packageInfo.version = version;
  fs.outputJsonSync(packageFile, packageInfo, { spaces: 2 });
}).then(() => generateChangeLog());
