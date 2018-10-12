const autoprefixer = require('autoprefixer')
const px2rem = require('postcss-px2rem')

module.exports = {
    plugins: [
        autoprefixer(),
        px2rem({
          remUnit: 20
          // remPrecision: 8
        })
    ]
}
