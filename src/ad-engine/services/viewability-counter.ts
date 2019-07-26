import { Dictionary } from '../models';
import { logger } from '../utils';
import { context } from './context-service';
import { LocalStorage } from './local-storage';
import { sessionCookie } from './session-cookie';

type ViewabilityStatus = 'loaded' | 'viewed';

const logGroup = 'viewability-service';

/**
 * Viewability Counter service handler
 */
class ViewabilityCounter {
	/**
	 * Stores slots viewability counters for current pageview
	 */
	private readonly counters: Dictionary<Dictionary<number>>;
	/**
	 * Non pv volatile storage
	 */
	private storage = new LocalStorage(sessionCookie);

	constructor() {
		this.counters = this.storage.getItem('viewabilityCountData') || {
			loadedCounter: {},
			viewedCounter: {},
		};
	}

	/**
	 * Save in storage impression or viewability change
	 */
	updateStatus(type: ViewabilityStatus, slotName: string): void {
		if (
			!context.get('options.viewabilityCounter.enabled') ||
			(context.get('options.viewabilityCounter.ignoredSlots') &&
				context.get('options.viewabilityCounter.ignoredSlots').includes(slotName))
		) {
			return;
		}

		logger(logGroup, 'storing viewability status', type, slotName);

		this.counters[`${type}Counter`][slotName] =
			(this.counters[`${type}Counter`][slotName] || 0) + 1;

		this.storage.setItem('viewabilityCountData', this.counters);
	}

	/**
	 * Pass slot name to get it's viewability or undefined to get all slots viewability
	 */
	getViewability(slotName: string = ''): string {
		let viewability = 0.5;

		if (slotName) {
			viewability = this.counters.loadedCounter[slotName]
				? (this.counters.viewedCounter[slotName] || 0) / this.counters.loadedCounter[slotName]
				: viewability;
		} else if (Object.keys(this.counters.loadedCounter).length) {
			let loaded = 0;
			let viewed = 0;

			Object.keys(this.counters.loadedCounter).forEach((slot) => {
				loaded += this.counters.loadedCounter[slot];
				viewed += this.counters.viewedCounter[slot] || 0;
			});

			viewability = viewed / loaded;
		}

		return Number(viewability).toFixed(3);
	}
}

export const viewabilityCounter = new ViewabilityCounter();
