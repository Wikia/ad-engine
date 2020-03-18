import {
	AdSlot,
	DomListener,
	DomManipulator,
	TEMPLATE,
	TemplateStateHandler,
	TemplateTransition,
	UapParams,
} from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { fromEvent, merge, Subject } from 'rxjs';
import { switchMap, takeUntil, tap } from 'rxjs/operators';
import { PlayerRegistry } from '../../helpers/player-registry';
import { VideoDomManager } from '../../helpers/video-dom-manager';

@Injectable()
export class BfaaImpactVideoHandler implements TemplateStateHandler {
	private unsubscribe$ = new Subject<void>();
	private manipulator = new DomManipulator();
	private manager: VideoDomManager;

	constructor(
		@Inject(TEMPLATE.PARAMS) private params: UapParams,
		@Inject(TEMPLATE.SLOT) private adSlot: AdSlot,
		private playerRegistry: PlayerRegistry,
		private domListener: DomListener,
	) {
		this.manager = new VideoDomManager(this.manipulator, this.params, this.adSlot);
	}

	async onEnter(transition: TemplateTransition<'resolved'>): Promise<void> {
		this.playerRegistry.player$
			.pipe(
				tap((video) => this.manager.setDynamicVideoImpactSize(video)),
				switchMap((video) => {
					return merge(this.domListener.scroll$, this.domListener.resize$).pipe(
						tap(() => this.manager.setDynamicVideoImpactSize(video)),
					);
				}),
				takeUntil(this.unsubscribe$),
			)
			.subscribe();
		this.playerRegistry.player$
			.pipe(
				switchMap((video) => fromEvent(video, 'wikiaAdCompleted')),
				tap(() => transition('resolved')),
				takeUntil(this.unsubscribe$),
			)
			.subscribe();
	}

	async onLeave(): Promise<void> {
		this.unsubscribe$.next();
		this.manipulator.restore();
	}
}
