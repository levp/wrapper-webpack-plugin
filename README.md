A plugin that allows wrapping webpack output (chunks) with custom text.
============

Example `webpack.config` #1
------------

Wraps output bundle in a self invoking anonymous function and enables strict mode:

```javascript
const WrapperPlugin = require('wrapper-webpack-plugin');

module.exports = {
  entry: './src.js',
  output: {
    filename: 'bundle.js'
  },
  plugins: [
    // strict mode for the whole bundle
    new WrapperPlugin({
      header: '(function () { "use strict";\n',
      footer: '\n})();'
    })
  ]
};
```

Example `webpack.config` #2
------------

Prepends output bundle with a doc comment:

```javascript
const WrapperPlugin = require('wrapper-webpack-plugin');

module.exports = {
  entry: './src.js',
  output: {
    filename: 'bundle.js'
  },
  plugins: [
    new WrapperPlugin({
      header: function (fileName) {
        return '/*! ' + fileName + ', created by dev123 */\n';
      }
    })
  ]
};
```


