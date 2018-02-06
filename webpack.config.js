var webpack = require("webpack")

module.exports = {
     entry: {
        app: './app.js',
      },
     output:{
         filename: '[name].[hash:8].js',
    },
    module: {
        rules: [
          { 
            test: /\.js$/, 
            use: {
                loader: 'babel-loader',
                options: {
                  presets: ['@babel/preset-env']
                }
            },
            exclude:'/node_modules/' 
          }
        ]
      },
      plugins: [
          new webpack.optimize.CommonsChunkPlugin({
            name: "common",
            minChunks: 2
      })
}
