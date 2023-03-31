import { UapDomManager } from '@platforms/shared';
import { DomListener, TemplateStateHandler } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { Subject } from 'rxjs';
import { startWith, takeUntil, tap } from 'rxjs/operators';

@Injectable({ autobind: false })
export class MobileSlotSizeImpactWithPlaceholderHandler implements TemplateStateHandler {
	private unsubscribe$ = new Subject<void>();

	constructor(private domListener: DomListener, private manager: UapDomManager) {}

	async onEnter(): Promise<void> {
		this.domListener.resize$
			.pipe(
				startWith({}),
				tap(() => {
					this.manager.setSlotHeightImpact();
					this.manager.setPlaceholderHeightImpact();
				}),
				takeUntil(this.unsubscribe$),
			)
			.subscribe();
	}

	async onLeave(): Promise<void> {
		this.unsubscribe$.next();
	}
}
