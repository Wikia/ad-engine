import {
	AdSlot,
	DomListener,
	DomManipulator,
	TEMPLATE,
	TemplateStateHandler,
	UapParams,
} from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { merge, Subject } from 'rxjs';
import { map, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { PlayerRegistry } from '../../helpers/player-registry';
import { VideoDomManager } from '../../helpers/video-dom-manager';

@Injectable()
export class BfabVideoImpactHandler implements TemplateStateHandler {
	private unsubscribe$ = new Subject<void>();
	private manipulator = new DomManipulator();
	private manager: VideoDomManager;

	constructor(
		@Inject(TEMPLATE.PARAMS) params: UapParams,
		@Inject(TEMPLATE.SLOT) adSlot: AdSlot,
		private playerRegistry: PlayerRegistry,
		private domListener: DomListener,
	) {
		this.manager = new VideoDomManager(this.manipulator, params, adSlot);
	}

	async onEnter(): Promise<void> {
		this.playerRegistry.video$
			.pipe(
				switchMap(({ player }) =>
					merge(this.domListener.resize$).pipe(
						startWith({}),
						map(() => player),
					),
				),
				tap((player) => this.manager.setDynamicVideoImpactSize(player, 0)),
				takeUntil(this.unsubscribe$),
			)
			.subscribe();
	}

	async onLeave(): Promise<void> {
		this.unsubscribe$.next();
		this.manipulator.restore();
	}
}
