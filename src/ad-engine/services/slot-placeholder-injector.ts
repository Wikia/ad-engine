import {
	AD_LABEL_CLASS,
	getTopOffset,
	getTranslation,
	isInTheSameViewport,
	logger,
} from '../utils';

const logGroup = 'slot-placeholder-injector';

export type SlotPlaceholderConfigType = SlotPlaceholderConfig | RepeatableSlotPlaceholderConfig;

export interface SlotPlaceholderConfig {
	classList: string[];
	anchorSelector: string;
	insertMethod: 'append' | 'prepend' | 'after' | 'before';
	avoidConflictWith?: string[];
}

export interface RepeatableSlotPlaceholderConfig extends SlotPlaceholderConfig {
	repeatStart: number;
	repeatLimit: number;
}

class SlotPlaceholderInjector {
	injectAndRepeat(
		placeholderConfig: RepeatableSlotPlaceholderConfig,
		adSlotCategory: string,
	): number | null {
		if (placeholderConfig.repeatStart > placeholderConfig.repeatLimit) {
			return null;
		}

		let repeat = placeholderConfig.repeatStart;

		while (repeat <= placeholderConfig.repeatLimit) {
			const placeholder = this.inject(placeholderConfig);

			if (!placeholder) {
				return this.getLastPlaceholderNumber(repeat);
			}

			logger(logGroup, `Placeholder for ${adSlotCategory} number ${repeat} injected`);

			repeat++;
		}

		return this.getLastPlaceholderNumber(repeat);
	}

	inject(placeholderConfig: SlotPlaceholderConfigType): HTMLElement | null {
		const placeholder = this.createPlaceholder(placeholderConfig.classList);
		const anchorElement = this.findAnchorElement(
			placeholderConfig.anchorSelector,
			placeholderConfig.avoidConflictWith,
		);

		if (!anchorElement) {
			return null;
		}

		anchorElement[placeholderConfig.insertMethod](placeholder);

		return placeholder;
	}

	private createPlaceholder(classList: string[]): HTMLElement {
		const placeholder = document.createElement('div');

		placeholder.classList.add(...classList);
		this.addAdLabel(placeholder);

		return placeholder;
	}

	private addAdLabel(placeholder: HTMLElement): void {
		const div = document.createElement('div');
		div.className = AD_LABEL_CLASS;
		div.innerText = getTranslation('advertisement');
		div.dataset.slotName = 'incontent-boxad';
		placeholder.appendChild(div);
	}

	private findAnchorElement(
		anchorSelector: string,
		conflictingElementsSelectors = [],
	): HTMLElement | null {
		const anchorElements = this.getAnchorElements(anchorSelector);

		if (conflictingElementsSelectors.length === 0) {
			if (anchorElements.length === 0) {
				return null;
			}

			return anchorElements[0];
		}

		const conflictingElements = this.getConflictingElements(conflictingElementsSelectors);
		const anchorElement = anchorElements.find(
			(element) => !isInTheSameViewport(element, conflictingElements),
		);

		if (!anchorElement) {
			return null;
		}

		return anchorElement;
	}

	private getAnchorElements(anchorSelector: string): HTMLElement[] {
		const elements: HTMLElement[] = Array.from(document.querySelectorAll(anchorSelector));

		return elements.filter((el) => getTopOffset(el) > window.scrollY);
	}

	private getConflictingElements(conflictingElementsSelectors: string[]): HTMLElement[] {
		const elements: HTMLElement[] = [];

		conflictingElementsSelectors.forEach((selector) => {
			const selected: HTMLElement[] = Array.from(document.querySelectorAll(selector));

			elements.push(...selected);
		});

		return elements;
	}

	private getLastPlaceholderNumber(repeat: number): number {
		return repeat - 1;
	}
}

export const slotPlaceholderInjector = new SlotPlaceholderInjector();
