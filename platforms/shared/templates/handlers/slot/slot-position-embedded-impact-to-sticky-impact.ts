import { DomListener, TemplateStateHandler } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { Subject } from 'rxjs';
import { startWith, takeUntil, tap } from 'rxjs/operators';
import { UapDomManager } from '../../helpers/uap-dom-manager';

@Injectable({ autobind: false })
export class SlotPositionEmbeddedImpactToStickyImpact implements TemplateStateHandler {
	private unsubscribe$ = new Subject<void>();

	constructor(private manager: UapDomManager, private domListener: DomListener) {}

	async onEnter(): Promise<void> {
		this.domListener.scroll$
			.pipe(
				startWith({}),
				tap(() => {
					this.manager.addClassToAdSlotPlaceholder('bfaa-sticky-impact');
				}),
				takeUntil(this.unsubscribe$),
			)
			.subscribe();
	}

	async onLeave(): Promise<void> {
		this.manager.removeAdSlotPlaceholderClass('bfaa-sticky-impact');
		this.unsubscribe$.next();
	}
}
