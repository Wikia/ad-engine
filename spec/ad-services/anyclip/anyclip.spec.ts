import { Anyclip } from '@wikia/ad-services';
import { context, InstantConfigService, utils } from '@wikia/core';
import { WaitFor } from '@wikia/core/utils';
import { expect } from 'chai';

describe('Anyclip', () => {
	let anyclip: Anyclip;
	let mockedIsApplicable;
	const mockIsApplicable = () => true;
	const mockIsNotApplicable = () => false;

	let loadScriptStub, instantConfigStub;

	beforeEach(() => {
		global.sandbox.stub(WaitFor.prototype, 'until').returns(Promise.resolve());
		loadScriptStub = global.sandbox.spy(utils.scriptLoader, 'loadScript');
		instantConfigStub = global.sandbox.createStubInstance(InstantConfigService);
		instantConfigStub.get.withArgs('icAnyclipPlayer').returns(true);
		mockedIsApplicable = global.sandbox.spy();
		anyclip = new Anyclip(instantConfigStub);

		context.set('custom.hasFeaturedVideo', false);
		context.set('services.anyclip.loadOnPageLoad', true);
	});

	afterEach(() => {
		loadScriptStub.resetHistory();
		global.sandbox.restore();

		context.remove('custom.hasFeaturedVideo');
		context.remove('services.anyclip.loadOnPageLoad');
		context.remove('services.anyclip.isApplicable');
	});

	it('does not load the player when disabled in the instant-config', () => {
		instantConfigStub.get.withArgs('icAnyclipPlayer').returns(false);
		context.set('services.anyclip.isApplicable', mockedIsApplicable);

		anyclip.call();
		expect(mockedIsApplicable.called).to.equal(false);
	});

	it('loads the script when isApplicable is not a function', () => {
		anyclip.call();
		expect(loadScriptStub.called).to.equal(true);
	});

	it('loads the script when isApplicable is a function and returns true', () => {
		context.set('services.anyclip.isApplicable', mockIsApplicable);

		anyclip.call();
		expect(loadScriptStub.called).to.equal(true);
	});

	it('does not load the script when isApplicable is a function and returns false', () => {
		context.set('services.anyclip.isApplicable', mockIsNotApplicable);

		anyclip.call();
		expect(loadScriptStub.called).to.equal(false);
	});

	it('does not load the player when it is supposed to wait for UAP load event that never happens', () => {
		context.set('services.anyclip.loadOnPageLoad', false);
		context.set('services.anyclip.isApplicable', mockedIsApplicable);

		anyclip.call();
		expect(mockedIsApplicable.called).to.equal(false);
	});
});
