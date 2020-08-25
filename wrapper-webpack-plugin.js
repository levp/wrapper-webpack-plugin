'use strict';

const ConcatSource = require("webpack-sources").ConcatSource;
const ModuleFilenameHelpers = require("webpack/lib/ModuleFilenameHelpers");

class WrapperPlugin {

	/**
	 * @param {Object} args
	 * @param {string | Function} [args.header]  Text that will be prepended to an output file.
	 * @param {string | Function} [args.footer] Text that will be appended to an output file.
	 * @param {string | RegExp} [args.test] Tested against output file names to check if they should be affected by this
	 * plugin.
	 * @param {boolean} [args.afterOptimizations=false] Indicating whether this plugin should be activated before
	 * (`false`) or after (`true`) the optimization stage. Example use case: Set this to true if you want to avoid
	 * minification from affecting the text added by this plugin.
	 */
	constructor(args) {
		if (typeof args !== 'object') {
			throw new TypeError('Argument "args" must be an object.');
		}

		this.header = args.hasOwnProperty('header') ? args.header : '';
		this.footer = args.hasOwnProperty('footer') ? args.footer : '';
		this.afterOptimizations = args.hasOwnProperty('afterOptimizations') ? !!args.afterOptimizations : false;
		this.test = args.hasOwnProperty('test') ? args.test : '';
		
		// Webpack has an internal cache based on Source identity that it uses to determine 
		// whether or not to re-emit assets. We use this cache to ensure that we only re-emit
		// if the contents of the asset have changed, by re-using the previous Source object
		// otherwise to maintain this integrity.
		this._cache = new WeakMap();
	}

	apply(compiler) {
		const header = this.header;
		const footer = this.footer;
		const tester = {test: this.test};
		const cache = this._cache;

		compiler.hooks.compilation.tap('WrapperPlugin', (compilation) => {
			if (this.afterOptimizations) {
				compilation.hooks.afterOptimizeChunkAssets.tap('WrapperPlugin', (chunks) => {
					wrapChunks(compilation, chunks, footer, header);
				});
			} else {
				compilation.hooks.optimizeChunkAssets.tapAsync('WrapperPlugin', (chunks, done) => {
					wrapChunks(compilation, chunks, footer, header);
					done();
				});
			}
		});

		function wrapFile(compilation, fileName, chunkHash) {
			const headerContent = (typeof header === 'function') ? header(fileName, chunkHash) : header;
			const footerContent = (typeof footer === 'function') ? footer(fileName, chunkHash) : footer;

			const headerContentString = String(headerContent);
			const footerContentString = String(footerContent);

			const cacheKey = compilation.assets[fileName];
			let content = null;
			if (cache.has(cacheKey)) {
				content = cache.get(cacheKey);
				if (content.header !== headerContentString || content.footer !== footerContentString) {
					content = null;
				}
			} 
			
			if (!content) {
				content = {
					header: headerContentString,
					footer: footerContentString,
					source: new ConcatSource(
						headerContentString,
						compilation.assets[fileName],
						footerContentString) 
				}
				cache.set(compilation.assets[fileName], content)
			}

			compilation.assets[fileName] = content.source;
		}

		function wrapChunks(compilation, chunks) {
			for (const chunk of chunks) {
				if (!chunk.rendered) {
					// Skip already rendered (cached) chunks
					// to avoid rebuilding unchanged code.
					continue;
				}

				const args = {
					hash: compilation.hash,
					chunkhash: chunk.hash,
				};
				for (const fileName of chunk.files) {
					if (ModuleFilenameHelpers.matchObject(tester, fileName)) {
						wrapFile(compilation, fileName, args);
					}
				}
			}
		} // wrapChunks
	}
}

module.exports = WrapperPlugin;
