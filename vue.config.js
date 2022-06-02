module.exports = {
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.mjs$/,
          include: /node_modules/,
          type: "javascript/auto"
        }
      ] 
    }
  },
  chainWebpack: config => {
    config.module
      .rule('pug')
      .use('pug-plain-loader')
      .loader('pug-plain-loader')
      .options({ data: { require } }); // pass require as a local variable!
  },
}