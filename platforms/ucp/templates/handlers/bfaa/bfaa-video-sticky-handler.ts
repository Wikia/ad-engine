import { DomListener, TemplateStateHandler } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { Subject } from 'rxjs';
import { map, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { PlayerRegistry } from '../../helpers/player-registry';
import { VideoDomManager } from '../../helpers/video-dom-manager';

@Injectable({ autobind: false })
export class BfaaVideoStickyHandler implements TemplateStateHandler {
	private unsubscribe$ = new Subject<void>();

	constructor(
		private playerRegistry: PlayerRegistry,
		private domListener: DomListener,
		private manager: VideoDomManager,
	) {}

	async onEnter(): Promise<void> {
		this.playerRegistry.video$
			.pipe(
				switchMap(({ player }) =>
					this.domListener.resize$.pipe(
						startWith({}),
						map(() => player),
					),
				),
				tap((player) => this.manager.setVideoResolvedSize(player)),
				takeUntil(this.unsubscribe$),
			)
			.subscribe();
	}

	async onLeave(): Promise<void> {
		this.unsubscribe$.next();
	}
}
