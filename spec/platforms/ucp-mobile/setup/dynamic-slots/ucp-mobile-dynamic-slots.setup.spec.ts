import { Anyclip } from '@wikia/ad-services';
import { communicationService, eventsRepository } from '@wikia/communication';
import { AdSlot, AdSlotStatus, context, DomListener, InstantConfigService } from '@wikia/core';
import { WaitFor } from '@wikia/core/utils';
import {
	GalleryLightboxAdsHandler,
	NativoSlotsDefinitionRepository,
	QuizSlotsDefinitionRepository,
} from '@wikia/platforms/shared';
import { UcpMobileDynamicSlotsSetup } from '@wikia/platforms/ucp-mobile/setup/dynamic-slots/ucp-mobile-dynamic-slots.setup';
import { UcpMobileSlotsDefinitionRepository } from '@wikia/platforms/ucp-mobile/setup/dynamic-slots/ucp-mobile-slots-definition-repository';
import { assert, createStubInstance } from 'sinon';

describe('floor_adhesion on ucp-mobile', () => {
	const instantConfig = {
		get: () => [],
	} as any;

	const openWebService = {
		isActive: () => false,
	} as any;

	const slotDefinitionRepositoryMock = new UcpMobileSlotsDefinitionRepository(
		instantConfig,
		openWebService,
	);
	const nativoDefinitionRepositoryMock = new NativoSlotsDefinitionRepository(new DomListener());
	const quizDefinitionRepositoryMock = new QuizSlotsDefinitionRepository();
	const anyclipMock = new Anyclip();
	const galleryLightboxAdsMock = {
		handler: new GalleryLightboxAdsHandler(
			new UcpMobileSlotsDefinitionRepository(instantConfig, openWebService),
		),
		initialized: true,
	};
	const instantConfigStub = createStubInstance(InstantConfigService);

	before(() => {
		context.set('slots.incontent_boxad_1', {});
		context.set('slots.mobile_prefooter', {});
		global.sandbox.stub(WaitFor.prototype, 'until').returns(Promise.resolve());
	});

	after(() => {
		context.remove('custom.hasFeaturedVideo');
		context.remove('slots.incontent_boxad_1');
		context.remove('slots.mobile_prefooter');
		global.sandbox.resetHistory();
		global.sandbox.restore();
	});

	it('is inserted right away on page load when there is no featured video on page', () => {
		context.set('custom.hasFeaturedVideo', false);

		const getFloorAdhesionConfigSpy = global.sandbox.spy(
			slotDefinitionRepositoryMock,
			'getFloorAdhesionConfig',
		);
		prepareAndExecuteDynamicSlotSetup();

		assert.calledOnce(getFloorAdhesionConfigSpy);
	});

	it('is inserted after a slot injection when there is a feature video on page', () => {
		context.set('custom.hasFeaturedVideo', true);

		const getFloorAdhesionConfigSpy = global.sandbox.spy(
			slotDefinitionRepositoryMock,
			'getFloorAdhesionConfig',
		);
		prepareAndExecuteDynamicSlotSetup();

		assert.notCalled(getFloorAdhesionConfigSpy);
	});

	it("is not toggling Anyclip's floating state when Anyclip does not load", () => {
		context.set('custom.hasFeaturedVideo', false);

		const anyclipToggleFloatingSpy = global.sandbox.spy(anyclipMock, 'toggleFloating');
		prepareAndExecuteDynamicSlotSetup();

		assert.notCalled(anyclipToggleFloatingSpy);
	});

	it("is toggling Anyclip's floating state when floor_adhesion gets collapsed", () => {
		context.set('custom.hasFeaturedVideo', false);

		const floorAdhesionAdSlotMock = new AdSlot({ id: 'floor_adhesion' });
		const anyclipToggleFloatingSpy = global.sandbox.spy(anyclipMock, 'toggleFloating');
		prepareAndExecuteDynamicSlotSetup();
		communicationService.emit(eventsRepository.ANYCLIP_READY);
		floorAdhesionAdSlotMock.emit(AdSlotStatus.STATUS_COLLAPSE);

		assert.called(anyclipToggleFloatingSpy);
	});

	it("is toggling Anyclip's floating state when floor_adhesion gets registered and Anyclip loads", () => {
		context.set('custom.hasFeaturedVideo', false);

		const anyclipToggleFloatingSpy = global.sandbox.spy(anyclipMock, 'toggleFloating');
		prepareAndExecuteDynamicSlotSetup();
		communicationService.emit(eventsRepository.ANYCLIP_READY);

		assert.called(anyclipToggleFloatingSpy);
	});

	function prepareAndExecuteDynamicSlotSetup() {
		const dynamicSlotSetup = new UcpMobileDynamicSlotsSetup(
			slotDefinitionRepositoryMock,
			nativoDefinitionRepositoryMock,
			quizDefinitionRepositoryMock,
			anyclipMock,
			galleryLightboxAdsMock,
			instantConfigStub,
		);

		dynamicSlotSetup.execute();
	}
});
