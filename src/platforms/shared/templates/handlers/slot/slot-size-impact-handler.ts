import { DomListener, TemplateStateHandler } from '@ad-engine/core';
import { defer } from '@ad-engine/utils';
import { Injectable } from '@wikia/dependency-injection';
import { Subject } from 'rxjs';
import { startWith, takeUntil, tap } from 'rxjs/operators';
import { UapDomManager } from '../../helpers/uap-dom-manager';

@Injectable({ autobind: false })
export class SlotSizeImpactHandler implements TemplateStateHandler {
	private unsubscribe$ = new Subject<void>();

	constructor(private domListener: DomListener, private manager: UapDomManager) {}

	async onEnter(): Promise<void> {
		this.manager.setImpactImage();
		this.domListener.resize$
			.pipe(
				startWith({}),
				tap(() => defer(() => this.manager.setSlotHeightImpact())),
				takeUntil(this.unsubscribe$),
			)
			.subscribe();
	}

	async onLeave(): Promise<void> {
		this.unsubscribe$.next();
	}
}
