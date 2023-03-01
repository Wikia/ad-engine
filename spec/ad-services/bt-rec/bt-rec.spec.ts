import { expect } from 'chai';

import { btRec } from '@wikia/ad-services';
import { context, utils } from '@wikia/core';

describe('BlockThrough recovery', () => {
	let loadScriptStub;

	beforeEach(() => {
		loadScriptStub = global.sandbox.stub(utils.scriptLoader, 'loadScript');
		context.set('options.wad.btRec.enabled', true);
		context.set('options.wad.blocking', true);
	});

	afterEach(() => {
		loadScriptStub.resetHistory();

		context.remove('options.wad.btRec.enabled');
		context.remove('options.wad.blocking');
		context.remove('options.wad.btRec.loaderUrl');
	});

	it('BlockThrough loads assets when enabled', async () => {
		loadScriptStub.returns(Promise.resolve());

		return await btRec.run().then(() => {
			expect(loadScriptStub.called).to.equal(true);
		});
	});

	it('BlockThrough loads assets from given URL', async () => {
		context.set('options.wad.btRec.loaderUrl', '//mock-loader-url');
		loadScriptStub.returns(Promise.resolve());

		return await btRec.run().then(() => {
			expect(loadScriptStub.called).to.equal(true);
			expect(loadScriptStub.calledWith('//mock-loader-url')).to.equal(true);
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
