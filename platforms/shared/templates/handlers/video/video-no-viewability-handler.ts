import { AdSlot, TEMPLATE, TemplateStateHandler } from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { from, fromEvent, Observable, Subject } from 'rxjs';
import { filter, mergeMap, take, tap } from 'rxjs/operators';
import { PlayerRegistry } from '../../helpers/player-registry';

@Injectable({ autobind: false })
export class VideoNoViewabilityHandler implements TemplateStateHandler {
	private unsubscribe$ = new Subject<void>();

	constructor(
		@Inject(TEMPLATE.SLOT) private adSlot: AdSlot,
		private playerRegistry: PlayerRegistry,
	) {}

	async onEnter(): Promise<void> {
		this.handlePauseVideo();
		this.handleResumeVideo();
	}

	private async handlePauseVideo(): Promise<void> {
		this.playerRegistry.video$
			.pipe(
				mergeMap(({ player }) =>
					fromEvent(player, 'wikiaAdStarted').pipe(
						filter(() => !this.adSlot.slotViewed),
						take(1),
						tap(() => player.pause()),
					),
				),
			)
			.subscribe();
	}

	private async handleResumeVideo(): Promise<void> {
		this.playerRegistry.video$
			.pipe(mergeMap(({ player }) => this.getViewabilityStream().pipe(tap(() => player.resume()))))
			.subscribe();
	}

	private getViewabilityStream(): Observable<unknown> {
		return from(this.adSlot.viewed);
	}

	async onLeave(): Promise<void> {
		this.unsubscribe$.next();
	}
}
