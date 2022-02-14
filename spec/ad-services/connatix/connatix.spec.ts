import { connatix } from '@wikia/ad-services';
import { expect } from 'chai';
import { createSandbox } from 'sinon';
import { context, utils } from '../../../src/ad-engine/index';

describe('Connatix', () => {
	const sandbox = createSandbox();
	const placeholder = document.createElement('div');
	let loadScriptStub;

	beforeEach(() => {
		loadScriptStub = sandbox
			.stub(utils.scriptLoader, 'loadScript')
			.returns(Promise.resolve({} as any));
		sandbox.stub(document, 'getElementById').returns(placeholder);

		window.cnx = {
			cmd: {
				push: () => {},
			},
		};
	});

	afterEach(() => {
		sandbox.restore();
	});

	it('Connatix is called', async () => {
		context.set('services.connatix.enabled', true);

		await connatix.call();

		expect(loadScriptStub.called).to.equal(true);
	});

	it('Connatix is disabled', async () => {
		context.set('services.connatix.enabled', false);

		await connatix.call();

		expect(loadScriptStub.called).to.equal(false);
	});

	it('Connatix is called', async () => {
		context.set('services.connatix.enabled', true);

		await connatix.call();

		expect(loadScriptStub.called).to.equal(true);
	});
});
