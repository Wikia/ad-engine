import { AdSlot } from '../models';
import { isIframe, logger } from '../utils';
import { fillerService } from './filler-service';
import { likhoService, LikhoStorageElement } from './likho';
import { messageBus } from './message-bus';
import { slotService } from './slot-service';

const logGroup = 'slot-tweaker';

interface SlotActionMessage {
	action: string;
	slotName: string;
	aspectRatio?: number;
}

export class SlotTweaker {
	static readonly SLOT_CLOSE_IMMEDIATELY = 'force-close';

	forceRepaint(domElement: HTMLElement): number {
		return domElement.offsetWidth;
	}

	addDefaultClasses(adSlot: AdSlot): void {
		const container = adSlot.getElement();
		const defaultClasses = adSlot.getConfigProperty('defaultClasses') || [];

		if (container && defaultClasses.length) {
			defaultClasses.forEach((className) => container.classList.add(className));
		}
	}

	collapse(adSlot: AdSlot): void {
		const container = adSlot.getElement();

		container.style.maxHeight = `${container.scrollHeight}px`;
		this.forceRepaint(container);
		container.classList.add('slot-animation');
		container.style.maxHeight = '0';
	}

	expand(adSlot: AdSlot): void {
		const container = adSlot.getElement();

		container.style.maxHeight = `${container.offsetHeight}px`;
		container.classList.remove('hide');
		container.classList.add('slot-animation');
		container.style.maxHeight = `${container.scrollHeight}px`;
	}

	async makeResponsive(
		adSlot: AdSlot,
		aspectRatio: number = null,
		paddingBottom = true,
	): Promise<HTMLIFrameElement | HTMLElement> {
		adSlot.addClass('slot-responsive');
		logger(logGroup, 'make responsive', adSlot.getSlotName());

		const element = await this.onReady(adSlot);

		this.setPaddingBottom(element, aspectRatio, paddingBottom);

		return element;
	}

	setPaddingBottom(element: HTMLElement, aspectRatio: number | null, paddingBottom = true): void {
		let container: HTMLElement;
		let ratio = aspectRatio;

		if (isIframe(element)) {
			if (!aspectRatio) {
				const height = element.contentWindow.document.body.scrollHeight;
				const width = element.contentWindow.document.body.scrollWidth;

				ratio = width / height;
			}
			container = element.parentElement;
		} else {
			container = element;
		}

		if (paddingBottom) {
			container.style.paddingBottom = `${100 / ratio}%`;
		}
	}

	onReady(adSlot: AdSlot): Promise<HTMLIFrameElement | HTMLElement> {
		function getIframe(): HTMLIFrameElement {
			const iframe = adSlot.getIframe();

			if (!iframe) {
				throw new Error('Cannot find iframe element');
			}

			return iframe;
		}

		function getContainer(fillerName: string): HTMLElement {
			return fillerService.get(fillerName).getContainer();
		}

		if (adSlot.getConfigProperty('customFiller')) {
			return new Promise<HTMLElement>((resolve) => {
				const container = getContainer(adSlot.getConfigProperty('customFiller'));
				resolve(container);
			});
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

	async adjustIframeByContentSize(adSlot: AdSlot): Promise<HTMLIFrameElement | HTMLElement> {
		const element = await this.onReady(adSlot);

		if (isIframe(element)) {
			const height = element.contentWindow.document.body.scrollHeight;
			const width = element.contentWindow.document.body.scrollWidth;

			element.width = width.toString();
			element.height = height.toString();
			logger(logGroup, 'adjust size', adSlot.getSlotName(), width, height);
		}

		return element;
	}

	registerMessageListener(): void {
		messageBus.register<SlotActionMessage>(
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
						adSlot.hide();
						break;
					case 'show':
						adSlot.show();
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
		const container = adSlot.getElement();
		if (container) {
			container.dataset[attrName] = typeof data === 'string' ? data : JSON.stringify(data);
		}
	}
}

export const slotTweaker = new SlotTweaker();
