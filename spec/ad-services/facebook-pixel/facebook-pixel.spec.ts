import { expect } from 'chai';
import { createSandbox } from 'sinon';
import { context } from '../../../src/ad-engine';
import { facebookPixel } from '../../../src/ad-services';

describe('Facebook pixel', () => {
	const sandbox = createSandbox();
	let loadScriptStub;

	beforeEach(() => {
		loadScriptStub = sandbox.stub(facebookPixel, 'setup');
		context.set('services.facebookPixel.enabled', true);
		context.set('options.trackingOptIn', true);
		context.set('options.optOutSale', false);
		context.set('wiki.targeting.directedAtChildren', false);
	});

	afterEach(() => {
		sandbox.restore();
	});

	it('Facebook pixel is created', async () => {
		await facebookPixel.call();

		expect(loadScriptStub.called).to.equal(true);
	});

	it('Facebook pixel can be disabled', async () => {
		context.set('services.facebookPixel.enabled', false);

		await facebookPixel.call();

		expect(loadScriptStub.called).to.equal(false);
	});

	it('Facebook pixel not created when user is not opted in', async () => {
		context.set('options.trackingOptIn', false);

		await facebookPixel.call();

		expect(loadScriptStub.called).to.equal(false);
	});

	it('Facebook pixel not created when user has opted out sale', async () => {
		context.set('options.optOutSale', true);

		await facebookPixel.call();

		expect(loadScriptStub.called).to.equal(false);
	});

	it('Facebook pixel not created on kid wikis', async () => {
		context.set('wiki.targeting.directedAtChildren', true);

		await facebookPixel.call();

		expect(loadScriptStub.called).to.equal(false);
	});
});
