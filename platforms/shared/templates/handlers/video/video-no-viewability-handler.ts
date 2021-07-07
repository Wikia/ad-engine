import {
	AdSlot,
	communicationService,
	globalAction,
	ofType,
	TEMPLATE,
	TemplateStateHandler,
} from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { filter, take } from 'rxjs/operators';

/**
 * Transition to impact when video clicked to play
 */
@Injectable({ autobind: false })
export class VideoNoViewabilityHandler implements TemplateStateHandler {
	constructor(
		@Inject(TEMPLATE.SLOT) private adSlot: AdSlot,
	) {}

	async onEnter(): Promise<void> {
		communicationService.action$
			.pipe(
				ofType(globalAction('[AdEngine] Porvata Started')),
				filter(() => !this.adSlot.slotViewed),
				take(1)
			)
			.subscribe(() => console.log('bfaa shoukd pause'));
	}
}
