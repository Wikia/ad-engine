import { AnyclipBidsRefresher } from '@wikia/ad-services/anyclip/anyclip-bids-refresher';
import { AdSlotEvent, slotService } from '@wikia/core';

import { expect } from 'chai';
import { spy, stub } from 'sinon';

describe('AnyclipBidsRefresher', () => {
	let serviceSlotGetStub;
	const fakeIncontentPlayerSlot = {
		emit: spy(),
		getElement: spy(),
	};

	beforeEach(() => {
		serviceSlotGetStub = stub(slotService, 'get' as any);
		serviceSlotGetStub.returns(fakeIncontentPlayerSlot);

		window['existingSubscribeFunction'] = (callback) => callback();
		window['undefinedSubscribeFunction'] = undefined;
	});

	afterEach(() => {
		serviceSlotGetStub.restore();
	});

	it('does not emit events to refresh bids when the subscribe function is not called', () => {
		const refresher = new AnyclipBidsRefresher('undefinedSubscribeFunction');
		refresher.trySubscribingBidRefreshing();
		expect(fakeIncontentPlayerSlot.emit.callCount).equal(0);
	});

	it('emits events to refresh bids when the subscribe function is called', () => {
		const refresher = new AnyclipBidsRefresher('existingSubscribeFunction');
		refresher.trySubscribingBidRefreshing();
		expect(fakeIncontentPlayerSlot.emit.getCalls()[0].firstArg).equal(
			AdSlotEvent.VIDEO_AD_IMPRESSION,
		);
	});
});
