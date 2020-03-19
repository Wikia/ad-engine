import { DomListener, NAVBAR, TemplateStateHandler } from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { Subject } from 'rxjs';
import { startWith, takeUntil, tap } from 'rxjs/operators';
import { DomManipulator } from '../../helpers/manipulators/dom-manipulator';
import { UapDomManager } from '../../helpers/uap-dom-manager';

@Injectable()
export class BfaaResolvedHandler implements TemplateStateHandler {
	private unsubscribe$ = new Subject<void>();

	constructor(
		@Inject(NAVBAR) navbar: HTMLElement,
		private domListener: DomListener,
		private manipulator: DomManipulator,
		private manager: UapDomManager,
	) {}

	async onEnter(): Promise<void> {
		this.manager.setResolvedImage();
		this.domListener.resize$
			.pipe(
				startWith({}),
				tap(() => {
					this.manager.setResolvedAdHeight();
				}),
				takeUntil(this.unsubscribe$),
			)
			.subscribe();
	}

	async onLeave(): Promise<void> {
		this.unsubscribe$.next();
		this.manipulator.restore();
	}
}
