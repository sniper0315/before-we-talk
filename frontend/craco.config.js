const path = require('path')
const fs = require('fs-extra')

module.exports = {
  reactScriptsVersion: 'react-scripts',
  style: {
    sass: {
      loaderOptions: {
        sassOptions: {
          includePaths: ['node_modules', 'src/assets']
        }
      }
    },
    postcss: {
      plugins: [require('postcss-rtl')()]
    }
  },
  devServer: {
    https: {
      key: fs.readFileSync('/cert/server.key'),
      cert: fs.readFileSync('/cert/server.crt'),
      ca: fs.readFileSync('/cert/server.pem')
    }
  },
  webpack: {
    alias: {
      '@src': path.resolve(__dirname, 'src'),
      '@assets': path.resolve(__dirname, 'src/@core/assets'),
      '@components': path.resolve(__dirname, 'src/@core/components'),
      '@layouts': path.resolve(__dirname, 'src/@core/layouts'),
      '@store': path.resolve(__dirname, 'src/redux'),
      '@styles': path.resolve(__dirname, 'src/@core/scss'),
      '@configs': path.resolve(__dirname, 'src/configs'),
      '@utils': path.resolve(__dirname, 'src/utility/Utils'),
      '@hooks': path.resolve(__dirname, 'src/utility/hooks')
    }
  },
  babel: {
    "presets": ["@babel/preset-env", ["@babel/preset-react", {"runtime": "automatic"}]],
    plugins: [
      ["@babel/plugin-proposal-decorators", {"legacy": true}],
      "@babel/plugin-transform-flow-strip-types",
      "@babel/plugin-proposal-nullish-coalescing-operator",
    ],
    loaderOptions: (babelLoaderOptions, { env, paths }) => { return babelLoaderOptions; }
  }
}
