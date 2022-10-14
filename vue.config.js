module.exports = {
  devServer: {
    disableHostCheck: true,
  },

  transpileDependencies: ['vuetify'],

  lintOnSave: process.env.NODE_ENV !== 'production' ? 'warning' : false,
}
