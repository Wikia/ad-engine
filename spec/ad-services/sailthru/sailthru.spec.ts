import { utils } from '@wikia/ad-engine';
import { packageUrl, sailthru } from '@wikia/ad-services';
import { expect } from 'chai';
import { createSandbox } from 'sinon';

describe('Sailthru', () => {
	const sandbox = createSandbox();
	let loadScriptStub;
	let sailthruInitStub;

	beforeEach(() => {
		loadScriptStub = sandbox
			.stub(utils.scriptLoader, 'loadScript')
			.returns(Promise.resolve({} as any));

		sailthruInitStub = sandbox.stub(window.Sailthru, 'init').callsFake(() => Promise.resolve());
	});

	afterEach(() => {
		sandbox.restore();
	});

	it('Sailthru is called', async () => {
		await sailthru.call();

		expect(loadScriptStub.calledWith(packageUrl, 'text/javascript', true, 'first')).to.equal(true);

		expect(sailthruInitStub.called).to.be.true;
	});
});
