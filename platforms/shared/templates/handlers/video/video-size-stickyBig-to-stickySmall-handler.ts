import { DomListener, startAndRespondTo, TemplateStateHandler } from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { NAVBAR } from '../../configs/uap-dom-elements';
import { PlayerRegistry } from '../../helpers/player-registry';
import { VideoDomManager } from '../../helpers/video-dom-manager';

@Injectable({ autobind: false })
export class VideoSizeStickyBigToStickySmallHandler implements TemplateStateHandler {
	private unsubscribe$ = new Subject<void>();

	constructor(
		@Inject(NAVBAR) private navbar: HTMLElement,
		private playerRegistry: PlayerRegistry,
		private domListener: DomListener,
		private manager: VideoDomManager,
	) {}

	async onEnter(): Promise<void> {
		const adSlotTopOffset = window.scrollY + this.navbar.offsetHeight;

		this.playerRegistry.video$
			.pipe(
				startAndRespondTo(this.domListener.scroll$, this.domListener.resize$),
				tap(({ player }) =>
					this.manager.setVideoSizeStickyBigToStickySmall(player, adSlotTopOffset),
				),
				takeUntil(this.unsubscribe$),
			)
			.subscribe();
	}

	async onLeave(): Promise<void> {
		this.unsubscribe$.next();
	}
}
