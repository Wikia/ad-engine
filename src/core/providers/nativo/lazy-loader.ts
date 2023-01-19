import { Observable } from 'rxjs';
import { filter, take, tap } from 'rxjs/operators';

import { DomListener } from '../../listeners';
import { getTopOffset, getViewportHeight, logger } from '../../utils';

const logGroup = 'nativo-lazy-loader';

class NativoLazyLoader {
	scrollTrigger(
		slotName: string,
		threshold: number,
		domListener: DomListener,
		callback: () => void,
	) {
		const scroll: Observable<Event> = domListener.scroll$;
		scroll
			.pipe(
				filter(() => this.isThresholdExceeded(slotName, threshold)),
				take(1),
				tap(callback),
			)
			.subscribe();
	}

	private isThresholdExceeded(slotName, threshold): boolean {
		const scrollPosition =
			window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
		const slotPosition: number = getTopOffset(document.getElementById(slotName));
		const viewPortHeight: number = getViewportHeight();

		logger(
			logGroup,
			'Checking scroll threshold',
			slotName,
			scrollPosition,
			viewPortHeight,
			slotPosition,
			threshold,
		);

		return scrollPosition + viewPortHeight > slotPosition - threshold;
	}
}

export const nativoLazyLoader = new NativoLazyLoader();
