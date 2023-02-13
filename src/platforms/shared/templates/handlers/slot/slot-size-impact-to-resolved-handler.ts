import { DomListener, TemplateStateHandler } from '@wikia/ad-engine';
import { merge, Subject } from 'rxjs';
import { startWith, takeUntil, tap } from 'rxjs/operators';
import { injectable } from 'tsyringe';
import { UapDomManager } from '../../helpers/uap-dom-manager';

@injectable()
export class SlotSizeImpactToResolvedHandler implements TemplateStateHandler {
	private unsubscribe$ = new Subject<void>();

	constructor(private domListener: DomListener, private manager: UapDomManager) {}

	async onEnter(): Promise<void> {
		this.manager.setImpactImage();
		merge(this.domListener.resize$, this.domListener.scroll$)
			.pipe(
				startWith({}),
				tap(() => this.manager.setSlotHeightImpactToResolved()),
				takeUntil(this.unsubscribe$),
			)
			.subscribe();
	}

	async onLeave(): Promise<void> {
		this.unsubscribe$.next();
	}
}
