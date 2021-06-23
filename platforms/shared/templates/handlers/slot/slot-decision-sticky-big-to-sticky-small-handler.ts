import { DomListener, TemplateStateHandler, TemplateTransition } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { Subject } from 'rxjs';
import { filter, startWith, takeUntil, tap } from 'rxjs/operators';
import { UapDomReader } from '../../helpers/uap-dom-reader';

@Injectable({ autobind: false })
export class SlotDecisionStickyBigToStickySmallHandler implements TemplateStateHandler {
	private unsubscribe$ = new Subject<void>();

	constructor(private domListener: DomListener, private reader: UapDomReader) {}

	async onEnter(transition: TemplateTransition<'stickySmall'>): Promise<void> {
		this.domListener.scroll$
			.pipe(
				startWith({}),
				filter(() => this.reachedSmallSize()),
				tap(() => transition('stickySmall')),
				takeUntil(this.unsubscribe$),
			)
			.subscribe();
	}

	private reachedSmallSize(): boolean {
		return this.reader.getProgressStickyBigToStickySmall() === 1;
	}

	async onLeave(): Promise<void> {
		this.unsubscribe$.next();
	}
}
