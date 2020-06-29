import { Injectable } from '@wikia/dependency-injection';
import { getTopOffset, getViewportHeight, isInTheSameViewport } from '../utils/dimensions';

export interface SlotCreatorConfig {
	slotName: string;
	insertMethod: 'append' | 'prepend' | 'after' | 'before';
	anchorSelector: string;
	anchorPosition?: number | 'belowFirstViewport' | 'belowScrollPosition';
	avoidConflictWith?: string[];
}

export interface SlotCreatorWrapperConfig {
	id?: string;
	classes?: string[];
}

@Injectable()
export class SlotCreator {
	createSlot(
		slotLooseConfig: SlotCreatorConfig,
		wrapperLooseConfig?: SlotCreatorWrapperConfig,
	): HTMLElement {
		const slotConfig = this.fillSlotConfig(slotLooseConfig);
		const slot = this.makeSlot(slotConfig.slotName);
		const wrapper = this.wrapSlot(slot, wrapperLooseConfig);
		const anchorElement = this.getAnchorElement(slotConfig);

		anchorElement[slotConfig.insertMethod](wrapper);

		return slot;
	}

	private fillSlotConfig(slotLooseConfig: SlotCreatorConfig): Required<SlotCreatorConfig> {
		return {
			...slotLooseConfig,
			anchorPosition: slotLooseConfig.anchorPosition ?? 0,
			avoidConflictWith: slotLooseConfig.avoidConflictWith || [],
		};
	}

	private getAnchorElement(slotConfig: Required<SlotCreatorConfig>): HTMLElement {
		const anchorElements = this.getAnchorElements(slotConfig);
		const conflictElements = this.getConflictElements(slotConfig);
		const result = anchorElements.find(
			(anchorElement) => !isInTheSameViewport(anchorElement, conflictElements),
		);

		if (!result) {
			throw new Error(`No place to insert slot ${slotConfig.slotName}.`);
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
			default:
				return [elements[slotConfig.anchorPosition]];
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

	private makeSlot(slotName: string): HTMLElement {
		const slot = document.createElement('div');

		slot.id = slotName;
		slot.classList.add('gpt-ad', 'hide');

		return slot;
	}

	private wrapSlot(slot: HTMLElement, wrapperLooseConfig?: SlotCreatorWrapperConfig): HTMLElement {
		if (!wrapperLooseConfig) {
			return slot;
		}

		const wrapper = document.createElement('div');

		if (wrapperLooseConfig.classes) {
			wrapper.classList.add(...wrapperLooseConfig.classes);
		}
		if (wrapperLooseConfig.id) {
			wrapper.id = wrapperLooseConfig.id;
		}
		wrapper.append(slot);

		return wrapper;
	}
}
