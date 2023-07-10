import { TemplateStateHandler, TemplateTransition } from '@wikia/ad-engine';
import { fromEvent, Subject } from 'rxjs';
import { filter, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { injectable } from 'tsyringe';
import { PlayerRegistry } from '../../helpers/player-registry';

/**
 * Transition to impact when video clicked to play
 */
@injectable()
export class VideoCtpHandler implements TemplateStateHandler {
	private destroy$ = new Subject<void>();

	constructor(private playerRegistry: PlayerRegistry) {}

	async onEnter(transition: TemplateTransition<'impact'>): Promise<void> {
		this.playerRegistry.video$
			.pipe(
				take(1),
				filter(({ params }) => !params.autoPlay),
				switchMap(({ player }) => fromEvent(player, 'wikiaAdStarted').pipe(take(1))),
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
