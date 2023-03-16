import { UserIdentity } from '@wikia/ad-services';
import { context } from '@wikia/core';
import { expect } from 'chai';
import { spy } from 'sinon';

describe('User Identity', () => {
	const userIdentity = new UserIdentity();

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
