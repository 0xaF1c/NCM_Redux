const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/api': {
        target: 'https://netease-cloud-music-redux-api.vercel.app/',
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
