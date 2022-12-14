const manifestJSON = require('./public/manifest.json')

module.exports = {
    publicPath: process.env.NODE_ENV === 'production' ? '/catastro/GestionServicios/iso/app_encuestas/' : '/',
    pwa: {
      themeColor: manifestJSON.theme_color,
      name: manifestJSON.short_name,
      msTileColor: manifestJSON.background_color,
      appleMobileWebAppCapable: 'yes',
      appleMobileWebAppStatusBarStyle: 'black',
      workboxPluginMode: 'InjectManifest',
      workboxOptions: {
        swSrc: 'service-worker.js',
      }
    }
  }