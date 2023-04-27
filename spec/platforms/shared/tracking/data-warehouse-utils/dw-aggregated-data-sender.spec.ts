import { context } from '@wikia/core';
import {
	DwAggregatedDataCompressor,
	DwAggregatedDataSender,
} from '@wikia/platforms/shared/tracking/data-warehouse-utils/dw-aggregated-data-sender';
import { expect } from 'chai';
import sinon from 'sinon';

describe('DwAggregatedDataSender', () => {
	const aggregatedData = [
		{
			cb: 123,
			url: 'some.kind.of.sample.url',
		},
	];

	let dwAggretatedDataSender: DwAggregatedDataSender;
	let dwAggregatedDataCompressor: DwAggregatedDataCompressor;

	let fetchStub;
	let compressionSupportedStub;
	let compressStub;

	beforeEach(() => {
		fetchStub = sinon.stub();
		fetchStub.resolves({
			status: 200,
		});
		globalThis.fetch = fetchStub;
		compressionSupportedStub = sinon.stub();
		compressStub = sinon.stub();

		dwAggregatedDataCompressor = {
			compress: compressStub,
			compressionSupported: compressionSupportedStub,
		};
		dwAggretatedDataSender = new DwAggregatedDataSender(dwAggregatedDataCompressor);
	});

	describe('compressoin enabled', () => {
		let comressionResultPromise;

		const mockCompression = (
			data = {
				compressed: 'compressed',
				contentEncoding: 'gzip',
			},
		) => {
			comressionResultPromise = sinon.promise();
			comressionResultPromise.resolve(data);
			compressStub.resolves(comressionResultPromise);
		};

		beforeEach(() => {
			context.set('services.dw-tracker.compression', true);
			compressionSupportedStub.returns(true);
		});

		afterEach(() => {
			context.remove('services.dw-tracker.compression');
		});

		it('performs compression before sending', async () => {
			// given
			mockCompression();
			// when
			dwAggretatedDataSender.sendTrackData('trackingUrl', aggregatedData);
			await comressionResultPromise;

			// then
			expect(compressionSupportedStub.callCount).to.be.eq(1);
			expect(compressStub.callCount).to.be.eq(1);
			expect(compressStub.args[0][0]).to.be.eq(JSON.stringify(aggregatedData));
			expect(fetchStub.callCount).to.be.eq(1);
		});

		it('sends compressed data to the right endpoint', async () => {
			// given
			const encoding = 'gzipOrSomething';
			mockCompression({
				compressed: 'compressed',
				contentEncoding: encoding,
			});
			// when
			dwAggretatedDataSender.sendTrackData('trackingUrl', aggregatedData);
			await comressionResultPromise;

			// then
			expect(fetchStub.args[0][0]).to.be.eq('trackingUrl_v2' + encoding);
			expect(fetchStub.args[0][1].body).to.be.eq('compressed');
			expect(fetchStub.args[0][1].method).to.be.eq('POST');
		});
	});

	describe('compression disabled', () => {
		it('performs no compression before sending', async () => {
			// given
			// when
			dwAggretatedDataSender.sendTrackData('trackingUrl', aggregatedData);

			// then
			expect(compressStub.callCount).to.be.eq(0);
			expect(fetchStub.callCount).to.be.eq(1);
		});

		it('sends uncompresssed data to the right endpoint', async () => {
			// given
			// when
			dwAggretatedDataSender.sendTrackData('trackingUrl', aggregatedData);

			// then
			expect(fetchStub.args[0][0]).to.be.eq('trackingUrl_v2');
			expect(fetchStub.args[0][1].body).to.be.eq(JSON.stringify(aggregatedData));
			expect(fetchStub.args[0][1].method).to.be.eq('POST');
		});
	});
});
