import {
	AdSlot,
	DomManipulator,
	Porvata4Player,
	RxjsDomListener,
	TEMPLATE,
	TemplateStateHandler,
	UapParams,
} from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { from, Observable, Subject } from 'rxjs';
import { switchMap, takeUntil, tap } from 'rxjs/operators';
import { BfaaVideoHelper } from '../helpers/bfaa-video-helper';
import { BfaaContext } from './bfaa-context';

@Injectable()
export class BfaaResolvedVideoHandler implements TemplateStateHandler {
	private unsubscribe$ = new Subject<void>();
	private manipulator = new DomManipulator();
	private helper: BfaaVideoHelper;

	constructor(
		@Inject(TEMPLATE.PARAMS) private params: UapParams,
		@Inject(TEMPLATE.SLOT) private adSlot: AdSlot,
		@Inject(TEMPLATE.CONTEXT) private context: BfaaContext,
		private domListener: RxjsDomListener,
	) {
		this.helper = new BfaaVideoHelper(this.manipulator, this.params, this.adSlot);
	}

	async onEnter(): Promise<void> {
		let video$: Observable<Porvata4Player>;

		if (this.context.video) {
			video$ = from(this.context.video);
			video$
				.pipe(
					switchMap((video) => {
						return this.domListener.resize$.pipe(
							tap(() => this.helper.setVideoResolvedSize(video)),
						);
					}),
					takeUntil(this.unsubscribe$),
				)
				.subscribe();

			video$
				.pipe(
					tap((video) => this.helper.setVideoResolvedSize(video)),
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
