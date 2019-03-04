declare module 'blockadblock' {
	const loaded: {};
	export default loaded;
}

declare class BlockAdBlock {
	constructor(options?: BlockAdBlockOptions);

	/** @param loop=true */
	check(loop?: boolean): boolean;

	emitEvent(detected: boolean): BlockAdBlock;

	clearEvent(): void;

	onDetected(fn: () => void): BlockAdBlock;

	onNotDetected(fn: () => void): BlockAdBlock;

	on(detected: boolean, fn: () => void): BlockAdBlock;
}

interface BlockAdBlockOptions {
	/** @default false */
	checkOnLoad?: boolean;

	/** @default false */
	resetOnEnd?: boolean;

	/** @default 50 */
	loopCheckTime?: number;

	/** @default 5 */
	loopMaxNumber?: number;

	baitClass?: string;
	baitStyle?: string;

	/** @default false */
	debug?: boolean;
}
