import { getTopOffset, isInTheSameViewport, logger } from '../utils';

const logGroup = 'slot-placeholder-injector';

export interface SlotPlaceholderConfig {
	classList: string[];
	anchorSelector: string;
	insertMethod: 'append' | 'prepend' | 'after' | 'before';
	avoidConflictWith?: string[];
	repeatLimit?: number;
}

class SlotPlaceholderInjector {
	injectAndRepeat(placeholderConfig: SlotPlaceholderConfig, adSlotCategory: string): number {
		// Placeholder is repeatable. The first one is already injected so we start counting from 2.
		let repeat = 2;

		placeholderConfig.repeatLimit = placeholderConfig.repeatLimit || 0;

		while (repeat <= placeholderConfig.repeatLimit) {
			const placeholder = this.inject(placeholderConfig);

			if (!placeholder) {
				return repeat;
			}

			logger(logGroup, `Placeholder for ${adSlotCategory} number ${repeat} injected`);

			repeat++;
		}

		return repeat;
	}

	inject(placeholderConfig: SlotPlaceholderConfig): HTMLElement | null {
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

		return placeholder;
	}

	private findAnchorElement(
		anchorSelector: string,
		conflictingElementsSelectors?: string[],
	): HTMLElement | null {
		const anchorElements = this.getAnchorElements(anchorSelector);
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
}

export const slotPlaceholderInjector = new SlotPlaceholderInjector();
