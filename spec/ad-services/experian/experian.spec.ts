import { Experian } from '@wikia/ad-services';
import { context, InstantConfigService, utils } from '@wikia/core';
import { expect } from 'chai';

describe('Experian', () => {
	let experian;
	let loadScriptStub, instantConfigStub;

	beforeEach(() => {
		instantConfigStub = global.sandbox.createStubInstance(InstantConfigService);
		instantConfigStub.get.withArgs('icExperian').returns(true);
		loadScriptStub = global.sandbox
			.stub(utils.scriptLoader, 'loadScript')
			.returns(Promise.resolve({} as any));
		experian = new Experian(instantConfigStub);
		window.fandomContext = {
			partners: { directedAtChildren: false },
		} as any;
	});

	after(() => {
		delete window.fandomContext;
	});

	it('Experian is called', async () => {
		await experian.call();

		expect(loadScriptStub.called).to.equal(true);
	});

	it('Experian can be disabled', async () => {
		instantConfigStub.get.withArgs('icExperian').returns(false);

		await experian.call();

		expect(loadScriptStub.called).to.equal(false);
	});

	it('Experian not called when user is not opted in', async () => {
		context.set('options.trackingOptIn', false);

		await experian.call();

		expect(loadScriptStub.called).to.equal(false);
	});

	it('Experian not called when user has opted out sale', async () => {
		context.set('options.optOutSale', true);

		await experian.call();

		expect(loadScriptStub.called).to.equal(false);
	});

	it('Experian not called on kid wikis', async () => {
		context.set('wiki.targeting.directedAtChildren', true);
		window.fandomContext.partners.directedAtChildren = true;

		await experian.call();

		expect(loadScriptStub.called).to.equal(false);
	});
});
