import { expect } from 'chai';

import { onVideoOverlayClick } from '@wikia/ad-products/templates/interface/listeners/player-overlay-click-listener';

describe('Player click listener', () => {
	let playerStub;
	let communicationServiceStub;

	beforeEach(() => {
		playerStub = {
			play: global.sandbox.stub(),
			getPlayCounter: global.sandbox.stub(),
			settings: {
				getSlotName: global.sandbox.stub(),
			},
		};

		communicationServiceStub = {
			emit: global.sandbox.stub(),
		};
	});

	it('Should not emit event when first play (autoplay or click-to-play)', () => {
		playerStub.getPlayCounter.returns(1);

		onVideoOverlayClick(playerStub, communicationServiceStub, 'test event');
		expect(communicationServiceStub.emit.called).to.equal(false);
	});

	it('Should emit event when replay', () => {
		playerStub.getPlayCounter.returns(2);

		onVideoOverlayClick(playerStub, communicationServiceStub, 'test event');
		expect(communicationServiceStub.emit.called).to.equal(true);
	});
});
