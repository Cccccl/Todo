module.exports = (isDev) => {
  return {
    // 阻止元素间生成空白内容
    preserveWhitepace: true,
    // 使用 transformToRequire 再也不用把图片写成变量
    transformToRequire: {
    },
    // 提取 CSS 到单个文件
    extractCSS: !isDev
  }
}
