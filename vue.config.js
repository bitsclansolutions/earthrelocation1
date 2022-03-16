module.exports = {
  devServer: {
    disableHostCheck: true,
    
    proxy: 'https://www.earthrelocation.com',
   
  },
  chainWebpack: config => {
    config.module.rules.delete('eslint')
},
  // publicPath: '/wp/wm-form/',
  // assetsDir: './',

  transpileDependencies: ['vuetify'],

  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: false,
    },
  },
}

