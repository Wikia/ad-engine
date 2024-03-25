import { TemplateStateHandler } from "../../../../core/services/templates-registry/template-state-handler";
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { PlayerRegistry } from "./video/player-registry";
import { DomListener } from "./manipulators/dom-listener";
import { VideoDomManager } from "./video/utils/video-dom-manager";
import { startAndRespondTo } from "../../../../core/rxjs/start-and-respond-to";

export class VideoSizeResolvedHandler implements TemplateStateHandler {
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
				tap(({ player }) => this.manager.setVideoSizeResolved(player)),
				takeUntil(this.unsubscribe$),
			)
			.subscribe();
	}

	async onLeave(): Promise<void> {
		this.unsubscribe$.next();
	}
}
