import { DynamicSlotsSetup } from '@platforms/shared';
import { communicationService, context, globalAction, ofType, slotService } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { props } from 'ts-action';

interface AdSlotInjectedProps {
	slotId: string;
}

export const adSlotInjected = globalAction(
	'[BingeBot] ad slot injected',
	props<AdSlotInjectedProps>(),
);

export const destroyAdSlot = globalAction(
	'[BingeBot] destroy ad slot',
	props<AdSlotInjectedProps>(),
);

@Injectable()
export class BingeBotDynamicSlotsSetup implements DynamicSlotsSetup {
	execute(): void {
		communicationService.action$
			.pipe(ofType(adSlotInjected))
			.subscribe(() => this.setAdStack('sponsored_logo'));

		communicationService.action$
			.pipe(ofType(destroyAdSlot))
			.subscribe(() => slotService.removeAll());
	}

	private setAdStack(slotId): void {
		context.push('state.adStack', { id: slotId });
	}
}
