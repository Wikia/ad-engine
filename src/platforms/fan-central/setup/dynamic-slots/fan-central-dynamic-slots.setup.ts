import { insertSlots, slotsContext, SlotSetupDefinition } from '@platforms/shared';
import {
	communicationService,
	context,
	DiProcess,
	eventsRepository,
	UapLoadStatus,
	universalAdPackage,
	utils,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { FanCentralSlotsDefinitionRepository } from './fan-central-slots-definition-repository';

@Injectable()
export class FanCentralDynamicSlotsSetup implements DiProcess {
	constructor(private slotsDefinitionRepository: FanCentralSlotsDefinitionRepository) {}

	execute(): void {
		this.injectSlots();
	}

	private injectSlots(): void {
		this.insertSlotIfReady(this.slotsDefinitionRepository.getTopLeaderboardConfig());
		this.insertSlotIfReady(this.slotsDefinitionRepository.getIncontentNativeConfig());

		communicationService.on(eventsRepository.AD_ENGINE_UAP_LOAD_STATUS, (action: UapLoadStatus) => {
			if (action.isLoaded) {
				this.configureTopLeaderboardAndCompanions();
				this.insertSlotIfReady(this.slotsDefinitionRepository.getTopBoxadConfig());
			}
		});

		communicationService.on(eventsRepository.AD_ENGINE_UAP_NTC_LOADED, () =>
			this.insertSlotIfReady(this.slotsDefinitionRepository.getFloorAdhesionConfig()),
		);
	}

	private insertSlotIfReady(slotDefinition: SlotSetupDefinition) {
		if (!slotDefinition) {
			return;
		}

		if (document.querySelector(slotDefinition.slotCreatorConfig.anchorSelector)) {
			insertSlots([slotDefinition]);
			return;
		}

		new utils.WaitFor(
			() => !!document.querySelector(slotDefinition.slotCreatorConfig.anchorSelector),
			100,
			0,
			100,
		)
			.until()
			.then(() => {
				insertSlots([slotDefinition]);
			});
	}

	private configureTopLeaderboardAndCompanions(): void {
		if (context.get('state.isMobile')) {
			slotsContext.addSlotSize(
				'top_boxad',
				universalAdPackage.UAP_ADDITIONAL_SIZES.companionSizes['4x4'].size,
			);
		} else {
			slotsContext.addSlotSize(
				'top_boxad',
				universalAdPackage.UAP_ADDITIONAL_SIZES.companionSizes['5x5'].size,
			);
		}
	}
}
