import { expect } from 'chai';

import { context, InstantConfigService } from '@wikia/core';
import { TaglessRequestSetup } from '@wikia/platforms/shared';

describe('Tagless request setup', () => {
	let orgFetch, fetchStub, blobStub, instantConfigStub;

	beforeEach(() => {
		orgFetch = globalThis.fetch;
		fetchStub = global.sandbox.stub();
		blobStub = global.sandbox.stub();
		globalThis.fetch = fetchStub;
		instantConfigStub = global.sandbox.createStubInstance(InstantConfigService);

		context.set('vast.adUnitId', '/5441/fake-vast-ad-unit');
	});

	afterEach(() => {
		context.remove('custom.hasFeaturedVideo');
		context.remove('vast.adUnitId');
		context.remove('options.video.uapJWPLineItemIds');

		global.sandbox.restore();
		globalThis.fetch = orgFetch;
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

	it('call resolves with null when fetch fails', async () => {
		instantConfigStub.get.withArgs('icTaglessRequestEnabled').returns(true);
		context.set('custom.hasFeaturedVideo', true);
		fetchStub.resolves({
			status: 400,
		});

		const taglessRequestSetup = new TaglessRequestSetup(instantConfigStub, null);
		await taglessRequestSetup.call();

		taglessRequestSetup.initialized.then((res) => {
			expect(res).to.be.eq(null);
		});
	});

	it('call resolves with null when fetch() succeed but with no XML', async () => {
		instantConfigStub.get.withArgs('icTaglessRequestEnabled').returns(true);
		context.set('custom.hasFeaturedVideo', true);
		context.set('options.video.uapJWPLineItemIds', []);
		blobStub.resolves({
			text: () => 'not-really-xml',
		});
		fetchStub.resolves({
			status: 200,
			blob: blobStub,
		});

		const taglessRequestSetup = new TaglessRequestSetup(instantConfigStub, null);
		await taglessRequestSetup.call();

		taglessRequestSetup.initialized.then((res) => {
			expect(res).to.be.eq(null);
		});
	});
});
