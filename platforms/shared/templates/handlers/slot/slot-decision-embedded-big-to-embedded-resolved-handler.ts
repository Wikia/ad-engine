import { TemplateStateHandler, TemplateTransition } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { fromEvent, Subject } from 'rxjs';
import { switchMap, takeUntil, tap } from 'rxjs/operators';
import { PlayerRegistry } from '../../helpers/player-registry';

@Injectable({ autobind: false })
export class SlotDecisionEmbeddedBigToEmbeddedResolvedHandler implements TemplateStateHandler {
	private unsubscribe$ = new Subject<void>();

	constructor(private playerRegistry: PlayerRegistry) {}

	async onEnter(transition: TemplateTransition<'embeddedResolved'>): Promise<void> {
		this.playerRegistry.video$
			.pipe(
				switchMap(({ player }) => fromEvent(player, 'wikiaAdCompleted')),
				tap(() => transition('embeddedResolved')),
				takeUntil(this.unsubscribe$),
			)
			.subscribe();
	}

	async onLeave(): Promise<void> {
		this.unsubscribe$.next();
	}
}
