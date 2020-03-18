import {
	AdSlot,
	DomListener,
	DomManipulator,
	Porvata4Player,
	TEMPLATE,
	TemplateStateHandler,
	UapParams,
} from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { from, Observable, Subject } from 'rxjs';
import { switchMap, takeUntil, tap } from 'rxjs/operators';
import { VideoDomManager } from '../helpers/video-dom-manager';
import { UapContext } from './uap-context';

@Injectable()
export class ResolvedVideoHandler implements TemplateStateHandler {
	private unsubscribe$ = new Subject<void>();
	private manipulator = new DomManipulator();
	private manager: VideoDomManager;

	constructor(
		@Inject(TEMPLATE.PARAMS) private params: UapParams,
		@Inject(TEMPLATE.SLOT) private adSlot: AdSlot,
		@Inject(TEMPLATE.CONTEXT) private context: UapContext,
		private domListener: DomListener,
	) {
		this.manager = new VideoDomManager(this.manipulator, this.params, this.adSlot);
	}

	async onEnter(): Promise<void> {
		let video$: Observable<Porvata4Player>;

		if (this.context.video) {
			video$ = from(this.context.video);
			video$
				.pipe(
					tap((video) => this.manager.setVideoResolvedSize(video)),
					switchMap((video) => {
						return this.domListener.resize$.pipe(
							tap(() => this.manager.setVideoResolvedSize(video)),
						);
					}),
					takeUntil(this.unsubscribe$),
				)
				.subscribe();
		}
	}

	async onLeave(): Promise<void> {
		this.unsubscribe$.next();
		this.manipulator.restore();
	}
}
