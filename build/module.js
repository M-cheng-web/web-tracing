const { resolve, parse: parsePath, relative } = require('path');
const { transformFileSync } = require('@babel/core');
const fs = require('fs-extra');

const source = resolve(__dirname, '../src');
const dist = resolve(__dirname, '../lib');

function compileRecursive(dir) {
  const stat = fs.statSync(dir);
  if (stat.isDirectory()) {
    const files = fs.readdirSync(dir);
    const transformedFiles = files.map((name) => compileRecursive(resolve(dir, name)));
    return { dir, children: transformedFiles };
  }

  const { ext } = parsePath(dir);
  if (ext === '.js') {
    return transformFileSync(dir, {
      filename: dir,
      root: resolve(__dirname, '../'),
    });
  }
  return undefined;
}

function dest(result) {
  if (result.children) {
    result.children.forEach((transformed) => { dest(transformed) });
    return;
  }
  const relativePath = relative(source, result.options.filename); // 给定路径到另一个路径的相对路径

  // 拿到 src与src目录下各个js文件的相对路径后, 再这个相对路径与lib目录的绝对路径
  const targetPath = resolve(dist, relativePath);
  fs.outputFileSync(targetPath, result.code); // 最后再根据这个绝对路径创建这个文件
}

function build() {
  dest(compileRecursive(source));
}

build();
