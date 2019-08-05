import { AdSlot, Dictionary } from '../models';
import { logger } from '../utils';
import { context } from './context-service';
import { events, eventService } from './events';
import { sessionCookie } from './session-cookie';
import { UniversalStorage } from './universal-storage';

type StatusType = 'loaded' | 'viewed';

const logGroup = 'viewability-counter';

class ViewabilityCounter {
	private readonly counters: Dictionary<Dictionary<number>>;
	private storage = new UniversalStorage(sessionCookie);
	private loaded = false;

	constructor() {
		this.counters = this.storage.getItem('viewabilityCountData') || {
			loadedCounter: {},
			viewedCounter: {},
		};
	}

	init(): void {
		if (this.loaded) {
			return;
		}

		this.loaded = true;

		eventService.on(events.AD_SLOT_CREATED, (slot: AdSlot) => {
			const id = slot.getConfigProperty('viewabilityCounterId') || slot.getSlotName();

			slot.loaded.then(() => {
				this.incrementStatusCounter('loaded', id);
			});

			slot.viewed.then(() => {
				this.incrementStatusCounter('viewed', id);
			});
		});
	}

	incrementStatusCounter(type: StatusType, counterId: string): void {
		if (
			!context.get('options.viewabilityCounter.enabled') ||
			(context.get('options.viewabilityCounter.ignoredSlots') &&
				context.get('options.viewabilityCounter.ignoredSlots').includes(counterId))
		) {
			return;
		}

		logger(logGroup, 'storing viewability status', type, counterId);

		this.counters[`${type}Counter`][counterId] =
			(this.counters[`${type}Counter`][counterId] || 0) + 1;

		this.storage.setItem('viewabilityCountData', this.counters);
	}

	getViewability(counterId: string = ''): string {
		let viewability = 0.5;

		if (counterId) {
			viewability = this.counters.loadedCounter[counterId]
				? (this.counters.viewedCounter[counterId] || 0) / this.counters.loadedCounter[counterId]
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
