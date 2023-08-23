const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3000',
        changeOrigin: true, 
        secure: false,
        ws: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
})
