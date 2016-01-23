A plugin that allows wrapping webpack output (chunks) with custom text.
============

Installation
------------

Install locally using npm:
`npm install wrapper-webpack-plugin --save-dev`

Using webpack plugins
------------

https://webpack.github.io/docs/using-plugins.html

Usage
------------

`var WebpackWrapperPlugin = require('wrapper-webpack-plugin');`

The `WebpackWrapperPlugin` class has a single parameter, an object with a `header` and/or `footer` properties. These can
be either a string or a function. A string will simply be a appended/prepended to the file output. A function is
expected to return a string, and will receive the name of the output file as an argument.

Example `webpack.config` #1
------------

Wraps bundle in a self invoking function and enables strict mode:

```javascript
var WebpackWrapperPlugin = require('wrapper-webpack-plugin');

module.exports = {
  // other webpack config here
  
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

Prepends bundle with a doc comment:

```javascript
plugins: [
  new WrapperPlugin({
    header: function (fileName) {
      return '/*! file: ' + fileName + ', created by dev123 */\n';
    }
  })
]
```


