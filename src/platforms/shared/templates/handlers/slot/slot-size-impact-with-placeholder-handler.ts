import { context, DomListener, tapOnce, TemplateStateHandler, UapConfig } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { Subject } from 'rxjs';
import { startWith, takeUntil, tap } from 'rxjs/operators';
import { UapDomManager } from '../../helpers/uap-dom-manager';

@Injectable({ autobind: false })
export class SlotSizeImpactWithPlaceholderHandler implements TemplateStateHandler {
	private unsubscribe$ = new Subject<void>();

	constructor(
		private config: UapConfig,
		private domListener: DomListener,
		private manager: UapDomManager,
	) {}

	async onEnter(): Promise<void> {
		if (context.get('state.isMobile') && !!this.config.video) {
			this.setImpactSizeOnScroll();
		} else {
			this.manager.setImpactImage();
		}

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

	private setImpactSizeOnScroll(): void {
		this.domListener.scroll$
			.pipe(
				tapOnce(() => {
					this.manager.setImpactImage();
				}),
				takeUntil(this.unsubscribe$),
			)
			.subscribe();
	}
}
