import { utils } from '@wikia/ad-engine';
import { Compressed, DwAggregatedDataCompressor } from './dw-track-sender';

/***
 * Compresses data using Gzip algorithm
 * It is a adapter for browser's CompressionStream API
 * In case of lack of support it returns input string as fallback mode
 * In case of error it returns input string as fallback mode
 * @see https://developer.mozilla.org/en-US/docs/Web/API/CompressionStream
 */
export class DwAggregatedDataGzipCompressor implements DwAggregatedDataCompressor {
	private readonly contentEncoding = 'gzip';
	private browserSupportsCompression: boolean;

	public compressionSupported(): boolean {
		if (this.browserSupportsCompression !== undefined) {
			return this.browserSupportsCompression;
		}
		this.browserSupportsCompression =
			typeof utils.getGlobalValue<CompressionStream>('CompressionStream') === 'function' &&
			typeof utils.getGlobalValue<TextEncoder>('TextEncoder') === 'function';

		if (!this.browserSupportsCompression) {
			utils.logger(
				'dw_gzip_compressor_debug',
				'DwAggregatedDataGzipCompressor',
				'Compression API not supported',
			);
		}
		return this.browserSupportsCompression;
	}

	public async compress(input: string): Promise<Compressed> {
		try {
			if (!this.compressionSupported()) {
				return { compressed: input };
			}
			const inputStream = this.buildStream(input);
			const compressedStream = this.gzipStream(inputStream);
			const compressedBytes = await this.readStream(compressedStream);

			utils.logger('dw_gzip_compressor_debug', 'DwAggregatedDataGzipCompressor', {
				uncompressedStringLen: input.length,
				compressedBytesLen: compressedBytes.byteLength,
			});

			return { compressed: compressedBytes, contentEncoding: this.contentEncoding };
		} catch (e) {
			utils.logger(
				'dw_gzip_compressor_debug',
				'DwAggregatedDataGzipCompressor',
				'Error while compressing data, returning uncompressed data instead.',
				{ error: e },
			);
			return { compressed: input };
		}
	}

	private buildStream(input: string): ReadableStream<Uint8Array> {
		const uncompressedBytes = new TextEncoder().encode(input);
		return new ReadableStream<Uint8Array>({
			start(controller) {
				controller.enqueue(uncompressedBytes);
				controller.close();
			},
		});
	}

	private gzipStream(input: ReadableStream<Uint8Array>): ReadableStream<Uint8Array> {
		return input.pipeThrough(new CompressionStream('gzip')) as ReadableStream<Uint8Array>;
	}

	private async readStream(input: ReadableStream<Uint8Array>): Promise<Uint8Array> {
		const chunks: Uint8Array[] = [];
		const reader = input.getReader();
		let finished;
		while (!finished) {
			const { done, value } = await reader.read();
			if (!done) {
				chunks.push(value);
			}
			finished = done;
		}

		const result = new Uint8Array(chunks.reduce((acc, chunk) => acc + chunk.byteLength, 0));
		let offset = 0;
		for (const chunk of chunks) {
			result.set(new Uint8Array(chunk.buffer), offset);
			offset += chunk.byteLength;
		}

		return result;
	}
}
