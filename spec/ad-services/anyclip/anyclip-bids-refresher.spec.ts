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
	});

	afterEach(() => {
		window['testSubscribeFunc'] = undefined;
		serviceSlotGetStub.restore();
	});

	it('does not emit events to refresh bids when the subscribe function is not called', () => {
		const refresher = new AnyclipBidsRefresher('testSubscribeFunc');
		refresher.trySubscribingBidRefreshing();
		expect(fakeIncontentPlayerSlot.emit.callCount).equal(0);
	});

	it('emits events to refresh bids when the subscribe function is called', () => {
		const fakeSubscribe = (callback) => callback();
		window['testSubscribeFunc'] = fakeSubscribe;

		const refresher = new AnyclipBidsRefresher('testSubscribeFunc');
		refresher.trySubscribingBidRefreshing();

		expect(fakeIncontentPlayerSlot.emit.getCalls()[0].firstArg).equal(
			AdSlotEvent.VIDEO_AD_IMPRESSION,
		);
		expect(fakeIncontentPlayerSlot.emit.getCalls()[1].firstArg).equal(AdSlotEvent.VIDEO_AD_USED);
	});
});
