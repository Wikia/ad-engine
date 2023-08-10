import { System1 } from '@wikia/ad-services';
import { context, InstantConfigService, localCache, utils } from '@wikia/core';
import { expect } from 'chai';

describe('System1', () => {
	let loadScriptStub,
		instantConfigStub,
		contextStub,
		system1Config,
		system1: System1,
		localCacheStub;
	const globalOriginalMW: any = window.mw;

	beforeEach(() => {
		loadScriptStub = global.sandbox
			.stub(utils.scriptLoader, 'loadScript')
			.returns(Promise.resolve({} as any));
		instantConfigStub = global.sandbox.createStubInstance(InstantConfigService);
		contextStub = global.sandbox.stub(context);
		localCacheStub = global.sandbox.stub(localCache);

		system1 = new System1(instantConfigStub);

		system1Config = {};
		window.s1search = (...args: any) => (system1Config = args[1]);
	});

	afterEach(() => {
		loadScriptStub.resetHistory();
		window.mw = globalOriginalMW;
	});

	it('System1 is disabled if the page is not search page', async () => {
		instantConfigStub.get.withArgs('icSystem1').returns(true);

		await system1.call();

		expect(loadScriptStub.called).to.equal(false);
	});

	it('System1 is enabled if the page is search page', async () => {
		configureStubs(true, 'search');

		await system1.call();

		expect(loadScriptStub.called).to.equal(true);
	});

	it('System1 is disabled', async () => {
		configureStubs(false, 'search');

		await system1.call();

		expect(loadScriptStub.called).to.equal(false);
	});

	it('System1 has fandomDark segment', async () => {
		configureStubs(true, 'search', true, true);

		await system1.call();

		expect(system1Config['segment']).to.equal('fandomdark');
	});

	it('System1 has fanmob00 segment', async () => {
		configureStubs(true, 'search', true, false);

		global.sandbox.stub(window, 'mw').value({
			config: new Map([['isDarkTheme', false]]),
		});

		await system1.call();
		expect(system1Config['segment']).to.equal('fanmob00');
	});

	it('System1 has fan00 segment', async () => {
		configureStubs(true, 'search', false, false);

		await system1.call();
		expect(system1Config['segment']).to.equal('fan00');
	});

	it('System1 does not have newSession flag', async () => {
		configureStubs(true, 'search', false, true);

		localCacheStub.getItem.withArgs('adEngine_system1').returns('dark');

		await system1.call();
		expect(system1Config['newSession']).to.equal(false);
	});

	it('System1 has newSession flag', async () => {
		configureStubs(true, 'search', false, true);

		localCacheStub.getItem.withArgs('adEngine_system1').returns('light');

		await system1.call();
		expect(system1Config['newSession']).to.equal(true);
	});

	it('System1 has valid config', async () => {
		configureStubs(true, 'search', false, true);
		contextStub.get.withArgs('wiki.search_system1_signature').returns('123456');
		contextStub.get.withArgs('wiki.search_term_for_html').returns('test');
		contextStub.get.withArgs('wiki.search_filter').returns('imageOnly');

		global.sandbox.stub(window, 'location').value({
			hostname: 'project43.preview.fandom.com',
			protocol: 'https',
		});

		await system1.call();

		expect(system1Config['category']).to.equal('image');
		expect(system1Config['domain']).to.equal('project43.preview.fandom.com');
		expect(system1Config['isTest']).to.equal(false);
		expect(system1Config['newSession']).to.equal(true);
		expect(system1Config['partnerId']).to.equal('42232');
		expect(system1Config['query']).to.equal('test');
		expect(system1Config['segment']).to.equal('fandomdark');
		expect(system1Config['signature']).to.equal('123456');
		expect(system1Config['subId']).to.equal(
			'https//project43.preview.fandom.com?serp=test&segment=fandomdark&domain=project43',
		);
	});

	function configureStubs(
		isEnabled: boolean,
		pageType: string,
		isMobile = false,
		isDarkTheme = false,
	) {
		instantConfigStub.get.withArgs('icSystem1').returns(isEnabled);
		contextStub.get.withArgs('wiki.opts.pageType').returns(pageType);
		contextStub.get.withArgs('state.isMobile').returns(isMobile);

		global.sandbox.stub(window, 'mw').value({
			config: new Map([['isDarkTheme', isDarkTheme]]),
		});
	}
});
