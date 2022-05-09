import { optimera } from '@wikia/ad-services';
import { expect } from 'chai';
import { createSandbox } from 'sinon';
import { context, utils } from '../../../src/ad-engine/index';

describe('Optimera', () => {
	const sandbox = createSandbox();
	let contextStub;
	let loadScriptStub;

	beforeEach(() => {
		loadScriptStub = sandbox
			.stub(utils.scriptLoader, 'loadScript')
			.returns(Promise.resolve({} as any));
		contextStub = sandbox.stub(context);
	});

	afterEach(() => {
		sandbox.restore();
	});

	it('loads script when enabled', async () => {
		contextStub.get.withArgs('services.optimera.enabled').returns(true);

		await optimera.call();

		expect(loadScriptStub.called).to.equal(true);
	});

	it('does not load script when disabled', async () => {
		contextStub.get.withArgs('services.optimera.enabled').returns(false);

		await optimera.call();

		expect(loadScriptStub.called).to.equal(false);
	});
});
