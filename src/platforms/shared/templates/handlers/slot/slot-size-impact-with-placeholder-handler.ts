import { context, DomListener, tapOnce, TemplateStateHandler } from '@wikia/ad-engine';
import { Subject } from 'rxjs';
import { startWith, takeUntil, tap } from 'rxjs/operators';
import { injectable } from 'tsyringe';
import { UapDomManager } from '../../helpers/uap-dom-manager';

@injectable()
export class SlotSizeImpactWithPlaceholderHandler implements TemplateStateHandler {
	private unsubscribe$ = new Subject<void>();

	constructor(private domListener: DomListener, private manager: UapDomManager) {}

	async onEnter(): Promise<void> {
		if (context.get('state.isMobile')) {
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
