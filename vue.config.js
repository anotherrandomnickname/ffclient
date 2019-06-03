const path = require('path')
module.exports = {
  pluginOptions: {
    'style-resources-loader': {
      patterns: [path.resolve(__dirname, 'src/styles/sass/*.sass')],
      preProcessor: 'sass',
    },
  },
  devServer: {
    port: '8080',
  },
}

// 'C:\\Users\\darky\\AppData\\Local\\Julia-1.0.2\\bin\\fairy\\client\\src\\sass\\*.sass'
