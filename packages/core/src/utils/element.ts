/**
 * 判断元素是否含有目标属性
 */
export function getElByAttr(list: Element[], key: string): Element | undefined {
  return list.find(item => item.hasAttribute && item.hasAttribute(key))
}

/**
 * 是否为简单的标签
 * 简单标签数组：['em', 'b', 'strong', 'span', 'img', 'i', 'code']
 */
export function isSimpleEl(children: Element[]): boolean {
  if (children.length > 0) {
    const arr = ['em', 'b', 'strong', 'span', 'img', 'i', 'code']
    const a = children.filter(
      ({ tagName }) => arr.indexOf(tagName.toLowerCase()) >= 0
    )
    return a.length === children.length
  }
  return true
}

/**
 * 获取元素的关系字符串(从子级一直递归到最外层)
 * 例如两层div的关系会得到字符串: div>div
 */
export function getNodeXPath(node: Element, curPath = ''): string {
  if (!node) return curPath
  const parent = node.parentElement
  const { id } = node
  const tagName = node.tagName.toLowerCase()
  const path = curPath ? `>${curPath}` : ''

  if (
    !parent ||
    parent === document.documentElement ||
    parent === document.body
  ) {
    return `${tagName}${path}`
  }

  if (id) {
    return `#${id}${path}` // 知道了id 就不需要获取上下级关系了(id是唯一的)
  }

  return getNodeXPath(parent, `${tagName}${path}`)
}
