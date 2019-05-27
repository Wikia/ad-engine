import { AdSlot } from '../models';
import { logger } from '../utils';
import { likhoService, LikhoStorageElement } from './likho';
import { messageBus } from './message-bus';
import { slotService } from './slot-service';

const logGroup = 'slot-tweaker';

export class SlotTweaker {
	/** @readonly */
	static SLOT_CLOSE_IMMEDIATELY = 'force-close';

	forceRepaint(domElement: HTMLElement): number {
		return domElement.offsetWidth;
	}

	getContainer(adSlot: AdSlot): HTMLElement {
		const container = adSlot.getElement();

		if (!container) {
			logger(logGroup, 'cannot find container', adSlot.getSlotName());
		}

		return container;
	}

	addDefaultClasses(adSlot: AdSlot): void {
		const container = this.getContainer(adSlot);
		const defaultClasses = adSlot.getConfigProperty('defaultClasses') || [];

		if (container && defaultClasses.length) {
			defaultClasses.forEach((className) => container.classList.add(className));
		}
	}

	hide(adSlot: AdSlot): void {
		const container = this.getContainer(adSlot);

		if (container) {
			logger(logGroup, 'hide', adSlot.getSlotName());
			container.classList.add('hide');
		}
	}

	show(adSlot: AdSlot): void {
		const container = this.getContainer(adSlot);

		if (container) {
			logger(logGroup, 'show', adSlot.getSlotName());
			container.classList.remove('hide');
		}
	}

	collapse(adSlot: AdSlot): void {
		const container = this.getContainer(adSlot);

		container.style.maxHeight = `${container.scrollHeight}px`;
		this.forceRepaint(container);
		container.classList.add('slot-animation');
		container.style.maxHeight = '0';
	}

	expand(adSlot: AdSlot): void {
		const container = this.getContainer(adSlot);

		container.style.maxHeight = `${container.offsetHeight}px`;
		container.classList.remove('hide');
		container.classList.add('slot-animation');
		container.style.maxHeight = `${container.scrollHeight}px`;
	}

	makeResponsive(
		adSlot: AdSlot,
		aspectRatio: number = null,
		paddingBottom = true,
	): Promise<HTMLIFrameElement> {
		const slotContainer = this.getContainer(adSlot);

		slotContainer.classList.add('slot-responsive');

		return this.onReady(adSlot).then((iframe) => {
			const container = iframe.parentElement;

			if (!aspectRatio) {
				const height = iframe.contentWindow.document.body.scrollHeight;
				const width = iframe.contentWindow.document.body.scrollWidth;

				aspectRatio = width / height;
			}

			logger(logGroup, 'make responsive', adSlot.getSlotName());
			if (paddingBottom) {
				container.style.paddingBottom = `${100 / aspectRatio}%`;
			}

			return iframe;
		});
	}

	onReady(adSlot: AdSlot): Promise<HTMLIFrameElement> {
		function getIframe(): HTMLIFrameElement {
			const iframe = adSlot.getIframe();

			if (!iframe) {
				throw new Error('Cannot find iframe element');
			}

			return iframe;
		}

		if (adSlot.getConfigProperty('useGptOnloadEvent')) {
			return adSlot.loaded.then(getIframe);
		}

		return new Promise<HTMLIFrameElement>((resolve) => {
			const iframe: HTMLIFrameElement = getIframe();
			let iframeDocument = null;

			try {
				iframeDocument = iframe.contentWindow.document;
			} catch (ignore) {
				logger(logGroup, adSlot.getSlotName(), 'loaded through SafeFrame');
			}

			if (iframeDocument && iframeDocument.readyState === 'complete') {
				resolve(iframe);
			} else {
				iframe.addEventListener('load', () => resolve(iframe));
			}
		});
	}

	adjustIframeByContentSize(adSlot: AdSlot): void {
		this.onReady(adSlot).then((iframe) => {
			const height = iframe.contentWindow.document.body.scrollHeight;
			const width = iframe.contentWindow.document.body.scrollWidth;

			iframe.width = width.toString();
			iframe.height = height.toString();

			logger(logGroup, 'adjust size', adSlot.getSlotName(), width, height);
		});
	}

	registerMessageListener(): void {
		messageBus.register(
			{
				keys: ['action', 'slotName'],
				infinite: true,
			},
			(data) => {
				if (!data.slotName) {
					logger(logGroup, 'Missing slot name');

					return;
				}

				const adSlot = slotService.get(data.slotName);

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
			},
		);

		messageBus.register(
			{
				keys: ['action', 'likhoType'],
				infinite: true,
			},
			(data: LikhoStorageElement) => {
				if (data.likhoType) {
					likhoService.update(data.likhoType);
				}
			},
		);
	}

	setDataParam(adSlot: AdSlot, attrName: string, data: any): void {
		const container = this.getContainer(adSlot);
		if (container) {
			container.dataset[attrName] = typeof data === 'string' ? data : JSON.stringify(data);
		}
	}
}

export const slotTweaker = new SlotTweaker();
