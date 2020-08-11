import { DynamicSlotsSetup, slotsContext } from '@platforms/shared';
import { communicationService, globalAction, ofType } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { take } from 'rxjs/operators';
import { props } from 'ts-action';

interface AdSlotInjectedProps {
	slotId: string;
}

export const adSlotInjected = globalAction(
	'[BingeBot] ad slot injected',
	props<AdSlotInjectedProps>(),
);

@Injectable()
export class BingeBotDynamicSlotsSetup implements DynamicSlotsSetup {
	execute(): void {
		communicationService.action$
			.pipe(ofType(adSlotInjected), take(1))
			.subscribe(() => this.setSlotState('sponsored_logo'));
	}

	private setSlotState(slotId): void {
		slotsContext.setState(slotId, true);
	}
}
