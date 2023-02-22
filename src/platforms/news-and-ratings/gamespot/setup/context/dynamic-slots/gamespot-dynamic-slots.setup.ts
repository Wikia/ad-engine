import { context, DiProcess, utils } from '@wikia/ad-engine';

export class GamespotDynamicSlotsSetup implements DiProcess {
	private stubbedSlotsCounter = {};

	execute(): void {
		this.injectSlots();
		this.restoreStubbedSlots();
	}

	private injectSlots(): void {
		const adPlaceholders = document.querySelectorAll('.mapped-ad,.ad');

		if (!adPlaceholders || adPlaceholders.length === 0) {
			console.warn('AdEngine did not find any ad placeholders');
			return;
		}

		adPlaceholders.forEach((placeholder: Element) => {
			const adSlotName = placeholder.getAttribute('data-ad-type');
			const adWrapper = utils.Document.getFirstElementChild(placeholder);

			if (!adWrapper) {
				return;
			}

			adWrapper.id = adSlotName;

			if (this.isSlotLazyLoaded(adSlotName)) {
				context.push('events.pushOnScroll.ids', adSlotName);
			} else {
				context.push('state.adStack', { id: adSlotName });
			}
		});
	}

	private isSlotLazyLoaded(slotName: string): boolean {
		return context.get(`slots.${slotName}.lazyLoad`);
	}

	private restoreStubbedSlots(): void {
		const stubSlots = document.querySelectorAll('.stub-mpu');

		if (!stubSlots || stubSlots.length === 0) {
			return;
		}

		stubSlots.forEach((stub: Element) => {
			stub.insertAdjacentHTML('beforebegin', stub.innerHTML);
			const newSlotElement: HTMLElement = stub?.parentElement.querySelector('.mapped-ad');
			const baseSlotName = newSlotElement?.dataset['adType'];

			if (typeof this.stubbedSlotsCounter[baseSlotName] !== 'number') {
				this.stubbedSlotsCounter[baseSlotName] = 1;
				newSlotElement.id = baseSlotName;

				context.push('events.pushOnScroll.ids', baseSlotName);
			} else {
				this.stubbedSlotsCounter[baseSlotName]++;
				const newSlotName = `${baseSlotName}-${this.stubbedSlotsCounter[baseSlotName]}`;
				newSlotElement.id = newSlotName;

				this.updateSlotContext(baseSlotName, newSlotName);
				context.push('events.pushOnScroll.ids', newSlotName);
			}
		});
	}

	private updateSlotContext(baseSlotName: string, slotName: string) {
		context.set(`slots.${slotName}`, { ...context.get(`slots.${baseSlotName}`) });
		context.set(`slots.${slotName}.slotName`, slotName);
		context.set(`slots.${slotName}.targeting.pos`, slotName);
	}
}
