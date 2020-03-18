import { TemplateStateHandler, TemplateTransition } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { fromEvent, Subject } from 'rxjs';
import { switchMap, takeUntil, tap } from 'rxjs/operators';
import { PlayerRegistry } from './player-registry';

@Injectable()
export class VideoImpactDecisionHandler implements TemplateStateHandler {
	private unsubscribe$ = new Subject<void>();

	constructor(private playerRegistry: PlayerRegistry) {}

	async onEnter(transition: TemplateTransition<'resolved'>): Promise<void> {
		this.playerRegistry.video$
			.pipe(
				switchMap(({ player }) => fromEvent(player, 'wikiaAdCompleted')),
				tap(() => transition('resolved')),
				takeUntil(this.unsubscribe$),
			)
			.subscribe();
	}

	async onLeave(): Promise<void> {
		this.unsubscribe$.next();
	}
}
