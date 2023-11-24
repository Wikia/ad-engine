import { expect } from 'chai';
import sinon from 'sinon';

import { context, InstantConfigService } from '@wikia/core';
import { TaglessRequestSetup } from '@wikia/platforms/shared';

describe('Tagless request setup', () => {
	const instantConfigStub = sinon.createStubInstance(InstantConfigService);

	afterEach(() => {
		context.remove('custom.hasFeaturedVideo');
	});

	it('isRequiredToRun returns false when disabled in the instant-config', () => {
		instantConfigStub.get.withArgs('icTaglessRequestEnabled').returns(false);

		const taglessRequestSetup = new TaglessRequestSetup(instantConfigStub, null);

		expect(taglessRequestSetup.isRequiredToRun()).to.be.equal(false);
	});

	it('isRequiredToRun returns true when enabled in the instant-config', () => {
		instantConfigStub.get.withArgs('icTaglessRequestEnabled').returns(true);

		const taglessRequestSetup = new TaglessRequestSetup(instantConfigStub, null);

		expect(taglessRequestSetup.isRequiredToRun()).to.be.equal(true);
	});

	it('call resolves with null when disabled', async () => {
		instantConfigStub.get.withArgs('icTaglessRequestEnabled').returns(false);

		const taglessRequestSetup = new TaglessRequestSetup(instantConfigStub, null);
		await taglessRequestSetup.call();

		taglessRequestSetup.initialized.then((res) => {
			expect(res).to.be.eq(null);
		});
	});

	it('call resolves with null when not a page with a featured video', async () => {
		instantConfigStub.get.withArgs('icTaglessRequestEnabled').returns(true);
		context.set('custom.hasFeaturedVideo', false);

		const taglessRequestSetup = new TaglessRequestSetup(instantConfigStub, null);
		await taglessRequestSetup.call();

		taglessRequestSetup.initialized.then((res) => {
			expect(res).to.be.eq(null);
		});
	});
});
