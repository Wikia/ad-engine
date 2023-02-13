import { DomListener, startAndRespondTo, TemplateStateHandler, utils } from '@wikia/ad-engine';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { injectable } from 'tsyringe';
import { PlayerRegistry } from '../../helpers/player-registry';
import { VideoDomManager } from '../../helpers/video-dom-manager';

@injectable()
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
