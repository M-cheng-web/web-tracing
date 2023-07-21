#!/usr/bin/env sh

set -e

# 进入生成的文件夹
cd examples-copy/vanilla

git init
git add -A
git commit -m 'deploy'

git push -f https://github.com/M-cheng-web/web-tracing-examples-js main

cd -