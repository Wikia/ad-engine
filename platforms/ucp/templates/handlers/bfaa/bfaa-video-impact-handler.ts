import { AdSlot, DomListener, TEMPLATE, TemplateStateHandler, UapParams } from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { merge, Subject } from 'rxjs';
import { map, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { DomManipulator } from '../../helpers/manipulators/dom-manipulator';
import { PlayerRegistry } from '../../helpers/player-registry';
import { VideoDomManager } from '../../helpers/video-dom-manager';

@Injectable()
export class BfaaVideoImpactHandler implements TemplateStateHandler {
	private unsubscribe$ = new Subject<void>();
	private manager: VideoDomManager;

	constructor(
		@Inject(TEMPLATE.PARAMS) params: UapParams,
		@Inject(TEMPLATE.SLOT) adSlot: AdSlot,
		private playerRegistry: PlayerRegistry,
		private domListener: DomListener,
		private manipulator: DomManipulator,
	) {
		this.manager = new VideoDomManager(this.manipulator, params, adSlot);
	}

	async onEnter(): Promise<void> {
		this.playerRegistry.video$
			.pipe(
				switchMap(({ player }) =>
					merge(this.domListener.scroll$, this.domListener.resize$).pipe(
						startWith({}),
						map(() => player),
					),
				),
				tap((player) => this.manager.setDynamicVideoImpactSize(player)),
				takeUntil(this.unsubscribe$),
			)
			.subscribe();
	}

	async onLeave(): Promise<void> {
		this.unsubscribe$.next();
		this.manipulator.restore();
	}
}
