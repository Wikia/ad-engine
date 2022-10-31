import { expect } from 'chai';
import { context } from '@wikia/core';
import { userIdentity } from '@wikia/ad-services';
import { spy } from 'sinon';

describe('User Identity', () => {
	afterEach(() => {
		context.remove('services.ppid.enabled');
		context.remove('services.ppidRepository');
	});

	it('is disabled', async () => {
		const setupSpy = spy(userIdentity, 'setupPPID');

		context.set('services.ppid.enabled', false);

		await userIdentity.call();

		expect(setupSpy.notCalled).to.eq(true);
	});
});
