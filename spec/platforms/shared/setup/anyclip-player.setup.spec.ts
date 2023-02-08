import { expect } from 'chai';
import { BehaviorSubject } from 'rxjs';
import { createSandbox } from 'sinon';

import { communicationService, eventsRepository, UapLoadStatus } from '@wikia/communication';
import { context } from '@wikia/core';
import { AnyclipPlayerSetup } from '@wikia/platforms/shared';

describe('AnyclipPlayerSetup', () => {
	const anyclipPlayerSetup = new AnyclipPlayerSetup();

	const sandbox = createSandbox();
	const mockedIsApplicable = sandbox.spy();
	// const mockedSlotServiceGetStub = sandbox.stub( slotService, 'get' );
	const mockedUapNotLoadedPayload: UapLoadStatus = { isLoaded: false, adProduct: 'test' };
	const mockedUapLoadedPayload: UapLoadStatus = { isLoaded: true, adProduct: 'test' };

	beforeEach(() => {
		context.set('services.anyclip.isApplicable', mockedIsApplicable);
	});

	afterEach(function () {
		// mockedSlotServiceGetStub.resetHistory();
		sandbox.restore();

		context.remove('services.anyclip.enabled');
		context.remove('services.anyclip.isApplicable');
		context.remove('services.anyclip.loadOnPageLoad');
		context.remove('services.anyclip.latePageInject');
	});

	it('it does not load the player when disabled in the instant-config', () => {
		context.set('services.anyclip.enabled', false);
		anyclipPlayerSetup.call();
		expect(mockedIsApplicable.called).to.equal(false);
	});

	it('it does not load the player when enabled in the instant-config but it is supposed to wait for UAP load event that never happens', () => {
		context.set('services.anyclip.enabled', true);
		context.set('services.anyclip.loadOnPageLoad', false);

		anyclipPlayerSetup.call();
		expect(mockedIsApplicable.called).to.equal(false);
	});

	it.skip('it does not load the player when enabled in the instant-config UAP load event happened but the incontent_player slot does not exist', () => {
		context.set('services.anyclip.enabled', true);
		context.set('services.anyclip.loadOnPageLoad', false);
		context.set('services.anyclip.latePageInject', false);

		// mockedSlotServiceGetStub.returns(false as any);

		sandbox
			.stub(communicationService, 'action$')
			.value(
				new BehaviorSubject(
					communicationService.getGlobalAction(eventsRepository.AD_ENGINE_UAP_LOAD_STATUS)(
						mockedUapNotLoadedPayload,
					),
				),
			);
		anyclipPlayerSetup.call();

		expect(mockedIsApplicable.called).to.equal(false);
	});

	it.skip('it does not load the player when enabled in the instant-config, UAP load event happened and UAP is on the page', () => {
		context.set('services.anyclip.enabled', true);
		context.set('services.anyclip.loadOnPageLoad', false);
		context.set('services.anyclip.latePageInject', false);

		// mockedSlotServiceGetStub.returns( new AdSlot({ id: 'incontent_player' } ) );

		sandbox
			.stub(communicationService, 'action$')
			.value(
				new BehaviorSubject(
					communicationService.getGlobalAction(eventsRepository.AD_ENGINE_UAP_LOAD_STATUS)(
						mockedUapLoadedPayload,
					),
				),
			);
		anyclipPlayerSetup.call();

		expect(mockedIsApplicable.called).to.equal(false);
	});

	it.skip('it loads the player when enabled in the instant-config, UAP load event happened, the incontent_player slot exists and is not lazy-loaded', () => {
		context.set('services.anyclip.enabled', true);
		context.set('services.anyclip.loadOnPageLoad', false);
		context.set('services.anyclip.latePageInject', false);

		// mockedSlotServiceGetStub.returns( new AdSlot({ id: 'incontent_player' } ) );

		sandbox
			.stub(communicationService, 'action$')
			.value(
				new BehaviorSubject(
					communicationService.getGlobalAction(eventsRepository.AD_ENGINE_UAP_LOAD_STATUS)(
						mockedUapNotLoadedPayload,
					),
				),
			);
		anyclipPlayerSetup.call();

		expect(mockedIsApplicable.called).to.equal(true);
	});

	it('it loads the player when enabled in the instant-config and is supposed to load on the page load', () => {
		context.set('services.anyclip.enabled', true);
		context.set('services.anyclip.loadOnPageLoad', true);

		anyclipPlayerSetup.call();
		expect(mockedIsApplicable.called).to.equal(true);
	});
});
