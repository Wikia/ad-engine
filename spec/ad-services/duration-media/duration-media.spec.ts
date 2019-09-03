import { expect } from 'chai';
import { createSandbox } from 'sinon';
import { context, utils } from '../../../src/ad-engine';
import { durationMedia } from '../../../src/ad-services';

describe('Duration media service', () => {
	const sandbox = createSandbox();
	let loadScriptStub;

	beforeEach(() => {
		loadScriptStub = sandbox
			.stub(utils.scriptLoader, 'loadScript')
			.returns(Promise.resolve({} as any));
		context.remove('services.durationMedia.siteId');
		context.remove('services.durationMedia.enabled');
	});

	afterEach(() => {
		sandbox.restore();
	});

	it('duration-media is disabled when siteId is not configured', async () => {
		context.set('services.durationMedia.enabled', true);

		await durationMedia.call();

		expect(loadScriptStub.called).to.equal(false);
	});

	it('duration-media can be disabled', async () => {
		context.set('services.durationMedia.siteId', 'foo');

		await durationMedia.call();

		expect(loadScriptStub.called).to.equal(false);
	});

	it('duration-media is called', async () => {
		context.set('services.durationMedia.enabled', true);
		context.set('services.durationMedia.siteId', 'foo');

		await durationMedia.call();

		expect(loadScriptStub.called).to.equal(true);
		expect(
			loadScriptStub.calledWith(
				'//pr.realvu.net/flip/2/c=E4KZ_f=site_si=foo',
				'text/javascript',
				true,
			),
		).to.equal(true);
	});
});
