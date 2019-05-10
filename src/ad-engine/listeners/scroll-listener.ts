import { events, eventService } from '../services/events';
import { getTopOffset, OldLazyQueue } from '../utils';
import { AdStackElement, Dictionary } from './../models';

const callbacks: Dictionary = {};

function getUniqueId(): string {
	return ((1 + Math.random()) * 0x1000000).toString(16).substring(1);
}

function pushSlot(adStack: OldLazyQueue<AdStackElement>, node: HTMLElement): void {
	adStack.push({
		id: node.id,
	});
}

class ScrollListener {
	init(): void {
		let requestAnimationFrameHandleAdded = false;

		document.addEventListener('scroll', (event) => {
			if (!requestAnimationFrameHandleAdded) {
				window.requestAnimationFrame(() => {
					requestAnimationFrameHandleAdded = false;
					Object.keys(callbacks).forEach((id) => {
						if (typeof callbacks[id] === 'function') {
							callbacks[id](event, id);
						}
					});
				});
				requestAnimationFrameHandleAdded = true;
			}
		});
	}

	addSlot(adStack: OldLazyQueue<AdStackElement>, id: string, threshold = 0): void {
		const node = document.getElementById(id);

		if (!node) {
			return;
		}

		this.addCallback((event, callbackId) => {
			const scrollPosition =
				window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
			const slotPosition = getTopOffset(node);
			const viewPortHeight = Math.max(
				document.documentElement.clientHeight,
				window.innerHeight || 0,
			);

			if (scrollPosition + viewPortHeight > slotPosition - threshold) {
				this.removeCallback(callbackId);
				pushSlot(adStack, node);
			}
		});
	}

	addCallback(callback: (event: Event, id: string) => void): string {
		const id = getUniqueId();

		callbacks[id] = callback;

		eventService.once(events.BEFORE_PAGE_CHANGE_EVENT, () => this.removeCallback(id));

		return id;
	}

	removeCallback(id: string): void {
		delete callbacks[id];
	}
}

export const scrollListener = new ScrollListener();
