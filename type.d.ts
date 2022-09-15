import { Compiler } from "webpack";

type Factor = (filename: string, chunkHash: string) => string;

export interface Options {
	/** Text that will be prepended to an output file. */
	header?: string | Factor;
	/** Text that will be appended to an output file. */
	footer?: string | Factor;
	/** Tested against output file names to check if they should be affected by this */
	test?: string | RegExp;
	/**
	 * Indicating whether this plugin should be activated before
	 * (`false`) or after (`true`) the optimization stage. Example use case: Set this to true if you want to avoid
	 * minification from affecting the text added by this plugin.
	 */
	afterOptimizations?: boolean;
}

export default class WrapperPlugin {
	constructor(options: Options);
	apply(compiler: Compiler): void;
}
