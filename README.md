A plugin that allows wrapping webpack output files (chunks) with custom text or code.
============

Installation
------------

Install locally using npm:  
`npm install --save-dev wrapper-webpack-plugin`

New to webpack plugins?
------------

Read this: https://webpack.github.io/docs/using-plugins.html

Usage
------------

`var WrapperPlugin = require('wrapper-webpack-plugin');`

The `WrapperPlugin` class has a single parameter, an object with a `header` and/or `footer` properties. Header text will
be *prepended* to the output file, footer text will be *appended*. These can be either a string or a function. A string
will simply be a appended/prepended to the file output. A function is expected to return a string, and will receive the
name of the output file as an argument.

Example `webpack.config` #1
------------

Wraps bundles in a self invoking function and enables strict mode:

```javascript
var WrapperPlugin = require('wrapper-webpack-plugin');

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
var WrapperPlugin = require('wrapper-webpack-plugin');

module.exports = {
  // other webpack config here
  
  plugins: [
    new WrapperPlugin({
      header: function (fileName) {
        return '/*! file: ' + fileName + ', created by dev123 */\n';
      }
    })
  ]
};
```

Example `webpack.config` #2
------------

A slightly more complex example using `lodash` templates:

```javascript
var WrapperPlugin = require('wrapper-webpack-plugin');
var template = require('lodash.template');
var pkg = require('./package.json');

var tplParams = {
  appName: 'myapp',
  author: 'dev123',
  version: pkg.version
};

module.exports = {
  // other webpack config here

  plugins: [
    // prepend build date to code
    new WrapperPlugin({
      header: function () {
        return template('/*! <%= appName %> v<%= version %> | <%= author %> */\n')(tplParams);
      }
    })
  ]
};
```
