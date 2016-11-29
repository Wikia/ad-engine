import MessageBus from './message-bus';
import SlotService from './slot-service';
import { logger } from '../utils/logger';

const logGroup = 'slot-tweaker';

function forceRepaint(domElement) {
	return domElement.offsetWidth;
}

export default {
	getContainer(adSlot) {
		const container = document.getElementById(adSlot.getId());

		if (!container) {
			logger(logGroup, 'cannot find container', adSlot.getId());
		}

		return container;
	},

	hide(adSlot) {
		const container = this.getContainer(adSlot);

		if (container) {
			logger(logGroup, 'hide', adSlot.getId());
			container.classList.add('hide');
		}
	},

	show(adSlot) {
		const container = this.getContainer(adSlot);

		if (container) {
			logger(logGroup, 'show', adSlot.getId());
			container.classList.remove('hide');
		}
	},

	collapse(adSlot) {
		const container = this.getContainer(adSlot);

		container.style.maxHeight = `${container.scrollHeight}px`;
		forceRepaint(container);
		container.classList.add('slot-animation');
		container.style.maxHeight = '0';
	},

	expand(adSlot) {
		const container = this.getContainer(adSlot);

		container.style.maxHeight = `${container.offsetHeight}px`;
		container.classList.remove('hide');
		container.classList.add('slot-animation');
		container.style.maxHeight = `${container.scrollHeight}px`;
	},

	calculateIframeAspectRatio(iframe) {
		const height = iframe.contentWindow.document.body.scrollHeight,
			width = iframe.contentWindow.document.body.scrollWidth;

		return width / height;
	},

	makeResponsive(adSlot, aspectRatio = null) {
		const slotContainer = this.getContainer(adSlot);

		slotContainer.classList.add('slot-responsive');

		return new Promise((resolve) => {
			this.onReady(adSlot, (iframe) => {
				const container = iframe.parentElement;
				if (!aspectRatio) {
					aspectRatio = this.calculateIframeAspectRatio(iframe);
				}

				logger(logGroup, 'make responsive', adSlot.getId());
				container.style.paddingBottom = `${100 / aspectRatio}%`;
				resolve(iframe);
			});
		});
	},

	onReady(adSlot, callback) {
		const container = this.getContainer(adSlot),
			iframe = container.querySelector('div[id*="_container_"] iframe');

		if (!iframe) {
			return;
		}

		if (iframe.contentWindow.document.readyState === 'complete') {
			callback(iframe);
		} else {
			iframe.addEventListener('load', () => {
				callback(iframe);
			});
		}
	},

	registerMessageListener() {
		MessageBus.register({
			keys: ['action', 'slotName'],
			infinite: true
		}, (data) => {
			if (!data.slotName) {
				logger(logGroup, 'Missing slot name');
				return;
			}

			const adSlot = SlotService.getBySlotName(data.slotName);

			switch (data.action) {
				case 'expand':
					this.expand(adSlot);
					break;
				case 'collapse':
					this.collapse(adSlot);
					break;
				case 'hide':
					this.hide(adSlot);
					break;
				case 'show':
					this.show(adSlot);
					break;
				case 'make-responsive':
					this.makeResponsive(adSlot, data.aspectRatio);
					break;
				default:
					logger(logGroup, 'Unknown action', data.action);
			}
		});
	}
};
