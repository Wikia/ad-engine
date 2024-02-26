import {
	AdSlot,
	InstantConfigService,
	TEMPLATE,
	TemplateStateHandler,
	TemplateTransition,
} from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { EMPTY, from, merge, NEVER, Observable, Subject, timer } from 'rxjs';
import { mergeMap, take, takeUntil, tap } from 'rxjs/operators';

@Injectable({ autobind: false })
export class SlotDecisionOnViewabilityHandler implements TemplateStateHandler {
	private unsubscribe$ = new Subject<void>();
	private readonly additionalHideTime?: number;
	private readonly timeoutHideTime?: number;

	private readonly displayFloorAdhesionClass = 'floor-adhesion-container--showing';

	constructor(@Inject(TEMPLATE.SLOT) private adSlot: AdSlot, instantConfig: InstantConfigService) {
		this.additionalHideTime = instantConfig.get('icFloorAdhesionDelay');
		this.timeoutHideTime = instantConfig.get('icFloorAdhesionTimeout');
	}

	async onEnter(transition: TemplateTransition<'transition'>): Promise<void> {
		merge(this.getViewabilityStream(), this.getTimeoutStream())
			.pipe(
				take(1),
				tap(() => transition('transition')),
				takeUntil(this.unsubscribe$),
			)
			.subscribe();

		// Mark that the ad is showing
		document.body.classList.add(this.displayFloorAdhesionClass);
	}

	private getViewabilityStream(): Observable<unknown> {
		if (this.additionalHideTime === -1) {
			return NEVER;
		}

		return from(this.adSlot.viewed).pipe(mergeMap(() => timer(this.additionalHideTime)));
	}

	private getTimeoutStream(): Observable<unknown> {
		return this.timeoutHideTime ? timer(this.timeoutHideTime) : EMPTY;
	}

	async onLeave(): Promise<void> {
		this.unsubscribe$.next();

		document.body.classList.remove(this.displayFloorAdhesionClass);
	}
}
