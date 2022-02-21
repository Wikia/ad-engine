import { context, DomListener } from '@ad-engine/core';
import { Observable } from 'rxjs/dist/types';
import { filter, take, tap } from 'rxjs/operators';
import { getTopOffset, getViewportHeight } from '../../ad-engine/utils';
import { Nativo } from './index';

class NativoLazyLoader {
	private readonly scrollThreshold: number;

	constructor() {
		this.scrollThreshold = context.get('events.pushOnScroll.nativoThreshold') || 200;
	}

	scrollTrigger(domListener: DomListener, callback: () => void) {
		const scroll: Observable<Event> = domListener.scroll$;
		scroll
			.pipe(
				filter(() => this.isThresholdExceeded()),
				take(1),
				tap(callback),
			)
			.subscribe();
	}

	private isThresholdExceeded(): boolean {
		const scrollPosition =
			window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
		const slotPosition: number = getTopOffset(
			document.getElementById(Nativo.INCONTENT_AD_SLOT_NAME),
		);
		const viewPortHeight: number = getViewportHeight();
		return scrollPosition + viewPortHeight > slotPosition - this.scrollThreshold;
	}
}

export const nativoLazyLoader = new NativoLazyLoader();
