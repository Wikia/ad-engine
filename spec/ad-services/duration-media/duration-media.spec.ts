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
		context.remove('services.durationMedia.libraryUrl');
		context.remove('services.durationMedia.enabled');
	});

	afterEach(() => {
		sandbox.restore();
	});

	it('duration-media is disabled when libraryUrl is not configured', async () => {
		context.set('services.durationMedia.enabled', true);

		await durationMedia.call();

		expect(loadScriptStub.called).to.equal(false);
	});

	it('duration-media can be disabled', async () => {
		context.set('services.durationMedia.libraryUrl', '//example.com/foo');

		await durationMedia.call();

		expect(loadScriptStub.called).to.equal(false);
	});

	it('duration-media is called', async () => {
		context.set('services.durationMedia.enabled', true);
		context.set('services.durationMedia.libraryUrl', '//example.com/foo');

		await durationMedia.call();

		expect(loadScriptStub.called).to.equal(true);
		expect(
			loadScriptStub.calledWith('//example.com/foo', 'text/javascript', true, null, {
				id: 'dm-script',
			}),
		).to.equal(true);
	});
});
