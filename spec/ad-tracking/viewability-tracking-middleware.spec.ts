import { expect } from 'chai';
import * as sinon from 'sinon';
import { AdSlot } from '../../src/ad-engine';
import { viewabilityTrackingMiddleware } from '../../src/ad-tracking';

describe('viewability-tracking-middleware', () => {
	let adSlot: AdSlot;

	beforeEach(() => {
		adSlot = new AdSlot({ id: 'foo' });
	});

	it('returns all general keys for tracking', () => {
		const context = {
			data: {
				previous: 'value',
			},
			slot: adSlot,
		};
		const nextSpy = sinon.spy();

		viewabilityTrackingMiddleware(context, nextSpy);

		expect(Object.keys(nextSpy.getCall(0).args[0].data)).to.deep.equal([
			'previous',
			'timestamp',
			'tz_offset',
		]);
	});
});
