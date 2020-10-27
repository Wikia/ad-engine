import { expect } from 'chai';
import * as sinon from 'sinon';
import { AdSlot, context } from '../../../src/ad-engine';
import { viewabilityPropertiesTrackingMiddleware } from '../../../src/ad-engine/tracking';

describe('viewability-properties-tracking-middleware', () => {
	const sandbox = sinon.createSandbox();
	let adSlot: AdSlot;

	beforeEach(() => {
		context.set('slots.foo.targeting', {
			rv: 5,
			wsi: 'ola1',
		});
		adSlot = new AdSlot({ id: 'foo' });
		adSlot.creativeId = 123;
		adSlot.lineItemId = 789;

		sandbox.stub(adSlot, 'getUid').returns('a2b01b9f-69df-4481-9daf-9e27bf26502b');
	});

	afterEach(() => {
		sandbox.restore();
	});

	it('returns all info about slot for tracking', () => {
		const context = {
			data: {
				previous: 'value',
			},
			slot: adSlot,
		};
		const nextSpy = sinon.spy();

		viewabilityPropertiesTrackingMiddleware(context, nextSpy);

		expect(nextSpy.getCall(0).args[0].data).to.deep.equal({
			creative_id: 123,
			line_item_id: 789,
			previous: 'value',
			rv: 5,
			slot_id: 'a2b01b9f-69df-4481-9daf-9e27bf26502b',
			wsi: 'ola1',
		});
	});
});
