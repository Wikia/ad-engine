import { AdSlot, TEMPLATE, TemplateStateHandler, TemplateTransition } from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { from, fromEvent, merge, Observable, Subject } from 'rxjs';
import { delay, filter, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { PlayerRegistry } from '../../helpers/player-registry';

@Injectable({ autobind: false })
export class SlotDecisionEmbeddedBigToEmbeddedResolvedHandler implements TemplateStateHandler {
	private unsubscribe$ = new Subject<void>();
	private isVideo = false;
	private readonly viewabilityTransitionDelay = 3000;

	constructor(
		@Inject(TEMPLATE.SLOT) private adSlot: AdSlot,
		private playerRegistry: PlayerRegistry,
	) {}

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
		merge(this.getViewabilityStream())
			.pipe(
				filter(() => !this.isVideo),
				take(1),
				tap(() => transition('embeddedResolved')),
				takeUntil(this.unsubscribe$),
			)
			.subscribe();
	}

	private getViewabilityStream(): Observable<unknown> {
		return from(this.adSlot.viewed).pipe(delay(this.viewabilityTransitionDelay));
	}
}
