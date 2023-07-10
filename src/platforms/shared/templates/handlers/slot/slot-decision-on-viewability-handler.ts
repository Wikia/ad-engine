import {
	AdSlot,
	InstantConfigService,
	TEMPLATE,
	TemplateStateHandler,
	TemplateTransition,
} from '@wikia/ad-engine';
import { EMPTY, from, merge, NEVER, Observable, Subject, timer } from 'rxjs';
import { mergeMap, take, takeUntil, tap } from 'rxjs/operators';
import { inject, injectable } from 'tsyringe';

@injectable()
export class SlotDecisionOnViewabilityHandler implements TemplateStateHandler {
	private unsubscribe$ = new Subject<void>();
	private readonly additionalHideTime?: number;
	private readonly timeoutHideTime?: number;

	constructor(@inject(TEMPLATE.SLOT) private adSlot: AdSlot, instantConfig: InstantConfigService) {
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
	}
}
