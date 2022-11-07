import { expect } from 'chai';
import { spy } from 'sinon';

import { AnyclipTracker } from '@wikia/ad-products';

describe('AnyclipTracker', () => {
	afterEach(() => {
		window['lreSubscribe'] = undefined;
	});

	it('uses global function to subscribe to AnyClip events', (done) => {
		const subscribeSpy = spy();
		window['lreSubscribe'] = subscribeSpy;

		const tracker = new AnyclipTracker(10, 1);
		tracker.register();

		setTimeout(() => {
			expect(subscribeSpy.callCount).not.to.equal(0);
			done();
		}, 11);
	});

	it('does not do anything if there is no global function from AnyClip', (done) => {
		const subscribeSpy = spy();

		const tracker = new AnyclipTracker(10, 1);
		tracker.register();

		expect(subscribeSpy.callCount).to.equal(0);
		setTimeout(() => {
			expect(subscribeSpy.callCount).to.equal(0);
			done();
		}, 11);
	});
});
