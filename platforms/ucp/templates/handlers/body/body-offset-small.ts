import { DomListener, TemplateStateHandler } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { Subject } from 'rxjs';
import { startWith, takeUntil, tap } from 'rxjs/operators';
import { DomManipulator } from '../../helpers/manipulators/dom-manipulator';
import { UapDomReader } from '../../helpers/uap-dom-reader';

@Injectable({ autobind: false })
export class BodyOffsetSmall implements TemplateStateHandler {
	private unsubscribe$ = new Subject<void>();

	constructor(
		private domListener: DomListener,
		private reader: UapDomReader,
		private manipulator: DomManipulator,
	) {}

	async onEnter(): Promise<void> {
		this.domListener.resize$
			.pipe(
				startWith({}),
				tap(() => {
					this.manipulator
						.element(document.body)
						.setProperty('paddingTop', `${this.reader.getBodyOffsetSmall()}px`);
				}),
				takeUntil(this.unsubscribe$),
			)
			.subscribe();
	}

	async onLeave(): Promise<void> {
		this.unsubscribe$.next();
	}
}
