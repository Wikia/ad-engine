import {
	AdSlot,
	DomManipulator,
	Porvata4Player,
	RxjsDomListener,
	TEMPLATE,
	TemplateStateHandler,
	TemplateTransition,
	UapParams,
} from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { from, fromEvent, merge, Observable, Subject } from 'rxjs';
import { switchMap, takeUntil, tap } from 'rxjs/operators';
import { BfaaVideoHelper } from '../helpers/bfaa-video-helper';
import { BfaaContext } from './bfaa-context';

@Injectable()
export class BfaaImpactVideoHandler implements TemplateStateHandler {
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

	async onEnter(transition: TemplateTransition<'resolved'>): Promise<void> {
		let video$: Observable<Porvata4Player>;

		if (this.context.video) {
			video$ = from(this.context.video);
			video$
				.pipe(
					tap((video) => this.helper.setVideoImpactSize(video)),
					switchMap((video) => {
						return merge(this.domListener.scroll$, this.domListener.resize$).pipe(
							tap(() => this.helper.setVideoImpactSize(video)),
						);
					}),
					takeUntil(this.unsubscribe$),
				)
				.subscribe();
			video$
				.pipe(
					switchMap((video) => fromEvent(video, 'wikiaAdCompleted')),
					tap(() => transition('resolved')),
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
