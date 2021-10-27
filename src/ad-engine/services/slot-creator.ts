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
	label?: boolean;
}

export interface SlotCreatorWrapperConfig {
	id?: string;
	classList?: string[];
}

@Injectable()
export class SlotCreator {
	createSlot(
		slotLooseConfig: SlotCreatorConfig,
		wrapperLooseConfig?: SlotCreatorWrapperConfig,
	): HTMLElement {
		const slotConfig = this.fillSlotConfig(slotLooseConfig);
		const slot = this.makeSlot(slotConfig);
		const wrapper = this.wrapSlot(slot, wrapperLooseConfig);
		const anchorElement = this.getAnchorElement(slotConfig);

		anchorElement[slotConfig.insertMethod](wrapper);

		if (slotConfig.label && slot.id !== 'top_leaderboard') {
			this.addAdLabel(slot.parentElement);
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
			label: slotLooseConfig.label || false,
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

	private addAdLabel(placeholder: HTMLElement): void {
		const div = document.createElement('div');
		div.className = 'ae-translatable-label';
		div.innerText = 'Advertisement';
		placeholder.appendChild(div);
	}

	hideAdLabel = (slotName: string): void => {
		const slotElement: HTMLElement = document.querySelector(`#${slotName}`);
		const placeholder: HTMLElement =
			slotName === 'top_leaderboard'
				? document.querySelector('.top-ads-container')
				: slotElement?.parentElement;

		const labelElement: HTMLElement = placeholder?.querySelector('.ae-translatable-label');
		labelElement?.classList.add('hide');
	};

	private throwNoPlaceToInsertError(slotName: string): void {
		throw new Error(`No place to insert slot ${slotName}.`);
	}
}
