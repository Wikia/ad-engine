import { DomListener, startAndRespondTo, TemplateStateHandler, utils } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { PlayerRegistry } from '../../helpers/player-registry';
import { VideoDomManager } from '../../helpers/video-dom-manager';

@Injectable({ autobind: false })
export class VideoSizeImpactHandler implements TemplateStateHandler {
	private unsubscribe$ = new Subject<void>();

	constructor(
		private playerRegistry: PlayerRegistry,
		private domListener: DomListener,
		private manager: VideoDomManager,
	) {}

	async onEnter(): Promise<void> {
		this.playerRegistry.video$
			.pipe(
				startAndRespondTo(this.domListener.resize$),
				tap(({ player }) => utils.defer(() => this.manager.setVideoSizeImpact(player))),
				takeUntil(this.unsubscribe$),
			)
			.subscribe();
	}

	async onLeave(): Promise<void> {
		this.unsubscribe$.next();
	}
}
