import sinon, { assert } from 'sinon';
import { context, DomListener } from '@wikia/core';
import { UcpMobileDynamicSlotsSetup } from '@wikia/platforms/ucp-mobile/setup/dynamic-slots/ucp-mobile-dynamic-slots.setup';
import { UcpMobileSlotsDefinitionRepository } from '@wikia/platforms/ucp-mobile/setup/dynamic-slots/ucp-mobile-slots-definition-repository';
import {
	NativoSlotsDefinitionRepository,
	QuizSlotsDefinitionRepository,
} from '@wikia/platforms/shared';

describe('floor_adhesion on ucp-mobile', () => {
	const sandbox = sinon.createSandbox();
	const instantConfig = {
		get: () => [],
	} as any;

	const slotDefinitionRepositoryMock = new UcpMobileSlotsDefinitionRepository(instantConfig);
	const nativoDefinitionRepositoryMock = new NativoSlotsDefinitionRepository(new DomListener());
	const quizDefinitionRepositoryMock = new QuizSlotsDefinitionRepository();

	beforeEach(() => {
		sandbox.restore();
		context.set('slots.mobile_prefooter', {});
	});

	after(() => {
		context.remove('custom.hasFeaturedVideo');
		context.remove('slots.mobile_prefooter');
	});

	it('is inserted right away on page load when there is no featured video on page', () => {
		context.set('custom.hasFeaturedVideo', false);

		const getFloorAdhesionConfigSpy = sandbox.spy(
			slotDefinitionRepositoryMock,
			'getFloorAdhesionConfig',
		);
		prepareAndExecuteDynamicSlotSetup();

		assert.calledOnce(getFloorAdhesionConfigSpy);
	});

	it('is inserted after a slot injection when there is a feature video on page', () => {
		context.set('custom.hasFeaturedVideo', true);

		const getFloorAdhesionConfigSpy = sandbox.spy(
			slotDefinitionRepositoryMock,
			'getFloorAdhesionConfig',
		);
		prepareAndExecuteDynamicSlotSetup();

		assert.notCalled(getFloorAdhesionConfigSpy);
	});

	function prepareAndExecuteDynamicSlotSetup() {
		const dynamicSlotSetup = new UcpMobileDynamicSlotsSetup(
			slotDefinitionRepositoryMock,
			nativoDefinitionRepositoryMock,
			quizDefinitionRepositoryMock,
		);

		dynamicSlotSetup.execute();
	}
});
