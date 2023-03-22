import { communicationService } from '@ad-engine/communication';
import { Injectable } from '@wikia/dependency-injection';
import { AdSlot, RepeatConfig } from '../models';
import {
	AD_LABEL_CLASS,
	getTopOffset,
	getTranslation,
	getViewportHeight,
	isInTheSameViewport,
	logger,
} from '../utils';
import { context } from './context-service';
import { SlotRepeater } from './slot-repeater';
export type InsertMethodType = 'append' | 'prepend' | 'after' | 'before';

export interface SlotCreatorConfig {
	slotName: string;
	insertMethod: InsertMethodType;
	anchorSelector: string;
	/**
	 * @default firstViable
	 */
	anchorPosition?: number | 'firstViable' | 'belowFirstViewport' | 'belowScrollPosition';
	avoidConflictWith?: string[];
	classList?: string[];
	repeat?: RepeatConfig;
	placeholderConfig?: SlotPlaceholderContextConfig;
}

export interface SlotCreatorWrapperConfig {
	id?: string;
	classList?: string[];
}

export interface SlotPlaceholderContextConfig {
	createLabel?: boolean;
	adLabelParent?: string;
}

const groupName = 'slot-creator';

@Injectable()
export class SlotCreator {
	private slotRepeater = new SlotRepeater();

	createSlot(
		slotLooseConfig: SlotCreatorConfig,
		wrapperLooseConfig?: SlotCreatorWrapperConfig,
	): HTMLElement {
		if (!slotLooseConfig) {
			return null;
		}

		logger(groupName, `Creating: ${slotLooseConfig.slotName}`, slotLooseConfig, wrapperLooseConfig);

		const slotConfig = this.fillSlotConfig(slotLooseConfig);
		const slot = this.makeSlot(slotConfig);
		const wrapper = this.wrapSlot(slot, wrapperLooseConfig);
		const anchorElement = this.getAnchorElement(slotConfig);

		anchorElement[slotConfig.insertMethod](wrapper);

		if (slotConfig.placeholderConfig?.createLabel) {
			this.addAdLabel(slot.parentElement, slotConfig.slotName);
		}

		if (slotConfig.repeat) {
			this.setupSlotRepeat(slotConfig);
		}

		return slot;
	}

	private fillSlotConfig(slotLooseConfig: SlotCreatorConfig): Required<SlotCreatorConfig> {
		return {
			...slotLooseConfig,
			anchorPosition: slotLooseConfig.anchorPosition ?? 'firstViable',
			avoidConflictWith: slotLooseConfig.avoidConflictWith || [],
			classList: slotLooseConfig.classList || [],
			repeat: slotLooseConfig.repeat,
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

		logger(groupName, 'getAnchorElement() called', slotConfig, result);

		return result;
	}

	private getAnchorElements(slotConfig: Required<SlotCreatorConfig>): HTMLElement[] {
		const elements: HTMLElement[] = Array.from(
			document.querySelectorAll(slotConfig.anchorSelector),
		);

		switch (slotConfig.anchorPosition) {
			case 'belowFirstViewport': {
				return elements.filter((el) => getTopOffset(el) > getViewportHeight());
			}
			case 'belowScrollPosition': {
				return elements.filter((el) => getTopOffset(el) > window.scrollY);
			}
			case 'firstViable': {
				return elements;
			}
			default: {
				const element = elements[slotConfig.anchorPosition];

				if (!element) {
					this.throwNoPlaceToInsertError(slotConfig.slotName);
				}

				return [element];
			}
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
		div.className = AD_LABEL_CLASS;
		div.innerText = getTranslation('advertisement');
		div.dataset.slotName = slotName;
		placeholder.appendChild(div);
	}

	private setupSlotRepeat(slotConfig: Required<SlotCreatorConfig>): void {
		communicationService.onSlotEvent(
			AdSlot.SLOT_RENDERED_EVENT,
			({ slot }) => {
				if (!slot.isEnabled()) {
					return;
				}

				logger(groupName, `Repeating: ${slotConfig.slotName}`);

				slotConfig.repeat.index += 1;

				const newSlotName = this.slotRepeater.repeatSlot(slot, slotConfig.repeat);

				if (!newSlotName) {
					return;
				}

				const updatedSlotConfig = {
					...slotConfig,
					...(slotConfig.repeat.updateCreator || {}),
					slotName: newSlotName,
				};

				try {
					this.createSlot(updatedSlotConfig);
				} catch (e) {
					logger(groupName, `There is not enough space for ${newSlotName}`);

					return;
				}

				logger(groupName, 'Injecting slot:', newSlotName);

				if (slotConfig.repeat.disablePushOnScroll !== true) {
					context.push('events.pushOnScroll.ids', newSlotName);
				}
			},
			slotConfig.slotName,
			true,
		);
	}

	private throwNoPlaceToInsertError(slotName: string): void {
		throw new Error(`No place to insert slot ${slotName}.`);
	}
}
