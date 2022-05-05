import { optimera } from '@wikia/ad-services';
import { assert, expect } from 'chai';
import { createSandbox } from 'sinon';
import { context } from '../../../src/ad-engine/index';

describe('Optimera', () => {
	const sandbox = createSandbox();
	let contextStub;
	let loadScriptStub;

	beforeEach(() => {
		loadScriptStub = sandbox.stub(optimera, 'loadScript').returns(Promise.resolve({} as any));
		contextStub = sandbox.stub(context);
	});

	afterEach(() => {
		sandbox.restore();
	});

	it('loads optimera script when enabled', async () => {
		contextStub.get.withArgs('services.optimera.enabled').returns(true);

		await optimera.call();

		expect(loadScriptStub.called).to.equal(true);
	});

	it('returns rejected promise when disabled', async () => {
		contextStub.get.withArgs('services.optimera.enabled').returns(false);

		return await optimera.call().then(
			() => assert(false),
			() => assert(true),
		);
	});

	it('setTargeting is called when script is laoded', async () => {
		contextStub.get.withArgs('services.optimera.enabled').returns(true);

		const setTargetingStub = sandbox.stub(optimera, 'setTargeting');

		await optimera.call();

		expect(loadScriptStub.called).to.equal(true);
		expect(setTargetingStub.called).to.equal(true);
	});
});
