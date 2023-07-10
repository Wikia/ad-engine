import { AdSlot, DomListener, TEMPLATE } from '@wikia/ad-engine';
import { from, Observable } from 'rxjs';
import { filter, startWith, take, tap } from 'rxjs/operators';
import { inject, injectable } from 'tsyringe';

@injectable()
export class CloseButtonHelper {
	constructor(@inject(TEMPLATE.SLOT) private adSlot: AdSlot, private domListener: DomListener) {}

	appendOnViewed(button: HTMLButtonElement): Observable<unknown> {
		return from(this.adSlot.viewed).pipe(
			startWith({}),
			take(1),
			tap(() => this.adSlot.getElement().appendChild(button)),
		);
	}

	appendOnScroll(button: HTMLButtonElement): Observable<unknown> {
		return this.domListener.scroll$.pipe(
			startWith({}),
			filter(() => window.scrollY > 0),
			take(1),
			tap(() => this.adSlot.getElement().appendChild(button)),
		);
	}
}
