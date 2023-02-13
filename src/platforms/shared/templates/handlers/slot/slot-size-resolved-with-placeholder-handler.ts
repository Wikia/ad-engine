import { DomListener, TemplateStateHandler } from '@wikia/ad-engine';
import { Subject } from 'rxjs';
import { startWith, takeUntil, tap } from 'rxjs/operators';
import { injectable } from 'tsyringe';
import { UapDomManager } from '../../helpers/uap-dom-manager';

@injectable()
export class SlotSizeResolvedWithPlaceholderHandler implements TemplateStateHandler {
	private unsubscribe$ = new Subject<void>();

	constructor(private domListener: DomListener, private manager: UapDomManager) {}

	async onEnter(): Promise<void> {
		this.manager.setResolvedImage();
		this.domListener.resize$
			.pipe(
				startWith({}),
				tap(() => {
					this.manager.setSlotHeightResolved();
					this.manager.setPlaceholderHeightResolved();
				}),
				takeUntil(this.unsubscribe$),
			)
			.subscribe();
	}

	async onLeave(): Promise<void> {
		this.unsubscribe$.next();
	}
}
