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
import { filter, startWith, takeUntil, tap } from 'rxjs/operators';
import { BfaaHelper } from '../../helpers/bfaa-helper';
import { ScrollCorrector } from '../../helpers/scroll-corrector';

@Injectable()
export class BfaaImpactDecisionHandler implements TemplateStateHandler {
	private unsubscribe$ = new Subject<void>();
	private manipulator = new DomManipulator();
	private helper: BfaaHelper;

	constructor(
		@Inject(TEMPLATE.PARAMS) private params: UapParams,
		@Inject(TEMPLATE.SLOT) private adSlot: AdSlot,
		@Inject(FOOTER) private footer: HTMLElement,
		@Inject(NAVBAR) navbar: HTMLElement,
		private domListener: DomListener,
		private scrollCorrector: ScrollCorrector,
	) {
		this.helper = new BfaaHelper(this.manipulator, this.params, this.adSlot, navbar);
	}

	async onEnter(transition: TemplateTransition<'sticky'>): Promise<void> {
		this.domListener.scroll$
			.pipe(
				startWith({}),
				filter(() => this.reachedResolvedSize()),
				tap(() => {
					const correction = this.scrollCorrector.usePositionCorrection(this.footer);

					transition('sticky').then(correction);
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
