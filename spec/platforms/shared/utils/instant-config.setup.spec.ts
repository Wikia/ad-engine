import { context, InstantConfigService, pbjsFactory } from '@wikia/core';
import { InstantConfigSetup } from '@wikia/platforms/shared';
import { expect } from 'chai';
import { SinonStub } from 'sinon';
import { container } from 'tsyringe';

describe('InstantConfigSetup', () => {
	const instantConfigService = new InstantConfigService();
	let containerBindStub: SinonStub;

	beforeEach(() => {
		global.sandbox.stub(InstantConfigService.prototype, 'init').resolves(instantConfigService);
		containerBindStub = global.sandbox.stub(container, 'register');
	});

	it('should bind InstantConfigService to container', async () => {
		global.sandbox
			.stub(InstantConfigService.prototype, 'get')
			.withArgs('icPrebid')
			.returns(false)
			.withArgs('icAudigent')
			.returns(false);
		const instantConfigSetup = new InstantConfigSetup();

		await instantConfigSetup.execute();

		expect(
			containerBindStub.calledWithExactly(InstantConfigService, { useValue: instantConfigService }),
		).to.be.true;
	});

	it('should preloadLibraries', async () => {
		global.sandbox
			.stub(InstantConfigService.prototype, 'get')
			.withArgs('icPrebid')
			.returns(true)
			.withArgs('icAudigent')
			.returns(true);
		const contextSetStub = global.sandbox.stub(context, 'set');
		const pbjsFactoryInitStub = global.sandbox.stub(pbjsFactory, 'init');
		const instantConfigSetup = new InstantConfigSetup();

		await instantConfigSetup.execute();

		expect(contextSetStub.calledOnceWith('bidders.prebid.libraryUrl')).to.be.true;
		expect(pbjsFactoryInitStub.calledOnce).to.be.true;
	});
});
