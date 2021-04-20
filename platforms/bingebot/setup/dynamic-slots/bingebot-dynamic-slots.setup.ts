import {
	communicationService,
	context,
	DiProcess,
	ofType,
	slotService,
	TemplateRegistry,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { adSlotInjected, destroyAdSlot } from '../../setup-bingebot';

@Injectable()
export class BingeBotDynamicSlotsSetup implements DiProcess {
	constructor(private templateRegistry: TemplateRegistry) {}

	execute(): void {
		communicationService.action$.pipe(ofType(adSlotInjected)).subscribe((action) => {
			context.push('state.adStack', { id: action.slotId });
		});

		communicationService.action$.pipe(ofType(destroyAdSlot)).subscribe((action) => {
			this.destroyAdSlot(action.slotId);
		});
	}

	private destroyAdSlot(slotId: string): void {
		const adSlot = slotService.get(slotId);

		this.templateRegistry.destroy(slotId);
		slotService.remove(adSlot);
	}
}
