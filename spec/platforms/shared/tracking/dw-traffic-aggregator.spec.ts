import { DataWarehouseParams } from '@wikia/platforms/shared';
import { TrackingUrl } from '@wikia/platforms/shared/setup/tracking-urls';
import { DwTrafficAggregator } from '@wikia/platforms/shared/tracking/data-warehouse-utils/dw-traffic-aggregator';
import { expect } from 'chai';
import sinon from 'sinon';

describe('dw-traffic-aggregator', () => {
	let dwTrafficAggregator;
	let startStub;
	let sendTrackData;
	let fireAggregatedQueueByTrack;

	const trackingTestUrl: TrackingUrl = {
		name: 'MochaTest',
		icbmName: 'mocaTest',
		url: 'https://non-existing.wikia-services.com/__track/special/mocaTest',
		allowed: {
			sampling: true,
			aggregation: true,
			aggregationLimit: 3,
		},
	};
	const sampleDwParams: DataWarehouseParams = {
		cb: 123,
		url: 'some.kind.of.sample.url',
	};

	beforeEach(() => {
		startStub = sinon.stub(DwTrafficAggregator.prototype, 'start' as any);
		fireAggregatedQueueByTrack = sinon.stub(
			DwTrafficAggregator.prototype,
			'fireAggregatedQueueByTrack' as any,
		);

		dwTrafficAggregator = new DwTrafficAggregator();
	});

	it('return "true" when asked for active state, when initialized', () => {
		expect(startStub.callCount).to.be.eq(1);

		expect(dwTrafficAggregator.isAggregatorActive()).to.be.true;

		expect(fireAggregatedQueueByTrack.callCount).to.be.eq(0);
	});

	it('push data once and not fire sending tracking to external service yet', () => {
		expect(startStub.callCount).to.be.eq(1);

		dwTrafficAggregator.push(trackingTestUrl, sampleDwParams);

		expect(fireAggregatedQueueByTrack.callCount).to.be.eq(0);
	});

	it('push data at the limit which cause sending tracking to external service yet', () => {
		expect(startStub.callCount).to.be.eq(1);

		for (let i = 0; i < trackingTestUrl.allowed.aggregationLimit; i++) {
			dwTrafficAggregator.push(trackingTestUrl, sampleDwParams);
		}

		expect(fireAggregatedQueueByTrack.callCount).to.be.eq(1);
	});

	afterEach(() => {
		startStub.restore();
		sendTrackData.restore();
		fireAggregatedQueueByTrack.restore();
	});
});
