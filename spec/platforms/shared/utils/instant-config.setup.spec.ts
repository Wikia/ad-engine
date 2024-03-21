import { InstantConfigService } from '@wikia/core';
import { Binding, Container } from '@wikia/dependency-injection';
import { InstantConfigSetup } from '@wikia/platforms/shared';
import { expect } from 'chai';
import { SinonSpy, SinonStub } from 'sinon';

describe('InstantConfigSetup', () => {
	let container;
	const instantConfigService = new InstantConfigService({
		appName: 'testapp',
	});
	let containerBindStub: SinonStub;
	let containerValueSpy: SinonSpy;

	beforeEach(() => {
		container = new Container();
		global.sandbox.stub(InstantConfigService.prototype, 'init').resolves(instantConfigService);
		containerValueSpy = global.sandbox.spy();
		containerBindStub = global.sandbox.stub(container, 'bind').returns({
			value: containerValueSpy,
		} as unknown as Binding<any>);
		window.ads = {
			...window.ads,
			context: {
				app: 'testapp',
			},
		};
	});

	it('should bind InstantConfigService to container', async () => {
		global.sandbox.stub(InstantConfigService.prototype, 'get').withArgs('icPrebid').returns(false);
		const instantConfigSetup = new InstantConfigSetup(container);

		await instantConfigSetup.execute();

		expect(containerBindStub.calledWithExactly(InstantConfigService)).to.be.true;
		expect(containerValueSpy.calledWithExactly(instantConfigService)).to.be.true;
	});
});
