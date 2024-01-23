import { Anyclip, Connatix } from '@wikia/ad-services';
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

	const ucpMobileExperiments = {
		getConfig: () => {
			return {
				anchorSelector: '.mobile-main-page__wiki-description',
				insertMethod: 'after',
			};
		},
	} as any;

	const slotDefinitionRepositoryMock = new UcpMobileSlotsDefinitionRepository(
		instantConfig,
		openWebService,
		ucpMobileExperiments,
	);
	const nativoDefinitionRepositoryMock = new NativoSlotsDefinitionRepository(new DomListener());
	const quizDefinitionRepositoryMock = new QuizSlotsDefinitionRepository();
	const anyclipMock = new Anyclip();
	const connatixMock = new Connatix(null, null, null, null);
	const galleryLightboxAdsMock = {
		handler: new GalleryLightboxAdsHandler(
			new UcpMobileSlotsDefinitionRepository(instantConfig, openWebService, ucpMobileExperiments),
		),
		initialized: true,
	};
	const instantConfigStub = createStubInstance(InstantConfigService);
	let anyclipDisableFloatingSpy, anyclipEnableFloatingSpy;

	before(() => {
		context.set('slots.incontent_boxad_1', {});
		context.set('slots.mobile_prefooter', {});

		global.sandbox.stub(WaitFor.prototype, 'until').returns(Promise.resolve());

		anyclipDisableFloatingSpy = global.sandbox.spy(anyclipMock, 'disableFloating');
		anyclipEnableFloatingSpy = global.sandbox.spy(anyclipMock, 'enableFloating');
	});

	after(() => {
		context.remove('custom.hasFeaturedVideo');
		context.remove('slots.incontent_boxad_1');
		context.remove('slots.mobile_prefooter');

		global.sandbox.restore();

		anyclipDisableFloatingSpy.resetHistory();
		anyclipEnableFloatingSpy.resetHistory();
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

	it("is not disabling Anyclip's floating feature when Anyclip does not load", () => {
		context.set('custom.hasFeaturedVideo', false);

		prepareAndExecuteDynamicSlotSetup();

		assert.notCalled(anyclipDisableFloatingSpy);
	});

	it("is not disabling Anyclip's floating state when floor_adhesion gets collapsed", () => {
		const floorAdhesionAdSlotMock = new AdSlot({ id: 'floor_adhesion' });
		context.set('custom.hasFeaturedVideo', false);

		prepareAndExecuteDynamicSlotSetup();
		communicationService.emit(eventsRepository.ANYCLIP_READY);
		floorAdhesionAdSlotMock.emit(AdSlotStatus.STATUS_COLLAPSE);

		assert.notCalled(anyclipDisableFloatingSpy);
		assert.called(anyclipEnableFloatingSpy);
	});

	it("is disabling Anyclip's floating state when floor_adhesion gets success", () => {
		const floorAdhesionAdSlotMock = new AdSlot({ id: 'floor_adhesion' });
		context.set('custom.hasFeaturedVideo', false);

		prepareAndExecuteDynamicSlotSetup();
		communicationService.emit(eventsRepository.ANYCLIP_READY);
		floorAdhesionAdSlotMock.emit(AdSlotStatus.STATUS_SUCCESS);

		assert.called(anyclipDisableFloatingSpy);
	});

	function prepareAndExecuteDynamicSlotSetup() {
		const dynamicSlotSetup = new UcpMobileDynamicSlotsSetup(
			slotDefinitionRepositoryMock,
			nativoDefinitionRepositoryMock,
			quizDefinitionRepositoryMock,
			anyclipMock,
			connatixMock,
			galleryLightboxAdsMock,
			instantConfigStub,
		);

		dynamicSlotSetup.execute();
	}
});
