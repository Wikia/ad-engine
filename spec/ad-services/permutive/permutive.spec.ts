import { expect } from 'chai';
import { createSandbox } from 'sinon';
import { context, utils } from '../../../src/ad-engine';
import { permutive } from '../../../src/ad-services';

describe('Permutive integration', () => {
	const sandbox = createSandbox();
	let loadScriptStub;

	// @ts-ignore
	window.localStorage = {
		_psegs: '[1, 2, 3, 1000000, 1000001, 999999, 0, -7]',
		_ppam: '["123", "456"]',

		getItem(key: string): string | null {
			return this[key];
		},
	};

	beforeEach(() => {
		loadScriptStub = sandbox
			.stub(utils.scriptLoader, 'loadScript')
			.returns(Promise.resolve({} as any));
		context.set('services.permutive.enabled', true);
		context.set('options.trackingOptIn', true);
		context.set('options.optOutSale', false);
		context.set('wiki.targeting.directedAtChildren', false);
	});

	afterEach(() => {
		sandbox.restore();
	});

	it('Permutive is called', async () => {
		await permutive.call();

		expect(loadScriptStub.called).to.equal(true);
	});

	it('Permutive can be disabled', async () => {
		context.set('services.Permutive.enabled', false);

		await permutive.call();

		expect(loadScriptStub.called).to.equal(false);
	});

	it('Permutive not called when user is not opted in', async () => {
		context.set('options.trackingOptIn', false);

		await permutive.call();

		expect(loadScriptStub.called).to.equal(false);
	});

	it('Permutive not called when user has opted out sale', async () => {
		context.set('options.optOutSale', true);

		await permutive.call();

		expect(loadScriptStub.called).to.equal(false);
	});

	it('Permutive not called on kid wikis', async () => {
		context.set('wiki.targeting.directedAtChildren', true);

		await permutive.call();

		expect(loadScriptStub.called).to.equal(false);
	});

	it('Permutive keys for AppNexus set in context', async () => {
		await permutive.call();

		const permutiveKeys = context.get('bidders.permutiveKeys.appnexus');

		expect(permutiveKeys).to.eql(['1000000', '1000001', '123', '456']);
	});

	it('No Permutive keys for AppNexus set in context', async () => {
		// @ts-ignore
		window.localStorage = {
			getItem(key: string): string | null {
				return this[key];
			},
		};

		await permutive.call();

		const permutiveKeys = context.get('bidders.permutiveKeys.appnexus');

		expect(permutiveKeys).to.eql([]);
	});

	it('Permutive pass src in correct format', () => {
		context.set('src', 'gpt');
		expect(permutive.getSrcFromContext()).to.equal('gpt');

		context.set('src', ['gpt', 'uap', 'whatever']);
		expect(permutive.getSrcFromContext()).to.equal('gpt');

		context.set('src', null);
		expect(permutive.getSrcFromContext()).to.equal('');
	});
});
