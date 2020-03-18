import {
	AdSlot,
	DomManipulator,
	TEMPLATE,
	TemplateStateHandler,
	UapParams,
} from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { PlayerRegistry } from '../../helpers/player-registry';
import { VideoDomManager } from '../../helpers/video-dom-manager';

@Injectable()
export class BfaaTransitionVideoHandler implements TemplateStateHandler {
	private unsubscribe$ = new Subject<void>();
	private manipulator = new DomManipulator();
	private manager: VideoDomManager;

	constructor(
		@Inject(TEMPLATE.PARAMS) private params: UapParams,
		@Inject(TEMPLATE.SLOT) private adSlot: AdSlot,
		private playerRegistry: PlayerRegistry,
	) {
		this.manager = new VideoDomManager(this.manipulator, this.params, this.adSlot);
	}

	async onEnter(): Promise<void> {
		this.playerRegistry.player$
			.pipe(
				tap((video) => this.manager.setVideoResolvedSize(video)),
				takeUntil(this.unsubscribe$),
			)
			.subscribe();
	}

	async onLeave(): Promise<void> {
		this.unsubscribe$.next();
		this.manipulator.restore();
	}
}
