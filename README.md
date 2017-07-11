# A webpack plugin that wraps output files (chunks) with custom text or code.

## Installation

Install locally using npm:  
`npm i wrapper-webpack-plugin`

#### Webpack compatibility

Works with *all* current versions of webpack, including 1, 2, and 3.

## Usage

The `WrapperPlugin` class has a single parameter, an object with a `header` and/or `footer` properties. Header text will
be *prepended* to the output file, footer text will be *appended*. These can be either a string or a function. A string
will simply be a appended/prepended to the file output. A function is expected to return a string, and will receive the
name of the output file as an argument.

An optional `test` property (a string or a `RegExp` object) can control which output files are affected; otherwise all output files will be wrapped.

## API

```
function WrapperPlugin({
    test: string | RegExp,
    header: string | function,
    footer: string | function
})
```

## Example configuration #1

Wraps bundle files with '.js' extension in a self invoking function and enables strict mode:

```javascript
var WrapperPlugin = require('wrapper-webpack-plugin');

module.exports = {
  // other webpack config here
  
  plugins: [
    // strict mode for the whole bundle
    new WrapperPlugin({
      test: /\.js$/, // only wrap output of bundle files with '.js' extension 
      header: '(function () { "use strict";\n',
      footer: '\n})();'
    })
  ]
};
```

## Example configuration #2

Prepends bundles with a doc comment:

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

## Example configuration #3

Keeping header in a separate file:

file: `header.js`
```javascript
/*!
 * my awesome app!
 */
```

file: `webpack.config`
```javascript
var fs = require('fs');
var WrapperPlugin = require('wrapper-webpack-plugin');

var headerDoc = fs.readFileSync('./header.js', 'utf8');

module.exports = {
  // other webpack config here

  plugins: [
    new WrapperPlugin({
      header: headerDoc
    })
  ]
};
```

## Example configuration #4

A slightly more complex example using `lodash` templates:

```javascript
var WrapperPlugin = require('wrapper-webpack-plugin');
var template = require('lodash.template');
var pkg = require('./package.json');

var tpl = '/*! <%= name %> v<%= version %> | <%= author %> */\n';

module.exports = {
  // other webpack config here

  plugins: [
    new WrapperPlugin({
      header: template(tpl)(pkg)
    })
  ]
};
```

## Compatibility with other plugins

This plugin should play nicely with most other plugins.
E.g. adding the `webpack.optimize.UglifyJsPlugin` plugin to the plugins array *after* the `WrapperPlugin` will result in
the wrapper text also being minified.

## License

[ISC](https://opensource.org/licenses/ISC)
