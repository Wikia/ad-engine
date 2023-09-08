import { Audigent } from '@wikia/ad-services';
import {
	context,
	InstantConfigService,
	InstantConfigServiceInterface,
	pbjsFactory,
} from '@wikia/core';
import { PreloadedLibrariesSetup } from '@wikia/platforms/shared/utils/preloaded-libraries-setup';
import { expect } from 'chai';

describe('PreloadedLibrariesSetup', () => {
	it('should preloadLibraries', async () => {
		const instantConfig: InstantConfigServiceInterface = {
			get: global.sandbox
				.stub()
				.withArgs('icPrebid')
				.returns(true)
				.withArgs('icAudigent')
				.returns(true)
				.withArgs('icPrebidVersion', 'latest/min.js')
				.returns('myVer/prebid.min.js'),
		};
		const contextSetStub = global.sandbox.stub(context, 'set');
		const pbjsFactoryInitStub = global.sandbox.stub(pbjsFactory, 'init').resolves();
		const audigentLoadSegmentLibraryStub = global.sandbox.stub(Audigent, 'loadSegmentLibrary');

		await new PreloadedLibrariesSetup(instantConfig as InstantConfigService).execute();

		expect(
			contextSetStub.calledOnceWith(
				'bidders.prebid.libraryUrl',
				'//static.wikia.nocookie.net/fandom-ae-assets/prebid.js/myVer/prebid.min.js',
			),
		).to.be.true;
		expect(pbjsFactoryInitStub.calledOnce).to.be.true;
		expect(audigentLoadSegmentLibraryStub.calledOnce).to.be.true;
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

		await new PreloadedLibrariesSetup(instantConfig as InstantConfigService).execute();

		expect(
			contextSetStub.calledOnceWith(
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

		await new PreloadedLibrariesSetup(instantConfig as InstantConfigService).execute();

		expect(
			contextSetStub.calledOnceWith(
				'bidders.prebid.libraryUrl',
				'//static.wikia.nocookie.net/fandom-ae-assets/prebid.js/latest/min.js',
			),
		).to.be.true;
	});
});
