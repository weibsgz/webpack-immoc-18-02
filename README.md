全局安装 npm install webpack -g

直接打包一个文件 webpack app.js bundle.js

1.__dirname 表示当前文件所在的目录的绝对路径
2.path.resolve方法用于将相对路径转为绝对路径,可以将多个路径解析为一个规范化的绝对路径
```
path.resolve('/foo/bar', './baz')
// 输出结果为
'/foo/bar/baz'
path.resolve('/foo/bar', '/tmp/file/')
// 输出结果为
'/tmp/file'
```
3.path.join()方法可以连接任意多个路径字符串。要连接的多个路径可做为参数传入。
```
 path: path.join(__dirname, './dist')
//相对于当前文件所在目录的下 根目錄 ？ 的dist文件夹下



var path = require('path');
//合法的字符串连接
path.join('/foo', 'bar', 'baz/asdf', 'quux', '..')
// 连接后
'/foo/bar/baz/asdf'

//不合法的字符串将抛出异常
path.join('foo', {}, 'bar')
// 抛出的异常
TypeError: Arguments to path.join must be strings'


```


4.publicPath 并不会对生成文件的路径造成影响，主要是对你的页面里面引入的资源的路径做对应的补全，常见的就是css文件里面引入的图片, 因为输出目录和开发目录的结构的变化，如果不设置publicPath,就会造成图片路径找不到；
```
/--webpack---/
 output:{
        filename:'js/[name].js',
        path:path.resolve(__dirname,"dist","assets"),
        publicPath:"/assets/"
},
```


使用webpack命令打包 `webpack.config.js`
```
module.exports = {
     entry: {
        app: './app.js',
      },
     output:{
         filename: '[name].[hash:5].js',
    }
}

```





### 安装babel loader
```
npm install babel-loader@8.0.0-beta.0 @babel/core
npm install babel-loader babel-core(最新版)
```

### babel
`npm install @babel/preset-env --save-dev`(如果指定了最新版本)
`npm install babel-preset-env --save-dev`(如果默认安装的babel)
es2015-2017 代表不同年份发布的规范
env 代表包含es2015-2017和最新的规范 （常用）
babel-present-stage 0-3 规范组不同阶段发布的

webpack.config.js中配置 

```
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
      }

```


### babel polyfill
Babel默认只转换新的JavaScript句法（syntax），而不转换新的API，比如Iterator、Generator、Set、Maps、Proxy、Reflect、Symbol、Promise等全局对象，以及一些定义在全局对象上的方法（比如Object.assign）都不会转码。 但是这样会造成全局空间污染。

举例来说，ES6在Array对象上新增了Array.from方法。Babel就不会转码这个方法。如果想让这个方法运行，必须使用babel-polyfill，为当前环境提供一个垫片
```
npm install babel-polyfill --save
```

使用 `import 'babel-polyfill'`


### babel-runtime：

不会污染全局对象和内置的对象原型。比如当前运行环境不支持promise，可以通过引入babel-runtime/core-js/promise来获取promise，或者通过babel-plugin-transform-runtime自动重写你的promise。
比如你要开发一个框架库比如element，给第三方使用 不污染全局变量，就应该用babel-runtime 

```
npm install babel-plugin-transform-runtime --save-dev
npm install babel-runtime -save
```

使用 .babelrc文件
```
{
    "plugins":["transform-runtime"]
}
```

### CommonsChunkPlugin 公共模块提取打包
配置  name: 一个字符串或者数组  代表指定的chunk名
filename:打包出来的名字 占位符 作用同output
minChunks: number|Infinity|function(module, count) -> boolean,
如果是数字 代表出现number次就要被提取

`npm install webpack --save-dev`在本地安装webpack 需要引用


### treeShaking
作用是去掉没有用到的代码 借助插件 UglifyJsPlugin

```
var webpack = require('webpack') //需要先本地安装
    
    plugins:[
        new webpack.optimize.UglifyJsPlugin()
    ]

```


### css
 style-loader 在页面中生成css
 css-loader  使JS文件可以导入css模块
npm install style-loader css-loader  --save-dev
```
module.exports = {

  module: {
    rules: [
      { 
        test: /\.css$/, 
        use: [
          {
            loader:'style-loader'
          },
          {
            loader:'css-loader'
          },
          {
            loader:'postcss-loader'
            options:{
              ident: 'postcss',
              plugins:[
                require('postcss-sprites')({
                     spritePath:'dist/assets/imgs/sprites'，
                     //凡是图片以 name@2x.png 命名代表retina图片 
                     retina:true
                  }),
                require('autoprefixer')(),
              ]
            }
          }
        ] 
      }
    ]
  }
};

```


### 处理图片
file-loader CSS可以引入图片

npm install file-loader url-loader img-loader --save-dev
```
rules: [
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              //自定义输出地址，否则打包后直接到根目录下了
              outputPath:'dist/',
              //如果你SRC目录下为assets下，加上下边这句，打包到DIST下也能在assets下否则都放到打包后的dist下了
              useRelativePath:true，
              //如果index.html里插入图片 他在根目录 要设置下相对地址为空
              publicPath:''
            }
          }
        ]
      }
    ]

```


url-loader 处理图片转成base64 url-loader 也可以当file-loader ，多了一个处理base64的功能，也就是不用file-loader 直接用url-loader也可以，
img-loader 压缩图片，post-css可以处理前缀 雪碧图
```
rules: [
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              //打包后的图片名称
              name:'[name].min.[ext]',
              limit: 8192
            }
          },
          {
            loader:'img-loader',
            options:{
              pngquant:{
                //图片质量，如果图片太小不会压缩 设置质量可以压缩
                quality:80
              }
            }
          }
        ]
      }
    ]

```


### 字体文件处理

使用url-loader

```
    {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use:[
          loader: 'url-loader',
          options: {
            limit: 10000,
            //自定义输出地址，否则打包后直接到根目录下了
            outputPath:'dist/',
            //如果你SRC目录下为assets下，加上下边这句，打包到DIST下也能在assets下否则都放到打包后的dist下了
            useRelativePath:true，
            //如果index.html里插入图片 他在根目录 要设置下相对地址为空
            publicPath:''
          }
        ]
      }

```

### 第三方JS库 
以JQ举例 自动加载模块，而不必到处 import 或 require 。
1.如果以CDN形式引入 无需配置webpack

2.本地安装
`npm install jquery --save-dev`

```

plugins:[
  new webpack.ProvidePlugin({
    $: 'jquery',
    jQuery: 'jquery'
  })
]

```


3.在本地文件夹下
```
module.exports = {
  resolve:{
    //结尾加$代表确切的匹配jquery 到文件下 不是特别明白
    jquery$:path.resovle(__dirname,'src/libs/jquery.min.js')
  }，
  plugins:[
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    })
  ]
}



```


4.也可以使用imports-loader  引入第三方插件
`npm install imports-loader --save`
```
  rules:[
    {
      test:path.resolve(__dirname,'src/app.js'),
      use:[
        {
          loader:'imports-loader',
          options:{
            $:'jquery'
          }
        }
      ]
    }
  ]

```


### 处理HTML

HtmlWebpackPlugin
`npm install --save-dev html-webpack-plugin`

```
var HtmlWebpackPlugin = require('html-webpack-plugin');

 plugins: [
  new HtmlWebpackPlugin({
    //文件名默认index.html 
    filename:'html/index.html',

    //假如根目录下有index.html 根据此模板生成
    template:'./index.html'

    //是否把output的 js文件插入到模板中，默认true
    inject:false,

    minify:{
      //压缩空格
      collapseWhitespace:true
    }
  })
 
 ]

```


html-loader 打包html中的图片
`npm i -D html-loader`

```
rules:[
  {
    test: /\.(html)$/,
    use: {
      loader: 'html-loader',
      options: {
        attrs: ['img:src','img:data-src']
      }
    }
  }
]

```

或者直接用require的方式

`<img src="${require('./assets/img/xx.png')}" />`


### webpack-dev-server

`npm install webpack-dev-server --save-dev`

```
module.exports = {
   devServer: {
    port:9000,
    //inline默认是true,如果改为false 为在浏览器顶部显示一个打包进度条
    inline:true, 
    //true的话 任何沒有真實地址都会重定向到index.html
    historyApiFallback: true   
    //或者传入一个rewrites对象 from 输入的地址  to 导向的地址
    historyApiFallback: {
      //匹配比如  localhost:9000/src/xx  到  localhost:9000/src/xx.html
      rewrites: [
        {
          // ^\/    表示‘/’开头
          // [a-zA-Z0-9]+  表示多个字母或数字的一串地址
          // \/?   表示有可能后边还一个 / 也可能没有
          from:/^\/([a-zA-Z0-9]+\/?)([a-zA-z0-9])+/,
          to:function(context){
             return '/' + context.match[1]+context.match[2]+'.html'
          }
        }
      ]
    },

    proxy:{
       "/api": {
          //目标
          target:'https://m.weibo.com',
          //一些虚拟站点必须要设置
          changeOrigin:true,
          //设置请求头
          headers: {
            port:9000,
          }
       }
    }
  }
}
```



### 模塊熱更新
```
module.exports = {
   devServer: {
      hot:true
   },
   plugins:[
    new webpack.HotModuleReplacementPlugin(),
    //查看路徑 
    new webpack.NamedModulesPlugin()
   ]
 }

```
