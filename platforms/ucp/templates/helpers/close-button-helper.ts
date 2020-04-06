import { AdSlot, DomListener, TEMPLATE } from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { Observable } from 'rxjs';
import { filter, startWith, take, tap } from 'rxjs/operators';

@Injectable({ autobind: false })
export class CloseButtonHelper {
	constructor(@Inject(TEMPLATE.SLOT) private adSlot: AdSlot, private domListener: DomListener) {}

	appendOnScroll(button: HTMLButtonElement): Observable<unknown> {
		return this.domListener.scroll$.pipe(
			startWith({}),
			filter(() => window.scrollY > 0),
			take(1),
			tap(() => this.adSlot.getElement().appendChild(button)),
		);
	}
}
