import { expect } from 'chai';
import { context } from '../../../src/ad-engine/services/context-service';
import { trackingOptIn } from '../../../src/ad-engine/services/tracking-opt-in';

describe('tracking-opt-in', () => {
	it('is not opted in when main flag is disabled', () => {
		context.set('options.trackingOptIn', false);

		expect(trackingOptIn.isOptedIn()).to.not.be.ok;
	});

	it('is opted in when main flag is enabled', () => {
		context.set('options.trackingOptIn', true);

		expect(trackingOptIn.isOptedIn()).to.be.ok;
	});
});
