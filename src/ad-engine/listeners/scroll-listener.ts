import { isUndefined } from 'lodash';
import { AdStackPayload, Dictionary } from '../';
import { events, eventService } from '../services/events';
import { getTopOffset, getViewportHeight } from '../utils/dimensions';
import { OldLazyQueue } from '../utils/lazy-queue';
import { logger } from '../utils/logger';

type ScrollListenerCallback = (event: string, callbackId: string) => void;

export class ScrollListener {
	readonly serviceName = 'scroll-listener';
	private callbacks: Dictionary<ScrollListenerCallback> = {};

	init() {
		this.callbacks = {};

		let requestAnimationFrameHandleAdded = false;

		document.addEventListener('scroll', (event: Event) => {
			if (!requestAnimationFrameHandleAdded) {
				window.requestAnimationFrame(() => {
					requestAnimationFrameHandleAdded = false;
					Object.keys(this.callbacks).forEach((id) => {
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
	 * @param adStack AdStack to push the slot to.
	 * @param id ID of the AdSlot to push
	 * @param threshold slot will be pushed `threshold`px before it appears in viewport
	 * @param distanceFromTop slot will be pushed after scrolling `distanceFromTop`px
	 *
	 * Only one parameter can be supplied: threshold or distanceFromTop
	 */
	addSlot(
		adStack: OldLazyQueue<AdStackPayload>,
		id: string,
		{ threshold, distanceFromTop }: { threshold?: number; distanceFromTop?: number } = {},
	): void {
		const node = document.getElementById(id);

		if (!node) {
			logger(this.serviceName, `Node with id ${id} not found.`);

			return;
		}

		if (isUndefined(threshold) && isUndefined(distanceFromTop)) {
			logger(this.serviceName, 'either threshold or distanceFromTop must be initialised');

			return;
		}

		if (!isUndefined(threshold) && !isUndefined(distanceFromTop)) {
			logger(this.serviceName, 'either threshold or distanceFromTop can be initialised, not both');

			return;
		}

		logger(this.serviceName, `Add slot ${id}.`);

		this.addCallback(
			(event: string, callbackId: string): void => {
				const scrollPosition =
					window.scrollY || window.pageYOffset || document.documentElement.scrollTop;

				if (!isUndefined(threshold)) {
					const slotPosition = getTopOffset(node);
					const viewPortHeight = getViewportHeight();

					if (scrollPosition + viewPortHeight > slotPosition - threshold) {
						this.removeCallback(callbackId);
						this.pushSlot(adStack, node);
					}
				} else {
					if (scrollPosition > distanceFromTop) {
						this.removeCallback(callbackId);
						this.pushSlot(adStack, node);
					}
				}
			},
		);
	}

	addCallback(callback: ScrollListenerCallback): string {
		const id = this.getUniqueId();

		this.callbacks[id] = callback;

		eventService.once(events.BEFORE_PAGE_CHANGE_EVENT, () => this.removeCallback(id));

		return id;
	}

	removeCallback(id) {
		delete this.callbacks[id];
	}

	getUniqueId(): string {
		return ((1 + Math.random()) * 0x1000000).toString(16).substring(1);
	}

	pushSlot(adStack: OldLazyQueue<AdStackPayload>, node: HTMLElement) {
		logger(this.serviceName, `Push slot ${node.id} to adStack.`);
		adStack.push({
			id: node.id,
		});
	}
}

export const scrollListener = new ScrollListener();
