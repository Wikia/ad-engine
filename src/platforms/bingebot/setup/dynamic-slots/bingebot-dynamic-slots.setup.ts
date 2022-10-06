import {
	communicationService,
	context,
	DiProcess,
	eventsRepository,
	slotService,
	TemplateRegistry,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class BingeBotDynamicSlotsSetup implements DiProcess {
	constructor(private templateRegistry: TemplateRegistry) {}

	execute(): void {
		communicationService.on(
			eventsRepository.BINGEBOT_AD_SLOT_INJECTED,
			(action) => {
				this.setAdStack(action.slotId);
			},
			false,
		);

		communicationService.on(
			eventsRepository.BINGEBOT_DESTROY_AD_SLOT,
			(action) => {
				const adSlot = slotService.get(action.slotId);

				this.templateRegistry.destroy(action.slotId);
				slotService.remove(adSlot);
			},
			false,
		);
	}

	private setAdStack(slotId): void {
		context.push('state.adStack', { id: slotId });
	}
}
