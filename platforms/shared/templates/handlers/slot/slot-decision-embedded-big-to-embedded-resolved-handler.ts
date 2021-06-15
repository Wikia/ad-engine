import { TemplateStateHandler, TemplateTransition } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { fromEvent, Subject } from 'rxjs';
import { filter, switchMap, takeUntil, tap } from 'rxjs/operators';
import { PlayerRegistry } from '../../helpers/player-registry';
import { StickinessTimeout } from '../../helpers/stickiness-timeout';

@Injectable({ autobind: false })
export class SlotDecisionEmbeddedBigToEmbeddedResolvedHandler implements TemplateStateHandler {
	private unsubscribe$ = new Subject<void>();
	private isVideo = false;

	constructor(private timeout: StickinessTimeout, private playerRegistry: PlayerRegistry) {}

	async onEnter(transition: TemplateTransition<'embeddedResolved'>): Promise<void> {
		this.playerRegistry.video$
			.pipe(
				switchMap(({ player }) => {
					this.isVideo = true;
					return fromEvent(player, 'wikiaAdCompleted');
				}),
				tap(() => transition('embeddedResolved')),
				takeUntil(this.unsubscribe$),
			)
			.subscribe();

		this.timeout
			.isViewedAndDelayed()
			.pipe(
				filter((viewedAndDelayed) => !this.isVideo && viewedAndDelayed),
				tap(() => transition('embeddedResolved')),
				takeUntil(this.unsubscribe$),
			)
			.subscribe();
	}

	async onLeave(): Promise<void> {
		this.unsubscribe$.next();
	}
}
