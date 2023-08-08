import { System1 } from '@wikia/ad-services';
import { context, InstantConfigService, utils } from '@wikia/core';
import { expect } from 'chai';

describe('System1', () => {
	let loadScriptStub, instantConfigStub, contextStub;
	let system1: System1;
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	let system1Config: any;

	beforeEach(() => {
		loadScriptStub = global.sandbox
			.stub(utils.scriptLoader, 'loadScript')
			.returns(Promise.resolve({} as any));
		instantConfigStub = global.sandbox.createStubInstance(InstantConfigService);
		contextStub = global.sandbox.stub(context);

		system1 = new System1(instantConfigStub);

		system1Config = {};
		window.s1search = (...args: any) => (system1Config = args);
	});

	afterEach(() => {
		loadScriptStub.resetHistory();
	});

	it('System1 is disabled if the page is not search page', async () => {
		instantConfigStub.get.withArgs('icSystem1').returns(true);

		await system1.call();

		expect(loadScriptStub.called).to.equal(false);
	});

	it('System1 is enabled if the page is search page', async () => {
		instantConfigStub.get.withArgs('icSystem1').returns(true);
		contextStub.get.withArgs('wiki.opts.pageType').returns('search');

		await system1.call();

		expect(loadScriptStub.called).to.equal(true);
	});
});
