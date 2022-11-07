import { expect } from 'chai';
import { spy } from 'sinon';

import { AnyclipTracker } from '@wikia/ad-products';

describe('AnyclipTracker', () => {
	const TEST_TIMEOUT = 10;
	const TEST_RETRIES = 1;

	afterEach(() => {
		window['lreSubscribe'] = undefined;
	});

	it('uses global function to subscribe to AnyClip events', () => {
		const subscribeSpy = spy();
		window['lreSubscribe'] = subscribeSpy;

		const tracker = new AnyclipTracker(TEST_TIMEOUT, TEST_RETRIES);
		tracker.register();

		setTimeout(() => {
			expect(subscribeSpy.callCount).not.to.equal(0);
		}, TEST_TIMEOUT + 1);
	});

	it('does not do anything if there is no global function from AnyClip', () => {
		const subscribeSpy = spy();

		const tracker = new AnyclipTracker(TEST_TIMEOUT, TEST_RETRIES);
		tracker.register();

		expect(subscribeSpy.callCount).to.equal(0);
		setTimeout(() => {
			expect(subscribeSpy.callCount).to.equal(0);
		}, TEST_TIMEOUT + 1);
	});
});
