import { System1 } from '@wikia/ad-services';
import {
	context,
	globalContextService,
	InstantConfigService,
	localCache,
	utils,
} from '@wikia/core';
import { expect } from 'chai';

describe('System1', () => {
	let loadScriptStub,
		instantConfigStub,
		contextStub,
		system1Config,
		localCacheStub,
		globalContextServiceStub;
	const globalOriginalMW: any = window.mw;

	beforeEach(() => {
		loadScriptStub = global.sandbox
			.stub(utils.scriptLoader, 'loadScript')
			.returns(Promise.resolve({} as any));
		instantConfigStub = global.sandbox.createStubInstance(InstantConfigService);
		contextStub = global.sandbox.stub(context);
		localCacheStub = global.sandbox.stub(localCache);
		globalContextServiceStub = global.sandbox.stub(globalContextService);
		system1Config = {};
		window.s1search = (...args: any) => (system1Config = args[1]);
	});

	afterEach(() => {
		loadScriptStub.resetHistory();
		window.mw = globalOriginalMW;
		delete window.ads;
	});

	it('System1 is disabled if the page is not search page', async () => {
		instantConfigStub.get.withArgs('icSystem1').returns(true);
		const system1 = new System1(instantConfigStub);

		await system1.call();

		expect(loadScriptStub.called).to.equal(false);
	});

	it('System1 is enabled if the page is search page', async () => {
		configureStubs(true, 'search');
		const system1 = new System1(instantConfigStub);

		await system1.call();

		expect(loadScriptStub.called).to.equal(true);
	});

	it('System1 is disabled', async () => {
		configureStubs(false, 'search');
		const system1 = new System1(instantConfigStub);

		await system1.call();

		expect(loadScriptStub.called).to.equal(false);
	});

	it('System1 is disabled if wiki has excluded bundle', async () => {
		configureStubs(true, 'search');
		globalContextServiceStub.hasBundle.withArgs('disabled_search_ads').returns(true);
		const system1 = new System1(instantConfigStub);

		await system1.call();

		expect(loadScriptStub.called).to.equal(false);
	});

	it('System1 is disabled if COPPA', async () => {
		configureStubs(true, 'search');
		globalContextServiceStub.getValue.returns(true);
		const system1 = new System1(instantConfigStub);

		await system1.call();

		expect(loadScriptStub.called).to.equal(false);
	});

	it('System1 has fandomDark segment', async () => {
		configureStubs(true, 'search', true, true);
		const system1 = new System1(instantConfigStub);

		await system1.call();

		expect(system1Config['segment']).to.equal('fandomdark');
	});

	it('System1 has fanmob00 segment', async () => {
		configureStubs(true, 'search', true, false);
		global.sandbox.stub(window, 'mw').value({
			config: new Map([['isDarkTheme', false]]),
		});
		const system1 = new System1(instantConfigStub);

		await system1.call();
		expect(system1Config['segment']).to.equal('fanmob00');
	});

	it('System1 has fan00 segment', async () => {
		configureStubs(true, 'search', false, false);
		const system1 = new System1(instantConfigStub);

		await system1.call();
		expect(system1Config['segment']).to.equal('fan00');
	});

	it('System1 does not have newSession flag', async () => {
		configureStubs(true, 'search', false, true);
		const system1 = new System1(instantConfigStub);

		localCacheStub.getItem.withArgs('adEngine_system1').returns('dark');

		await system1.call();
		expect(system1Config['newSession']).to.equal(false);
	});

	it('System1 has newSession flag', async () => {
		configureStubs(true, 'search', false, true);

		localCacheStub.getItem.withArgs('adEngine_system1').returns('light');
		const system1 = new System1(instantConfigStub);

		await system1.call();
		expect(system1Config['newSession']).to.equal(true);
	});

	it('System1 has valid config', async () => {
		configureStubs(true, 'search', false, true, [
			['search_system1_signature', '123456'],
			['search_term_for_html', 'test'],
			['search_filter', 'imageOnly'],
		]);

		global.sandbox.stub(window, 'location').value({
			hostname: 'project43.preview.fandom.com',
			protocol: 'https',
		});
		const system1 = new System1(instantConfigStub);

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
		mwConfigEntries: [string, any][] = [],
	) {
		instantConfigStub.get.withArgs('icSystem1').returns(isEnabled);
		window.ads = {
			...window.ads,
			context: {
				// @ts-expect-error provide only partial context
				targeting: {
					pageType,
				},
			},
		};
		contextStub.get.withArgs('state.isMobile').returns(isMobile);

		global.sandbox.stub(window, 'mw').value({
			config: new Map([['isDarkTheme', isDarkTheme], ...mwConfigEntries]),
		});
	}
});
