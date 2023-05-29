import { Ats } from '@wikia/ad-bidders';
import { context, utils } from '@wikia/core';
import { expect } from 'chai';
import { container } from 'tsyringe';

describe('ATS', () => {
	const ats = container.resolve(Ats);
	let loadScriptStub;

	beforeEach(() => {
		loadScriptStub = global.sandbox
			.stub(utils.scriptLoader, 'loadScript')
			.returns(Promise.resolve({} as any));

		(window as any).ats = {
			start: () => ({}),
			retrieveEnvelope: () => ({}),
		};

		context.set('bidders.liveRampATS.enabled', true);
		context.set('options.optOutSale', false);
		context.set('options.trackingOptIn', true);
		context.set('wiki.targeting.directedAtChildren', false);
		context.set('wiki.opts.userEmailHashes', ['hash1', 'hash2', 'hash3']);
		context.set('state.isLogged', true);
	});

	it('ATS.js is called', async () => {
		await ats.call();

		expect(loadScriptStub.called).to.equal(true);
	});

	it('ATS is disabled by feature flag', async () => {
		context.set('bidders.liveRampATS.enabled', false);

		await ats.call();

		expect(loadScriptStub.called).to.equal(false);
	});

	it('ATS is disabled if user has opted out sale', async () => {
		context.set('options.optOutSale', true);

		await ats.call();

		expect(loadScriptStub.called).to.equal(false);
	});

	it('ATS is disabled on child-directed wiki', async () => {
		context.set('wiki.targeting.directedAtChildren', true);

		await ats.call();

		expect(loadScriptStub.called).to.equal(false);
	});

	it('ATS is not loaded when there is no user email in context', async () => {
		context.set('wiki.opts.userEmailHashes', undefined);

		await ats.call();

		expect(loadScriptStub.called).to.equal(false);
	});
});
