import {
	communicationService,
	context,
	DiProcess,
	globalAction,
	ofType,
	slotService,
	TemplateRegistry,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { props } from 'ts-action';

interface AdSlotInjectedProps {
	slotId: string;
}

const adSlotInjected = globalAction('[BingeBot] ad slot injected', props<AdSlotInjectedProps>());

const destroyAdSlot = globalAction('[BingeBot] destroy ad slot', props<AdSlotInjectedProps>());

@Injectable()
export class BingeBotDynamicSlotsSetup implements DiProcess {
	constructor(private templateRegistry: TemplateRegistry) {}

	execute(): void {
		communicationService.action$.pipe(ofType(adSlotInjected)).subscribe((action) => {
			this.setAdStack(action.slotId);
		});

		communicationService.action$.pipe(ofType(destroyAdSlot)).subscribe((action) => {
			const adSlot = slotService.get(action.slotId);

			this.templateRegistry.destroy(action.slotId);
			slotService.remove(adSlot);
		});
	}

	private setAdStack(slotId): void {
		context.push('state.adStack', { id: slotId });
	}
}
