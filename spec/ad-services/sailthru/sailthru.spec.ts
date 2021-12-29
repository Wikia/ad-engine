import { utils } from '@wikia/ad-engine';
import { packageUrl, sailthru } from '@wikia/ad-services';
import { expect } from 'chai';
import { createSandbox } from 'sinon';

describe('Sailthru', () => {
	const sandbox = createSandbox();
	let loadScriptStub;
	let sailthruInitStub;

	beforeEach(() => {
		window.Sailthru = {
			init: () => {},
		};

		loadScriptStub = sandbox
			.stub(utils.scriptLoader, 'loadScript')
			.returns(Promise.resolve({} as any));

		sailthruInitStub = sandbox.stub(window.Sailthru, 'init').callsFake(() => Promise.resolve());
	});

	afterEach(() => {
		sandbox.restore();
		delete window.Sailthru;
	});

	it('Sailthru is called', async () => {
		await sailthru.call();

		expect(await loadScriptStub.calledWith(packageUrl, 'text/javascript', true, 'first')).to.equal(
			true,
		);

		expect(await sailthruInitStub.called).to.be.true;
	});
});
