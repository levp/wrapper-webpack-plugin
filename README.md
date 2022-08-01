# A webpack plugin that wraps output files (chunks) with custom text or code.

## Installation

Install locally using npm:  
`npm i -D wrapper-webpack-plugin`

#### Webpack compatibility

Version 2 of this plugin only works with webpack >=4.\
For webpack <4 use [version 1](https://github.com/levp/wrapper-webpack-plugin/tree/v1) of the plugin with `npm i -D wrapper-webpack-plugin@1` 

## Usage

The `WrapperPlugin` class has a single parameter, an object with a `header` and/or `footer` properties. Header text will
be *prepended* to the output file, footer text will be *appended*. These can be either a string or a function. A string
will simply be a appended/prepended to the file output. A function is expected to return a string, and will receive the
name of the output file as an argument.

An optional `test` property (a string or a `RegExp` object) can control which output files are affected; otherwise all output files will be wrapped.

*New in 2.1:*  
The optional `afterOptimizations` property can be used to avoid having the added text affected by the optimization stage, e.g. if you don't want it to be minified. 

## API

```
function WrapperPlugin({
    test: string | RegExp,
    header: string | function,
    footer: string | function,
    afterOptimizations: bool // default: false
})
```

## Example configuration #1

Wraps bundle files with '.js' extension in a self invoking function and enables strict mode:

```javascript
const WrapperPlugin = require('wrapper-webpack-plugin');

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
const WrapperPlugin = require('wrapper-webpack-plugin');

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

Accessing file name, build hash, and chunk hash at runtime.

```javascript
const WrapperPlugin = require('wrapper-webpack-plugin');

module.exports = {
  // other webpack config here
	
  output: {
    filename: '[name].[chunkhash].js'
  },
  plugins: [
    new WrapperPlugin({
      header: `(function (FILE_NAME, BUILD_HASH, CHUNK_HASH) {`,
      footer(fileName, args) {
        return `})('${fileName}', '${args.hash}', '${args.chunkhash}');`;
        // note: args.hash and args.chunkhash correspond to the [hash] and [chunkhash] 
        // placeholders you can specify in the output.filename option.
      }
    })
  ]
};
```

## Example configuration #4

Keeping header in a separate file:

file: `header.js`
```javascript
/*!
 * my awesome app!
 */
```

file: `webpack.config`
```javascript
const fs = require('fs');
 WrapperPlugin = require('wrapper-webpack-plugin');

const headerDoc = fs.readFileSync('./header.js', 'utf8');

module.exports = {
  // other webpack config here

  plugins: [
    new WrapperPlugin({
      header: headerDoc
    })
  ]
};
```

## Example configuration #5

A slightly more complex example using `lodash` templates:

```javascript
const WrapperPlugin = require('wrapper-webpack-plugin');
const template = require('lodash.template');
const pkg = require('./package.json');

const tpl = '/*! <%= name %> v<%= version %> | <%= author %> */\n';

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
