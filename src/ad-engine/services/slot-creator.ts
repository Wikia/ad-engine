import { Injectable } from '@wikia/dependency-injection';

interface SlotCreatorBaseConfig {
	slotName: string;
	insertMethod: 'append' | 'prepend' | 'after' | 'before';
	wrapperClasses?: string[];
}

interface SlotCreatorSelectorsConfig extends SlotCreatorBaseConfig {
	refSelectors: string;
	refIndex?: number;
}

interface SlotCreatorElementConfig extends SlotCreatorBaseConfig {
	refElement: Element;
}

export type SlotCreatorConfig = SlotCreatorSelectorsConfig | SlotCreatorElementConfig;

type SlotCreatorResolvedConfig = Required<SlotCreatorElementConfig>;

@Injectable()
export class SlotCreator {
	createSlot(flakyConfig: SlotCreatorConfig): HTMLElement {
		const config = this.fillConfig(flakyConfig);
		const slot = this.makeSlot(config.slotName);
		const wrapper = this.wrapSlot(slot, config.wrapperClasses);

		config.refElement[config.insertMethod](wrapper);

		return slot;
	}

	private fillConfig(flakyConfig: SlotCreatorConfig): SlotCreatorResolvedConfig {
		return {
			...flakyConfig,
			wrapperClasses: flakyConfig.wrapperClasses ?? [],
			refElement: this.getRefElement(flakyConfig),
		};
	}

	private getRefElement(config: SlotCreatorConfig): Element {
		if ('refElement' in config) {
			return config.refElement;
		}

		config.refIndex = config.refIndex ?? 0;

		const refElement = document.querySelectorAll(config.refSelectors)[config.refIndex];

		if (!refElement) {
			throw new Error(
				`Error while trying to create slot ${config.slotName}.
				Element selected with "document.querySelectorAll('${config.refSelectors}')[${config.refIndex}]" does not exist.`,
			);
		}

		return refElement;
	}

	private makeSlot(slotName: string): HTMLElement {
		const slot = document.createElement('div');

		slot.id = slotName;
		slot.classList.add('gpt-ad', 'hide');

		return slot;
	}

	private wrapSlot(slot: HTMLElement, wrapperClasses: string[]): HTMLElement {
		if (!wrapperClasses.length) {
			return slot;
		}

		const wrapper = document.createElement('div');

		wrapper.classList.add(...wrapperClasses);
		wrapper.append(slot);

		return wrapper;
	}
}
