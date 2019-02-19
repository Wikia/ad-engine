import { events } from '../services/events';
import { getTopOffset } from '../utils/dimensions';

const callbacks = {};

function getUniqueId() {
	return ((1 + Math.random()) * 0x1000000).toString(16).substring(1);
}

function pushSlot(adStack, node) {
	adStack.push({
		id: node.id,
	});
}

class ScrollListener {
	init() {
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

	addSlot(adStack, id, threshold = 0) {
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

	addCallback(callback) {
		const id = getUniqueId();

		callbacks[id] = callback;

		events.once(events.BEFORE_PAGE_CHANGE_EVENT, () => this.removeCallback(id));

		return id;
	}

	removeCallback(id) {
		delete callbacks[id];
	}
}

export const scrollListener = new ScrollListener();
