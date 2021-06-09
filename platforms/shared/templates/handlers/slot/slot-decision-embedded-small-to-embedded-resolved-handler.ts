import { AdSlot, TEMPLATE, TemplateStateHandler, TemplateTransition } from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { from, merge, Observable, Subject } from 'rxjs';
import { delay, take, takeUntil, tap } from 'rxjs/operators';

@Injectable({ autobind: false })
export class SlotDecisionEmbeddedSmallToEmbeddedResolvedHandler implements TemplateStateHandler {
	private unsubscribe$ = new Subject<void>();

	private readonly viewabilityTransitionDelay?: number = 3000;

	constructor(@Inject(TEMPLATE.SLOT) private adSlot: AdSlot) {}

	async onEnter(transition: TemplateTransition<'embeddedResolved'>): Promise<void> {
		merge(this.getViewabilityStream())
			.pipe(
				take(1),
				tap(() => transition('embeddedResolved')),
				takeUntil(this.unsubscribe$),
			)
			.subscribe();
	}

	private getViewabilityStream(): Observable<unknown> {
		return from(this.adSlot.viewed).pipe(delay(this.viewabilityTransitionDelay));
	}

	async onLeave(): Promise<void> {
		this.unsubscribe$.next();
	}
}
