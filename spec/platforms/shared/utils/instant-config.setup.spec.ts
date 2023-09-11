import { intentIQ } from '@wikia/ad-bidders';
import { Audigent } from '@wikia/ad-services';
import { context, InstantConfigService, pbjsFactory } from '@wikia/core';
import { Binding, Container } from '@wikia/dependency-injection';
import { InstantConfigSetup } from '@wikia/platforms/shared';
import { expect } from 'chai';
import { SinonSpy, SinonStub } from 'sinon';

describe('InstantConfigSetup', () => {
	let container;
	const instantConfigService = new InstantConfigService();
	let containerBindStub: SinonStub;
	let containerValueSpy: SinonSpy;

	beforeEach(() => {
		container = new Container();
		global.sandbox.stub(InstantConfigService.prototype, 'init').resolves(instantConfigService);
		containerValueSpy = global.sandbox.spy();
		containerBindStub = global.sandbox.stub(container, 'bind').returns({
			value: containerValueSpy,
		} as unknown as Binding<any>);
	});

	it('should bind InstantConfigService to container', async () => {
		global.sandbox
			.stub(InstantConfigService.prototype, 'get')
			.withArgs('icPrebid')
			.returns(false)
			.withArgs('icAudigent')
			.returns(false);
		const instantConfigSetup = new InstantConfigSetup(container);

		await instantConfigSetup.execute();

		expect(containerBindStub.calledWithExactly(InstantConfigService)).to.be.true;
		expect(containerValueSpy.calledWithExactly(instantConfigService)).to.be.true;
	});

	it('should preloadLibraries', async () => {
		global.sandbox
			.stub(InstantConfigService.prototype, 'get')
			.withArgs('icPrebid')
			.returns(true)
			.withArgs('icAudigent')
			.returns(true)
			.withArgs('icPrebidIntentIQ')
			.returns(true);
		const contextSetStub = global.sandbox.stub(context, 'set');
		const pbjsFactoryInitStub = global.sandbox.stub(pbjsFactory, 'init').resolvesThis();
		const audigentLoadSegmentLibraryStub = global.sandbox
			.stub(Audigent, 'loadSegmentLibrary')
			.resolvesThis();
		const intentIqStub = global.sandbox.stub(intentIQ, 'load').resolvesThis();
		const instantConfigSetup = new InstantConfigSetup(container);

		await instantConfigSetup.execute();

		expect(contextSetStub.calledOnceWith('bidders.prebid.libraryUrl')).to.be.true;
		expect(pbjsFactoryInitStub.calledOnce).to.be.true;
		expect(intentIqStub.calledOnce).to.be.true;
		expect(audigentLoadSegmentLibraryStub.calledOnce).to.be.true;
	});
});
