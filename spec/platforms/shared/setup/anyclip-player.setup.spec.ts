import { expect } from 'chai';
import { createSandbox } from 'sinon';

import { context } from '@wikia/core';
import { AnyclipPlayerSetup } from '@wikia/platforms/shared';

describe('AnyclipPlayerSetup', () => {
	const anyclipPlayerSetup = new AnyclipPlayerSetup();

	const sandbox = createSandbox();
	const mockedIsApplicable = sandbox.spy();

	beforeEach(() => {
		context.set('services.anyclip.isApplicable', mockedIsApplicable);
	});

	afterEach(function () {
		sandbox.restore();
		context.remove('services.anyclip.enabled');
		context.remove('services.anyclip.isApplicable');
		context.remove('services.anyclip.loadOnPageLoad');
	});

	it('it does not load the player when disabled in the instant-config', () => {
		context.set('services.anyclip.enabled', false);
		anyclipPlayerSetup.call();
		expect(mockedIsApplicable.called).to.equal(false);
	});

	it('it does not load the player when enabled in the instant-config but it is supposed to wait for UAP load event that never happens', () => {
		context.set('services.anyclip.enabled', true);
		context.set('services.anyclip.loadOnPageLoad', false);

		anyclipPlayerSetup.call();
		expect(mockedIsApplicable.called).to.equal(false);
	});

	it('it loads the player when enabled in the instant-config and is supposed to load on the page load', () => {
		context.set('services.anyclip.enabled', true);
		context.set('services.anyclip.loadOnPageLoad', true);

		anyclipPlayerSetup.call();
		expect(mockedIsApplicable.called).to.equal(true);
	});
});
