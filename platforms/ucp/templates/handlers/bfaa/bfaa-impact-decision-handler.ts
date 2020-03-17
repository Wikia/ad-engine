import {
	AdSlot,
	DomListener,
	DomManipulator,
	FOOTER,
	NAVBAR,
	TEMPLATE,
	TemplateStateHandler,
	TemplateTransition,
	UapParams,
} from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { Subject } from 'rxjs';
import { filter, startWith, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { BfaaDelayHelper } from '../../helpers/bfaa-delay-helper';
import { BfaaHelper } from '../../helpers/bfaa-helper';
import { ScrollCorrector } from '../../helpers/scroll-corrector';

@Injectable()
export class BfaaImpactDecisionHandler implements TemplateStateHandler {
	private unsubscribe$ = new Subject<void>();
	private manipulator = new DomManipulator();
	private helper: BfaaHelper;
	private delayer: BfaaDelayHelper;

	constructor(
		@Inject(TEMPLATE.PARAMS) private params: UapParams,
		@Inject(TEMPLATE.SLOT) private adSlot: AdSlot,
		@Inject(FOOTER) private footer: HTMLElement,
		@Inject(NAVBAR) navbar: HTMLElement,
		private domListener: DomListener,
		private scrollCorrector: ScrollCorrector,
	) {
		this.helper = new BfaaHelper(this.manipulator, this.params, this.adSlot, navbar);
		this.delayer = new BfaaDelayHelper(this.params, this.adSlot);
	}

	async onEnter(transition: TemplateTransition<'sticky' | 'transition'>): Promise<void> {
		this.domListener.scroll$
			.pipe(
				startWith({}),
				withLatestFrom(this.delayer.isViewedAndDelayed()),
				filter(() => this.reachedResolvedSize()),
				tap(([, viewedAndDelayed]) => {
					const correction = this.scrollCorrector.usePositionCorrection(this.footer);

					if (!viewedAndDelayed) {
						transition('sticky').then(correction);
					} else {
						transition('transition').then(correction);
					}
				}),
				takeUntil(this.unsubscribe$),
			)
			.subscribe();
	}

	private reachedResolvedSize(): boolean {
		return this.helper.getDynamicImpactAdHeight() <= this.helper.getResolvedAdHeight();
	}

	async onLeave(): Promise<void> {
		this.unsubscribe$.next();
		this.manipulator.restore();
	}
}
