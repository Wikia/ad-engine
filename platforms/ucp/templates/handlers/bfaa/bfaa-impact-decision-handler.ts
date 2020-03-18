import {
	AdSlot,
	DomListener,
	FOOTER,
	TEMPLATE,
	TemplateStateHandler,
	TemplateTransition,
	UapParams,
	universalAdPackage,
} from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { Subject } from 'rxjs';
import { filter, startWith, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { BfaaDomReader } from '../../helpers/bfaa-dom-reader';
import { ScrollCorrector } from '../../helpers/scroll-corrector';
import { StickinessTimeout } from '../../helpers/stickiness-timeout';

@Injectable()
export class BfaaImpactDecisionHandler implements TemplateStateHandler {
	private unsubscribe$ = new Subject<void>();
	private reader: BfaaDomReader;
	private timeout: StickinessTimeout;

	constructor(
		@Inject(TEMPLATE.PARAMS) params: UapParams,
		@Inject(TEMPLATE.SLOT) adSlot: AdSlot,
		@Inject(FOOTER) private footer: HTMLElement,
		private domListener: DomListener,
		private scrollCorrector: ScrollCorrector,
	) {
		this.reader = new BfaaDomReader(params);
		this.timeout = new StickinessTimeout(params, adSlot, universalAdPackage.BFAA_UNSTICK_DELAY);
	}

	async onEnter(transition: TemplateTransition<'sticky' | 'transition'>): Promise<void> {
		this.domListener.scroll$
			.pipe(
				startWith({}),
				withLatestFrom(this.timeout.isViewedAndDelayed()),
				filter(() => this.reachedResolvedSize()),
				tap(([, viewedAndDelayed]) => {
					const correction = this.scrollCorrector.usePositionCorrection(this.footer);

					if (viewedAndDelayed) {
						transition('transition').then(correction);
					} else {
						transition('sticky').then(correction);
					}
				}),
				takeUntil(this.unsubscribe$),
			)
			.subscribe();
	}

	private reachedResolvedSize(): boolean {
		return this.reader.getDynamicImpactAdHeight() <= this.reader.getResolvedAdHeight();
	}

	async onLeave(): Promise<void> {
		this.unsubscribe$.next();
	}
}
