#!/usr/bin/env sh

set -e

# 进入生成的文件夹
cd examples-copy/react

git init
git add -A
git commit -m 'deploy'

git push -f git@github.com:M-cheng-web/web-tracing-examples-react.git main

cd -
