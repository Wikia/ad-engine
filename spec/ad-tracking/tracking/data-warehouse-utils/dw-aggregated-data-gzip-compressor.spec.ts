import '@stardazed/streams-polyfill'; // provides types missing in currently used version of node
import { DwAggregatedDataGzipCompressor } from '@wikia/ad-tracking';
import { expect } from 'chai';
import sinon from 'sinon';

describe('DwAggregatedDataGzipCompressor', () => {
	const dwAggregatedDataGzipCompressor = new DwAggregatedDataGzipCompressor();

	describe('compressoin supported by the browser', () => {
		const globalThisContext: any = globalThis;
		const windowContext: any = window;

		const simulateCompressionSupported = () => {
			windowContext.CompressionStream = sinon.stub();
			windowContext.TextEncoder = sinon.stub();
		};

		const dummyTransformStream = new TransformStream({
			transform(chunk, controller) {
				controller.enqueue(chunk);
			},
		});

		const injectFakeCompressionStream = (transformStream: TransformStream) => {
			globalThisContext.CompressionStream.returns(transformStream);
		};

		const stubCompressionStream = () => {
			globalThisContext.CompressionStream = sinon.stub();
		};

		beforeEach(() => {
			simulateCompressionSupported();
			stubCompressionStream();
		});

		it('performs a compression of an input string', async () => {
			// given
			const inputString = 'test test test test repeated';
			injectFakeCompressionStream(dummyTransformStream);
			// when
			const compressed = await dwAggregatedDataGzipCompressor.compress(inputString);

			// then
			expect(compressed.contentEncoding).to.equal('gzip');
			expect(compressed.compressed).to.be.an.instanceof(Uint8Array);
			expect(compressed.compressed.length).to.be.greaterThan(0);

			const compressedString = String.fromCharCode.apply(null, compressed.compressed);
			expect(compressedString).to.equal(inputString);
		});
	});

	describe('compressoin not supported by the browser', () => {
		it('returns input string as fallback mode', async () => {
			// given
			const input = 'test string';
			// when
			const compressed = await dwAggregatedDataGzipCompressor.compress(input);
			// then
			expect(compressed.compressed).to.equal(input);
			expect(compressed.contentEncoding).to.equal(undefined);
		});
	});
});
