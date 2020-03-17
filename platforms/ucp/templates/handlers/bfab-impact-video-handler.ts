import {
	AdSlot,
	DomListener,
	DomManipulator,
	Porvata4Player,
	TEMPLATE,
	TemplateStateHandler,
	TemplateTransition,
	UapParams,
} from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { from, fromEvent, merge, Observable, Subject } from 'rxjs';
import { switchMap, takeUntil, tap } from 'rxjs/operators';
import { VideoHelper } from '../helpers/video-helper';
import { UapContext } from './uap-context';

@Injectable()
export class BfabImpactVideoHandler implements TemplateStateHandler {
	private unsubscribe$ = new Subject<void>();
	private manipulator = new DomManipulator();
	private helper: VideoHelper;

	constructor(
		@Inject(TEMPLATE.PARAMS) private params: UapParams,
		@Inject(TEMPLATE.SLOT) private adSlot: AdSlot,
		@Inject(TEMPLATE.CONTEXT) private context: UapContext,
		private domListener: DomListener,
	) {
		this.helper = new VideoHelper(this.manipulator, this.params, this.adSlot);
	}

	async onEnter(transition: TemplateTransition<'resolved'>): Promise<void> {
		let video$: Observable<Porvata4Player>;

		if (this.context.video) {
			video$ = from(this.context.video);
			video$
				.pipe(
					tap((video) => this.helper.setDynamicVideoImpactSize(video, 0)),
					switchMap((video) => {
						return merge(this.domListener.resize$).pipe(
							tap(() => this.helper.setDynamicVideoImpactSize(video, 0)),
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
