const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    mode: isProduction ? 'production' : 'development',
    devtool: false, // 不生成 source map 文件
    
    entry: {
      // Core
      'content-script': './src/core/content-script.js',
      'config': './src/core/config.js',
      'main-logic': './src/core/main-logic.js',
      
      // Utils
      'utils': './src/utils/utils.js',
      'storage': './src/utils/storage.js',
      'data-processor': './src/utils/data-processor.js',
      
      // Services
      'mock-loader': './src/services/mock-loader.js',
      
      // Handlers
      'interceptor': './src/handlers/interceptor.js',
      'response-handlers': './src/handlers/response-handlers.js',
      'dom-handler': './src/handlers/dom-handler.js'
    },

    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'js/[name].js',
      clean: true
    },

    optimization: {
      minimize: isProduction,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: false, // 保留 console，因为插件需要调试
              drop_debugger: true,
              pure_funcs: isProduction ? ['console.log'] : [] // 生产环境移除 console.log
            },
            mangle: {
              // 混淆变量名
              toplevel: true,
              safari10: true
            },
            format: {
              comments: false // 移除注释
            }
          },
          extractComments: false
        })
      ]
    },

    plugins: [
      new CleanWebpackPlugin(),
      
      new CopyWebpackPlugin({
        patterns: [
          // 复制 manifest.json
          {
            from: 'manifest.json',
            to: 'manifest.json',
            transform(content) {
              // 更新 manifest 中的脚本路径
              const manifest = JSON.parse(content.toString());
              
              // 更新 content_scripts 路径
              if (manifest.content_scripts) {
                manifest.content_scripts = manifest.content_scripts.map(script => ({
                  ...script,
                  js: script.js.map(file => {
                    if (file.startsWith('src/')) {
                      // 提取文件名（去掉目录结构）
                      const fileName = file.split('/').pop();
                      return 'js/' + fileName;
                    }
                    return file;
                  })
                }));
              }
              
              // 更新 web_accessible_resources 路径
              if (manifest.web_accessible_resources) {
                manifest.web_accessible_resources = manifest.web_accessible_resources.map(resource => ({
                  ...resource,
                  resources: resource.resources.map(res => {
                    if (res === 'src/*.js') {
                      return 'js/*.js';
                    }
                    return res;
                  })
                }));
              }
              
              return JSON.stringify(manifest, null, 2);
            }
          },
          
          // 复制图标
          {
            from: 'icons',
            to: 'icons'
          },
          
          // 复制数据文件
          {
            from: 'data',
            to: 'data'
          },
          
          // 复制第三方库
          {
            from: 'lib',
            to: 'lib'
          }
        ]
      })
    ],

    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', {
                  targets: {
                    chrome: '88' // Chrome 扩展最低版本
                  }
                }]
              ]
            }
          }
        }
      ]
    },

    resolve: {
      extensions: ['.js'],
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    }
  };
};
