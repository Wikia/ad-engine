import {
	AdSlot,
	TEMPLATE,
	TemplateStateHandler,
	TemplateTransition,
	universalAdPackage,
} from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { fromEvent, Subject } from 'rxjs';
import { switchMap, takeUntil, tap } from 'rxjs/operators';
import { PlayerRegistry } from '../../helpers/player-registry';

/**
 * Transition to resolved when video completes
 */
@Injectable({ autobind: false })
export class VideoCompletedHandler implements TemplateStateHandler {
	private unsubscribe$ = new Subject<void>();

	constructor(
		@Inject(TEMPLATE.SLOT) private adSlot: AdSlot,
		private playerRegistry: PlayerRegistry,
	) {}

	async onEnter(transition: TemplateTransition<'resolved'>): Promise<void> {
		this.playerRegistry.video$
			.pipe(
				switchMap(({ player }) => fromEvent(player, 'wikiaAdCompleted')),
				tap(() => {
					this.adSlot.emitEvent(universalAdPackage.SLOT_VIDEO_DONE);
					transition('resolved');
				}),
				takeUntil(this.unsubscribe$),
			)
			.subscribe();
	}

	async onLeave(): Promise<void> {
		this.unsubscribe$.next();
	}
}
