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
		this.videoTransitionHandler(transition);
		this.staticTransitionHandler(transition);
	}

	async onLeave(): Promise<void> {
		this.unsubscribe$.next();
	}

	private async videoTransitionHandler(
		transition: TemplateTransition<'embeddedResolved'>,
	): Promise<void> {
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
	}

	private async staticTransitionHandler(
		transition: TemplateTransition<'embeddedResolved'>,
	): Promise<void> {
		this.timeout
			.isViewedAndDelayed()
			.pipe(
				filter((viewedAndDelayed) => !this.isVideo && viewedAndDelayed),
				tap(() => transition('embeddedResolved')),
				takeUntil(this.unsubscribe$),
			)
			.subscribe();
	}
}
