import { TemplateStateHandler, TemplateTransition } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { fromEvent, Subject } from 'rxjs';
import { skip, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { PlayerRegistry } from '../../helpers/player-registry';

/**
 * Transition to impact when video is restarted
 */
@Injectable({ autobind: false })
export class VideoRestartHandler implements TemplateStateHandler {
	private destroy$ = new Subject();

	constructor(private playerRegistry: PlayerRegistry) {}

	async onEnter(transition: TemplateTransition<'impact'>): Promise<void> {
		this.playerRegistry.video$
			.pipe(
				take(1),
				switchMap(({ player }) => fromEvent(player, 'wikiaAdStarted').pipe(skip(1))),
				tap(() => transition('impact', { allowMulticast: true })),
				takeUntil(this.destroy$),
			)
			.subscribe();
	}

	async onDestroy(): Promise<void> {
		this.destroy$.next();
		this.destroy$.complete();
	}
}
