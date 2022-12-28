import { expect } from 'chai';
import { createSandbox } from 'sinon';

import { context, utils } from '../../../src/core';
import { btRec } from '../../../src/ad-services/bt-rec';

describe('BlockThrough recovery', () => {
	const sandbox = createSandbox();

	let loadScriptStub;

	beforeEach(() => {
		loadScriptStub = sandbox.stub(utils.scriptLoader, 'loadScript');
		context.set('options.wad.btRec.enabled', true);
		context.set('options.wad.blocking', true);
	});

	afterEach(() => {
		sandbox.restore();
		loadScriptStub.resetHistory();

		context.remove('options.wad.btRec.enabled');
		context.remove('options.wad.blocking');
	});

	it('BlockThrough loads assets when enabled', async () => {
		loadScriptStub.returns(Promise.resolve());

		return await btRec.run().then(() => {
			expect(loadScriptStub.called).to.equal(true);
		});
	});

	it('BlockThrough can be disabled', async () => {
		context.set('options.wad.btRec.enabled', false);

		return await btRec.run().then(() => {
			expect(loadScriptStub.called).to.equal(false);
		});
	});

	it('BlockThrough is disabled when there is no ad-block detected', async () => {
		context.set('options.wad.blocking', false);

		return await btRec.run().then(() => {
			expect(loadScriptStub.called).to.equal(false);
		});
	});
});
