module.exports = {
  plugins: {
    'postcss-pxtorem': {
      rootValue: 37.5,
      // 公式 适配的标准屏 / 10，比如750的屏幕，rootValue: 75,
      // 375px/37.5=10
      // （除了标准屏，其他所有屏幕等比例缩放）
      propList: ['*']
    }
  }
}
