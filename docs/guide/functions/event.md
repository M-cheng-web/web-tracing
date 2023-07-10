# event
## 页面卸载事件
页面卸载时会触发`beforeunload`事件,并由此采集发送页面卸载信息给后台

| 属性名称      | 值                                              | 说明         |
| ------------- | ----------------------------------------------- | ------------ |
| eventId       | 根据时间戳计算得来的字符 (每次卸载事件都不相同) | 事件ID       |
| eventType     | dwell                                           | 事件类型     |
| url           |                                                 | 当前页面URL  |
| referer       |                                                 | 上级页面URL  |
| entryTime     |                                                 | 加载完成时间 |
| triggerTime   |                                                 | 卸载时间     |
| millisecond   |                                                 | 页面停留时间 |
| operateAction | navigate / reload / back_forward / reserved     | 页面加载来源 |

## 点击事件
插件监听页面`click`事件,然后根据一系列规则判断是否采集事件以及获取该事件所需要的参数

| 属性名称    | 值                                                                          | 说明                     |
| ----------- | --------------------------------------------------------------------------- | ------------------------ |
| eventId     | 详见下面的采集规则                                                          | 事件ID                   |
| eventType   | click                                                                       | 事件类型                 |
| title       | 详见下面的采集规则                                                          | 事件名                   |
| params      | 详见下面的采集规则                                                          | 事件参数                 |
| url         |                                                                             | 当前页面URL              |
| sendTime    |                                                                             | 发送时间                 |
| triggerTime |                                                                             | 事件发生时间             |
| elementPath | 例如: div>div>button                                                        | 被点击元素的层级         |
| type        |                                                                             | 大类type,参考`数据结构`  |
| x           | e.target.getBoundingClientRect().left + document.documentElement.scrollLeft | 被点击元素与屏幕左边距离 |
| y           | e.target.getBoundingClientRect().top + document.documentElement.scrollTop   | 被点击元素与屏幕上边距离 |

### eventId采集规则
取值优先级:
1. 从触发的元素向上找其父级元素(直到body之下)的属性,用最先找到的`data-warden-event-id`属性的值
2. 与上同理,用最先找到的`title`属性的值
3. 与上同理,找到带有`data-warden-container`属性的元素
   1. 找到的话
   2. 用这个元素属性的`data-warden-event-id`值
   3. 用这个元素属性的`title`值
   4. 都没有的话就用这个元素属性的`data-warden-container`值
   5. 还是没有的话就用触发元素的`tagName`
4. 用触发元素的`tagName`

### title采集规则
![埋点事件采集获取title字段流程图](https://gitee.com/M-cheng-web/map-storage/raw/master/design-img/%E5%9F%8B%E7%82%B9%E4%BA%8B%E4%BB%B6%E9%87%87%E9%9B%86%E8%8E%B7%E5%8F%96title%E5%AD%97%E6%AE%B5%E6%B5%81%E7%A8%8B%E5%9B%BE.png)

### params采集规则
1. 遍历被点击元素是否带有名称为`data-warden-`开头的属性
   1. 如果有,那么取本身属性除`data-warden-container data-warden-title data-warden-event-id`之外的以`data-warden-`开头的属性,例如 data-warden-name="a" 会被收集为 params: { name: 'a' }
2. 被点击元素没有名称为`data-warden-`开头的属性则向上遍历其父级有没有符合这样的规则,直至body标签以下
3. 如果其中一个父级符合名称为`data-warden-`开头的属性,则以这个父级元素为标准,取其属性除`data-warden-container data-warden-title data-warden-event-id`之外的以`data-warden-`开头的属性,没有的话会返回 {}
4. 如果都没有则会返回 {}

ps:
``` html
<!-- 例如这样的结构在点击button会得到 params: { num: '我是NUM' } -->
<div data-warden-num="我是NUM">
  <button value="xxxxxx" ref="bun">1111</button>
</div>

<!-- 如果不太熟悉规则,建议直接这样附加参数,这里点击button会得到 params: { par: '我是参数' } -->
<div data-warden-num="我是NUM">
  <button data-warden-par="我是参数" value="xxxxxx" ref="bun">1111</button>
</div>
```

> 这一块规则以后可能优化,同学们使用的话建议不要使用这套规则,直接像例子里在元素上加params就行

### DOM元素标记
:rocket::rocket:插件会根据`DOM元素`上一些属性来获取需要采集该元素的事件,以及采集该元素事件时应该传递哪些参数

| 属性名称              | 说明                                                                                |
| --------------------- | ----------------------------------------------------------------------------------- |
| data-warden-container | 该元素作为采集容器,内部的需要采集的元素上如果没有这些属性会使用容器上的属性作为填充 |
| data-warden-event-id  | 元素上标记事件的eventId,会作为传给后台的eventId                                     |
| data-warden-title     | 元素上标记事件的title,**也可以使用原生的title属性**,都会作为传给后台的title         |
| data-warden-*         | 其他的属性都会被当作参数,例如 data-warden-name="a" 会被收集为{ name: 'a' }          |

#### data-warden-container
元素拥有data-warden-container则视作是容器元素,内部元素触发的事件时,**如果触发事件的元素上没有埋点属性修饰那就认为这个事件是由容器节点触发的,容器节点取代触发事件的子元素节点作为target**,标题从容器上获取,内容依旧从真实触发事件的子元素上获取
``` html
<!-- 容器元素,内部的元素如果本身没有标记,父级有data-warden-container属性,则视作是由容器元素触发的事件 -->
<!-- 点击超链接或是图片时,按触发元素是父级div元素来处理 -->
<div data-warden-container data-warden-event-id="点击课程">
  <img src="" alt="" onClick="() => location.href = url" />
  <a href={url}>课程1</a>      
</div>
```

## 传给后台格式示例
### 示例一
``` html
<div
  class="box-div"
  data-warden-title="xxx"
  data-warden-bigTitle="bigTitle"
  width="100%">
  示例div
</div>
```

点击示例div  =>

``` js
{
  eventInfo: [
    {
      elementPath: "div"
      eventId: "div"
      eventType: "click"
      params: { bigtitle: "bigTitle" }
      sendTime: 1641969431146
      title: "xxx"
      triggerTime: 1641969430144
      type: "mix"
      url: "http://localhost:8083/event.html"
      x: 8
      y: 8
    }
  ]
}
```

### 示例二
``` html
<div
  style="border: 1px solid red"
  data-warden-test="test"
  data-warden-title="titletitle"
  data-warden-bing="bing"
  data-warden-event-id="ddd">
  <div class="asd">示例div</div>
</div>
```

点击示例div  =>

``` js
{
  eventInfo: [
    {
      elementPath: "div>div"
      eventId: "ddd"
      eventType: "click"
      params: { test: "test", bing: "bing" }
      sendTime: 1641970260634
      title: "titletitle"
      triggerTime: 1641970259633
      type: "mix"
      url: "http://localhost:8083/event.html"
      x: 20
      y: 20
    }
  ]
}
```