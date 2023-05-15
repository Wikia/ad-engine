/**
 * type might not be supported by the browser
 * implement a check for the type before using it
 */
declare class CompressionStream implements ReadableWritablePair<Uint8Array, Uint8Array> {
	constructor(format: string, options?: CompressionStreamInit);
	readonly readable: ReadableStream<Uint8Array>;
	readonly writable: WritableStream<Uint8Array>;
}
