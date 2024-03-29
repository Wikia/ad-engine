import { DurationMedia } from '@wikia/ad-services';
import { communicationService, eventsRepository } from '@wikia/communication';
import { context, InstantConfigService, utils } from '@wikia/core';
import { expect } from 'chai';

describe('Duration media service', () => {
	let durationMedia: DurationMedia;
	let loadScriptStub, instantConfigStub;

	beforeEach(() => {
		loadScriptStub = global.sandbox
			.stub(utils.timedPartnerScriptLoader, 'loadScriptWithStatus')
			.returns(Promise.resolve({} as any));
		instantConfigStub = global.sandbox.createStubInstance(InstantConfigService);
		instantConfigStub.get.withArgs('icDurationMedia').returns(undefined);

		context.remove('services.durationMedia.libraryUrl');

		durationMedia = new DurationMedia(instantConfigStub);
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

		communicationService.emit(eventsRepository.AD_ENGINE_GPT_READY);

		expect(loadScriptStub.called).to.equal(true);
		expect(
			loadScriptStub.calledWith('//example.com/foo', 'duration-media', false, null, {
				id: 'dm-script',
			}),
		).to.equal(true);
	});
});
