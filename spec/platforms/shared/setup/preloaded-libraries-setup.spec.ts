import { A9Provider } from '@wikia/ad-bidders';
import { Audigent } from '@wikia/ad-services';
import {
	context,
	InstantConfigService,
	InstantConfigServiceInterface,
	pbjsFactory,
	utils,
} from '@wikia/core';
import { GptSetup } from '@wikia/platforms/shared';
import { PreloadedLibrariesSetup } from '@wikia/platforms/shared/setup/preloaded-libraries-setup';
import { expect } from 'chai';

describe('PreloadedLibrariesSetup', () => {
	let scriptLoaderStub;

	beforeEach(() => {
		scriptLoaderStub = global.sandbox.stub(utils.scriptLoader, 'loadScript').resolvesThis();
		global.sandbox
			.stub(context, 'get')
			.withArgs('options.preload')
			.returns({ gpt: true, apstag: true, prebid: true, intentIq: true, audigent: true });
	});

	it('should preloadLibraries', async () => {
		const instantConfig: InstantConfigServiceInterface = {
			get: global.sandbox
				.stub()
				.withArgs('icPrebid')
				.returns(true)
				.withArgs('icAudigent')
				.returns(true)
				.withArgs('icA9Bidder')
				.returns(true)
				.withArgs('icPrebidVersion', 'latest/min.js')
				.returns('myVer/prebid.min.js'),
		};
		const contextSetStub = global.sandbox.stub(context, 'set');
		const pbjsFactoryInitStub = global.sandbox.stub(pbjsFactory, 'init').resolves();
		const audigentLoadSegmentLibraryStub = global.sandbox.stub(Audigent, 'loadSegmentLibrary');
		const A9ProviderInitStub = global.sandbox.stub(A9Provider, 'initApstag');

		await new PreloadedLibrariesSetup(
			instantConfig as InstantConfigService,
			new GptSetup(),
		).execute();

		expect(
			contextSetStub.calledWith(
				'bidders.prebid.libraryUrl',
				'//static.wikia.nocookie.net/fandom-ae-assets/prebid.js/myVer/prebid.min.js',
			),
			'prebid set',
		).to.be.true;
		expect(A9ProviderInitStub.calledOnce, 'apstag init').to.be.true;
		expect(
			scriptLoaderStub.calledWith('https://securepubads.g.doubleclick.net/tag/js/gpt.js'),
			'gpt load',
		).to.be.true;
		expect(pbjsFactoryInitStub.calledOnce, 'pbjs init').to.be.true;
		expect(audigentLoadSegmentLibraryStub.calledOnce, 'audigent load').to.be.true;
	});

	it('should load prebid from proper location', async () => {
		const instantConfig: InstantConfigServiceInterface = {
			get: global.sandbox
				.stub()
				.withArgs('icPrebid')
				.returns(true)
				.withArgs('icAudigent')
				.returns(false)
				.withArgs('icPrebidVersion', 'latest/min.js')
				.returns('//static.wikia.nocookie.net/fandom-ae-assets/prebid.js/v127.0.1/20342-min.js'),
		};
		const contextSetStub = global.sandbox.stub(context, 'set');

		await new PreloadedLibrariesSetup(
			instantConfig as InstantConfigService,
			new GptSetup(),
		).execute();

		expect(
			contextSetStub.calledWith(
				'bidders.prebid.libraryUrl',
				'//static.wikia.nocookie.net/fandom-ae-assets/prebid.js/v127.0.1/20342-min.js',
			),
		).to.be.true;
	});

	it('should not load prebid from non fandom location', async () => {
		const instantConfig: InstantConfigServiceInterface = {
			get: global.sandbox
				.stub()
				.withArgs('icPrebid')
				.returns(true)
				.withArgs('icAudigent')
				.returns(false)
				.withArgs('icPrebidVersion', 'latest/min.js')
				.returns('https://prebid.org/../../../../../attacker/script.js'),
		};
		const contextSetStub = global.sandbox.stub(context, 'set');

		await new PreloadedLibrariesSetup(
			instantConfig as InstantConfigService,
			new GptSetup(),
		).execute();

		expect(
			contextSetStub.calledWith(
				'bidders.prebid.libraryUrl',
				'//static.wikia.nocookie.net/fandom-ae-assets/prebid.js/latest/min.js',
			),
		).to.be.true;
	});
});
