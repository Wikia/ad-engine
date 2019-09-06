import { AdSlot, Dictionary } from '../models';
import { logger } from '../utils';
import { context } from './context-service';
import { events, eventService } from './events';
import { SessionCookie } from './session-cookie';

type StatusType = 'loaded' | 'viewed';

const logGroup = 'viewability-counter';

export class ViewabilityCounter {
	private static instance: ViewabilityCounter;

	static make(): ViewabilityCounter {
		if (!ViewabilityCounter.instance) {
			ViewabilityCounter.instance = new ViewabilityCounter();
		}

		return ViewabilityCounter.instance;
	}

	private counters: Dictionary<Dictionary<number>>;
	private sessionCookie = SessionCookie.make();
	private loaded = false;

	private constructor() {
		this.readCounters();
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

		this.readCounters();
		this.counters[`${type}Counter`][counterId] =
			(this.counters[`${type}Counter`][counterId] || 0) + 1;

		this.sessionCookie.setItem('viewabilityCountData', this.counters);
	}

	getViewability(counterId: string = ''): string {
		let viewability = 0.5;

		this.readCounters();

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

	/**
	 * Has to be run before every read/write in case there are multiple instances of AdEngine running.
	 * For example in 2 separate tabs.
	 */
	private readCounters(): void {
		this.counters = this.sessionCookie.getItem('viewabilityCountData') || {
			loadedCounter: {},
			viewedCounter: {},
		};
	}
}
