import { Stroer } from '@wikia/ad-services';
import { context, utils } from '@wikia/core';
import { expect } from 'chai';
import { createSandbox } from 'sinon';

describe('Stroer', () => {
	const sandbox = createSandbox();
	const stroer = new Stroer();
	let loadScriptStub;

	beforeEach(() => {
		loadScriptStub = sandbox
			.stub(utils.scriptLoader, 'loadScript')
			.returns(Promise.resolve({} as any));
	});

	afterEach(() => {
		sandbox.restore();
	});

	it('Stroer is created', async () => {
		context.set('services.stroer.enabled', true);

		await stroer.call();

		expect(loadScriptStub.called).to.equal(true);
	});

	it('Stroer is disabled', async () => {
		context.set('services.stroer.enabled', false);

		await stroer.call();

		expect(loadScriptStub.called).to.equal(false);
	});
});
