import { AdSlot, Dictionary } from '../models';
import { viewportObserver } from '../utils';

interface OverscrollListenedElement {
	wasInViewport: boolean;
	overscrolledListener: string;
}

class OverscrollListener {
	listenedSlots: Dictionary<OverscrollListenedElement> = {};

	apply(adSlot: AdSlot) {
		const key = adSlot.getSlotName();

		this.listenedSlots[key] = {
			wasInViewport: false,
			overscrolledListener: null,
		};

		this.listenedSlots[key]['overscrolledListener'] = viewportObserver.addListener(
			adSlot.getElement(),
			(inViewport) => {
				const listenerConfig = this.listenedSlots[key];

				if (adSlot.isViewed()) {
					viewportObserver.removeListener(listenerConfig.overscrolledListener);
					return;
				}

				if (inViewport) {
					listenerConfig.wasInViewport = inViewport;
					return;
				}

				viewportObserver.removeListener(listenerConfig.overscrolledListener);
				adSlot.emitEvent('overscrolled');
			},
		);
	}
}

export const overscrollListener = new OverscrollListener();
