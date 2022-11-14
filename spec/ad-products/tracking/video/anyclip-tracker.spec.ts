import { expect } from 'chai';
import { spy } from 'sinon';

import { AnyclipTracker } from '@wikia/ad-products';

describe('AnyclipTracker', () => {
	afterEach(() => {
		window['testSubscribeFunc'] = undefined;
	});

	it('uses global function to subscribe to AnyClip events', () => {
		const subscribeSpy = spy();
		window['testSubscribeFunc'] = subscribeSpy;

		const tracker = new AnyclipTracker('testSubscribeFunc');
		tracker.register();
		expect(subscribeSpy.callCount).not.to.equal(0);
	});

	it('does not do anything if there is no global function from AnyClip', () => {
		const subscribeSpy = spy();

		const tracker = new AnyclipTracker('testSubscribeFunc');
		tracker.register();
		expect(subscribeSpy.callCount).to.equal(0);
	});
});
