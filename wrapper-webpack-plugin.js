'use strict';

const ConcatSource = require('webpack-core/lib/ConcatSource');

/**
 * @param args
 * @param {string|function} [args.header]
 * @param {string|function} [args.footer]
 * @constructor
 */
function WrapperPlugin(args) {
  if (typeof args !== 'object') {
    throw new TypeError('Argument "args" must be an object.');
  }

  this.header = args.hasOwnProperty('header') ? args.header : '';
  this.footer = args.hasOwnProperty('footer') ? args.footer : '';
}

function apply(compiler) {
  const header = this.header;
  const footer = this.footer;

  compiler.plugin('compilation', function (compilation) {
    compilation.plugin('optimize-chunk-assets', function (chunks, done) {
      wrapChunks(compilation, chunks, footer, header);
      done();
    })
  });

  function wrapFile(compilation, fileName) {
    const headerContent = (typeof header === 'function') ? header(fileName) : header;
    const footerContent = (typeof footer === 'function') ? footer(fileName) : footer;

    compilation.assets[fileName] = new ConcatSource(
        String(headerContent),
        compilation.assets[fileName],
        String(footerContent));
  }

  function wrapChunks(compilation, chunks) {
    chunks.forEach(function (chunk) {
      chunk.files.forEach(function (fileName) {
        wrapFile(compilation, fileName);
      });
    });
  }
}

Object.defineProperty(WrapperPlugin.prototype, 'apply', {
  value: apply,
  enumerable: false
});

module.exports = WrapperPlugin;
