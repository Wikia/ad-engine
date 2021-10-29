import { Injectable } from '@wikia/dependency-injection';
import { getTopOffset, getViewportHeight, isInTheSameViewport } from '../utils/dimensions';
export type insertMethodType = 'append' | 'prepend' | 'after' | 'before';

export interface SlotCreatorConfig {
	slotName: string;
	insertMethod: insertMethodType;
	anchorSelector: string;
	/**
	 * @default firstViable
	 */
	anchorPosition?: number | 'firstViable' | 'belowFirstViewport' | 'belowScrollPosition';
	avoidConflictWith?: string[];
	classList?: string[];
	repeat?: object;
	placeholderConfig?: SlotPlaceholderContextConfig;
}

export interface SlotCreatorWrapperConfig {
	id?: string;
	classList?: string[];
}

export interface SlotPlaceholderContextConfig {
	createLabel?: boolean;
	elementToHide?: string;
}

@Injectable()
export class SlotCreator {
	static AD_LABEL_CLASS = 'ae-translatable-label';

	createSlot(
		slotLooseConfig: SlotCreatorConfig,
		wrapperLooseConfig?: SlotCreatorWrapperConfig,
	): HTMLElement {
		const slotConfig = this.fillSlotConfig(slotLooseConfig);
		const slot = this.makeSlot(slotConfig);
		const wrapper = this.wrapSlot(slot, wrapperLooseConfig);
		const anchorElement = this.getAnchorElement(slotConfig);

		anchorElement[slotConfig.insertMethod](wrapper);

		if (slotConfig.placeholderConfig.createLabel) {
			this.addAdLabel(slot.parentElement, slotConfig.slotName);
		}

		return slot;
	}

	private fillSlotConfig(slotLooseConfig: SlotCreatorConfig): Required<SlotCreatorConfig> {
		return {
			...slotLooseConfig,
			anchorPosition: slotLooseConfig.anchorPosition ?? 'firstViable',
			avoidConflictWith: slotLooseConfig.avoidConflictWith || [],
			classList: slotLooseConfig.classList || [],
			repeat: slotLooseConfig.repeat || {},
			placeholderConfig: slotLooseConfig.placeholderConfig,
		};
	}

	private getAnchorElement(slotConfig: Required<SlotCreatorConfig>): HTMLElement {
		const anchorElements = this.getAnchorElements(slotConfig);
		const conflictElements = this.getConflictElements(slotConfig);
		const result = anchorElements.find(
			(anchorElement) => !isInTheSameViewport(anchorElement, conflictElements),
		);

		if (!result) {
			this.throwNoPlaceToInsertError(slotConfig.slotName);
		}

		return result;
	}

	private getAnchorElements(slotConfig: Required<SlotCreatorConfig>): HTMLElement[] {
		const elements: HTMLElement[] = Array.from(
			document.querySelectorAll(slotConfig.anchorSelector),
		);

		switch (slotConfig.anchorPosition) {
			case 'belowFirstViewport':
				return elements.filter((el) => getTopOffset(el) > getViewportHeight());
			case 'belowScrollPosition':
				return elements.filter((el) => getTopOffset(el) > window.scrollY);
			case 'firstViable':
				return elements;
			default:
				const element = elements[slotConfig.anchorPosition];

				if (!element) {
					this.throwNoPlaceToInsertError(slotConfig.slotName);
				}

				return [element];
		}
	}

	private getConflictElements(slotConfig: Required<SlotCreatorConfig>): HTMLElement[] {
		const elements: HTMLElement[] = [];

		slotConfig.avoidConflictWith.forEach((selector) => {
			const selected: HTMLElement[] = Array.from(document.querySelectorAll(selector));

			elements.push(...selected);
		});

		return elements;
	}

	private makeSlot(slotConfig: Required<SlotCreatorConfig>): HTMLElement {
		const slot = document.createElement('div');

		slot.id = slotConfig.slotName;
		slot.classList.add('gpt-ad', ...slotConfig.classList);

		return slot;
	}

	private wrapSlot(slot: HTMLElement, wrapperLooseConfig?: SlotCreatorWrapperConfig): HTMLElement {
		if (!wrapperLooseConfig) {
			return slot;
		}

		const wrapper = document.createElement('div');

		if (wrapperLooseConfig.classList) {
			wrapper.classList.add(...wrapperLooseConfig.classList);
		}
		if (wrapperLooseConfig.id) {
			wrapper.id = wrapperLooseConfig.id;
		}
		wrapper.append(slot);

		return wrapper;
	}

	private addAdLabel(placeholder: HTMLElement, slotName: string): void {
		const div = document.createElement('div');
		div.className = SlotCreator.AD_LABEL_CLASS;
		div.innerText = 'Advertisement';
		div.dataset.slotName = slotName;
		placeholder.appendChild(div);
	}

	private throwNoPlaceToInsertError(slotName: string): void {
		throw new Error(`No place to insert slot ${slotName}.`);
	}
}
