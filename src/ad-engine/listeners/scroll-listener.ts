import { Dictionary } from '../';
import { events, eventService } from '../services/events';
import { slotService } from '../services/slot-service';
import { getTopOffset, getViewportHeight } from '../utils/dimensions';
import { logger } from '../utils/logger';

type ScrollListenerCallback = (event: string, callbackId: string) => void;

export class ScrollListener {
	readonly serviceName = 'scroll-listener';
	private callbacks: Dictionary<ScrollListenerCallback> = {};

	init(): void {
		this.callbacks = {};

		let requestAnimationFrameHandleAdded = false;

		document.addEventListener('scroll', (event: Event) => {
			if (!requestAnimationFrameHandleAdded) {
				window.requestAnimationFrame(() => {
					requestAnimationFrameHandleAdded = false;
					Object.keys(this.callbacks).forEach((id: string) => {
						if (typeof this.callbacks[id] === 'function') {
							this.callbacks[id](event.type, id);
						}
					});
				});
				requestAnimationFrameHandleAdded = true;
			}
		});
		logger(this.serviceName, 'Service initialised.');
	}

	/**
	 *
	 * @param id ID of the AdSlot to push
	 * @param threshold slot will be pushed `threshold`px before it appears in viewport
	 * @param distanceFromTop slot will be pushed after scrolling `distanceFromTop`px
	 *
	 * Only one parameter can be supplied: threshold or distanceFromTop
	 */
	addSlot(
		id: string,
		{ threshold, distanceFromTop }: { threshold?: number; distanceFromTop?: number } = {},
	): void {
		const node = document.getElementById(id);

		if (!node) {
			logger(this.serviceName, `Node with id ${id} not found.`);

			return;
		}

		if (threshold === undefined && distanceFromTop === undefined) {
			logger(this.serviceName, 'either threshold or distanceFromTop must be initialised');

			return;
		}

		if (threshold !== undefined && distanceFromTop !== undefined) {
			logger(this.serviceName, 'either threshold or distanceFromTop can be initialised, not both');

			return;
		}

		logger(this.serviceName, `Add slot ${id}.`);

		this.addCallback(
			(event: string, callbackId: string): void => {
				const scrollPosition: number =
					window.scrollY || window.pageYOffset || document.documentElement.scrollTop;

				if (threshold !== undefined) {
					const slotPosition: number = getTopOffset(node);
					const viewPortHeight: number = getViewportHeight();

					if (scrollPosition + viewPortHeight > slotPosition - threshold) {
						this.removeCallback(callbackId);
						slotService.pushSlot(node);
					}
				} else {
					if (scrollPosition > distanceFromTop) {
						this.removeCallback(callbackId);
						slotService.pushSlot(node);
					}
				}
			},
		);
	}

	/**
	 * @deprecated use DomListener instead
	 */
	addCallback(callback: ScrollListenerCallback): string {
		const id: string = this.getUniqueId();

		this.callbacks[id] = callback;

		eventService.once(events.BEFORE_PAGE_CHANGE_EVENT, () => this.removeCallback(id));

		return id;
	}

	removeCallback(id: string): void {
		delete this.callbacks[id];
	}

	getUniqueId(): string {
		return ((1 + Math.random()) * 0x1000000).toString(16).substring(1);
	}
}

export const scrollListener = new ScrollListener();
