import sourceMap from "source-map-js";

// 找到以.js结尾的fileName
// function matchStr(str: string) {
//   if (str.endsWith('.js')) return str.substring(str.lastIndexOf('/') + 1)
// }

// 将所有的空格转化为实体字符
function repalceAll(str: string) {
  return str.replace(new RegExp(" ", "gm"), "&nbsp;");
}

// 获取文件路径
function getFileLink(str: string) {
  const reg = /vue-loader-options!\.(.*)\?/;
  const res = str.match(reg);
  console.log(res, "getFileLink");
  if (res && Array.isArray(res)) {
    return res[1];
  }
}

function loadSourceMap(fileName: string): Promise<any> | string {
  const env: string = import.meta.env.MODE;
  const file = fileName;

  // if (env == 'development') {
  //   file = getFileLink(fileName)
  // } else {
  //   file = matchStr(fileName)
  // }

  console.log("file", file);
  if (!file) return "";
  return new Promise((resolve) => {
    fetch(
      `http://localhost:3352/getSourceMap?fileName=${file}&env=${env}`
    ).then((response) => {
      console.log("response", response);
      if (env == "development") {
        resolve(response.text());
      } else {
        resolve(response.json());
      }
    });
  });
}

interface mapOptions {
  fileName: string;
  line: number;
  column: number;
}
export const findCodeBySourceMap = async (
  { fileName, line, column }: mapOptions,
  callback: any
) => {
  const sourceData = await loadSourceMap(fileName);
  if (!sourceData) return;
  let result, codeList;
  if (import.meta.env.MODE == "development") {
    const source = getFileLink(fileName);
    let isStart = false;
    result = {
      source,
      line: line + 1, // 具体的报错行数
      column, // 具体的报错列数
      name: null,
    };
    codeList = (sourceData as string).split("\n").filter((item) => {
      if (item.indexOf("<script") != -1 || isStart) {
        isStart = true;
        return item;
      } else if (item.indexOf("</script") != -1) {
        isStart = false;
      }
    });
  } else {
    const { sourcesContent, sources } = sourceData;
    const consumer = await new sourceMap.SourceMapConsumer(sourceData);
    result = consumer.originalPositionFor({
      line: Number(line),
      column: Number(column),
    });
    /**
     * result结果
     * {
     *   "source": "webpack://myapp/src/views/HomeView.vue",
     *   "line": 24,  // 具体的报错行数
     *   "column": 0, // 具体的报错列数
     *   "name": null
     * }
     * */
    if (result.source && result.source.includes("node_modules")) {
      // 路径带 node_modules 的三方报错解析不了，因为项目引入的是打包后的文件，缺少三方的map文件
      // 比如echart报错 webpack://web-see/node_modules/.pnpm/echarts@5.4.1/node_modules/echarts/lib/util/model.js
      return `源码解析失败: 因为报错来自三方依赖，报错文件为 ${result.source}`;
    }

    let index = sources.indexOf(result.source);

    // 未找到，将sources路径格式化后重新匹配 /./ 替换成 / 否则解析失败
    // 测试中发现会有路径中带/./的情况，如 webpack://web-see/./src/main.js
    if (index === -1) {
      const copySources = JSON.parse(JSON.stringify(sources)).map((item: any) =>
        item.replace(/\/.\//g, "/")
      );
      index = copySources.indexOf(result.source);
    }
    console.log("index", index);
    if (index === -1) {
      return "源码解析失败";
    }
    const code = sourcesContent[index];
    codeList = code.split("\n");
  }

  const row = result.line;
  const len = codeList.length - 1;
  const start = row - 5 >= 0 ? row - 5 : 0; // 将报错代码显示在中间位置
  const end = start + 9 >= len ? len : start + 9; // 最多展示10行
  const newLines = [];
  let j = 0;
  for (let i = start; i <= end; i++) {
    j++;
    newLines.push(
      `<div class="code-line ${i + 1 == row ? "heightlight" : ""}" title="${
        i + 1 == row ? result.source : ""
      }">${j}. ${repalceAll(codeList[i])}</div>`
    );
  }

  const innerHTML = `<div class="errdetail"><div class="errheader">${
    result.source
  } at line ${result.column}:${row}</div><div class="errdetail">${newLines.join(
    ""
  )}</div></div>`;

  callback(innerHTML);
};
