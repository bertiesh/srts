const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    https: true,
    port: 8090,
    proxy: {
      '/api': {
        target: 'https://10.32.20.50:8898',
            changeOrigin: true,
            pathRewrite: {
                '^/api': ''
            }
      },
    }
  },
})
