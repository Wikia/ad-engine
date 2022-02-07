import { expect } from 'chai';
import { createSandbox } from 'sinon';

import { onVideoOverlayClick } from '../../../../../src/ad-products/templates/interface/listeners/player-overlay-click-listener';

describe('Player click listener', () => {
	const sandbox = createSandbox();

	let playerStub;
	let communicationServiceStub;

	beforeEach(() => {
		playerStub = {
			play: sandbox.stub(),
			getPlayCounter: sandbox.stub(),
			settings: {
				getSlotName: sandbox.stub(),
			},
		};

		communicationServiceStub = {
			emit: sandbox.stub(),
		};
	});

	afterEach(() => {
		sandbox.restore();
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
