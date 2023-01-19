import { DurationMedia } from '@wikia/ad-services';
import { context, InstantConfigService, utils } from '@wikia/core';
import { expect } from 'chai';
import { createSandbox } from 'sinon';

describe('Duration media service', () => {
	const sandbox = createSandbox();
	let durationMedia: DurationMedia;
	let loadScriptStub, instantConfigStub;

	beforeEach(() => {
		loadScriptStub = sandbox
			.stub(utils.scriptLoader, 'loadScript')
			.returns(Promise.resolve({} as any));
		instantConfigStub = sandbox.createStubInstance(InstantConfigService);
		instantConfigStub.get.withArgs('icDurationMedia').returns(undefined);

		context.remove('services.durationMedia.libraryUrl');

		durationMedia = new DurationMedia(instantConfigStub);
	});

	afterEach(() => {
		sandbox.restore();
	});

	it('duration-media is disabled when libraryUrl is not configured', async () => {
		instantConfigStub.get.withArgs('icDurationMedia').returns(true);

		await durationMedia.call();

		expect(loadScriptStub.called).to.equal(false);
	});

	it('duration-media can be disabled', async () => {
		context.set('services.durationMedia.libraryUrl', '//example.com/foo');

		await durationMedia.call();

		expect(loadScriptStub.called).to.equal(false);
	});

	it('duration-media is called', async () => {
		instantConfigStub.get.withArgs('icDurationMedia').returns(true);
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
