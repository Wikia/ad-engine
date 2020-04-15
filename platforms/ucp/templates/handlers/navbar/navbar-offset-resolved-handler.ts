import { DomListener, TemplateStateHandler } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { Subject } from 'rxjs';
import { startWith, takeUntil, tap } from 'rxjs/operators';
import { UapDomManager } from '../../helpers/uap-dom-manager';

@Injectable({ autobind: false })
export class NavbarOffsetResolvedHandler implements TemplateStateHandler {
	private unsubscribe$ = new Subject<void>();

	constructor(private domListener: DomListener, private manager: UapDomManager) {}

	async onEnter(): Promise<void> {
		this.domListener.resize$
			.pipe(
				startWith({}),
				tap(() => {
					this.manager.setNavbarOffsetResolved();
				}),
				takeUntil(this.unsubscribe$),
			)
			.subscribe();
	}

	async onLeave(): Promise<void> {
		this.unsubscribe$.next();
	}
}
