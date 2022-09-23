import { expect } from 'chai';
import { createSandbox } from 'sinon';
import { context } from '@wikia/ad-engine';
import { liveRampPixel } from '@wikia/ad-services';

describe('LiveRamp pixel', () => {
	const sandbox = createSandbox();
	let loadScriptStub;

	beforeEach(() => {
		loadScriptStub = sandbox.stub(liveRampPixel, 'insertLiveRampPixel');
		context.set('services.liveRampPixel.enabled', true);
		context.set('wiki.targeting.directedAtChildren', false);
	});

	afterEach(() => {
		sandbox.restore();
	});

	it('LiveRamp pixel is created', async () => {
		await liveRampPixel.call();

		expect(loadScriptStub.called).to.equal(true);
	});

	it('LiveRamp pixel can be disabled', async () => {
		context.set('services.liveRampPixel.enabled', false);

		await liveRampPixel.call();

		expect(loadScriptStub.called).to.equal(false);
	});

	it('LiveRamp pixel not created on kid wikis', async () => {
		context.set('wiki.targeting.directedAtChildren', true);

		await liveRampPixel.call();

		expect(loadScriptStub.called).to.equal(false);
	});
});
