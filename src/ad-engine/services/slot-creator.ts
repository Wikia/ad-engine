interface SlotCreatorBaseConfig {
	slotName: string;
	insertMethod: 'append' | 'prepend' | 'after' | 'before';
	classes?: string[];
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

export class SlotCreator {
	createSlot(flakyConfig: SlotCreatorConfig): HTMLElement {
		const config = this.fillConfig(flakyConfig);
		const slot = this.makeSlot(config.slotName, config.classes);

		config.refElement[config.insertMethod](slot);

		return slot;
	}

	private fillConfig(flakyConfig: SlotCreatorConfig): SlotCreatorResolvedConfig {
		return {
			...flakyConfig,
			classes: flakyConfig.classes ?? [],
			refElement: this.getRefElement(flakyConfig),
		};
	}

	private getRefElement(config: SlotCreatorConfig): Element {
		if ('refElement' in config) {
			return config.refElement;
		}

		const refElement = document.querySelectorAll(config.refSelectors)[config.refIndex];

		if (!refElement) {
			throw new Error(
				`Error while trying to create slot ${config.slotName}.
				Element selected with "document.querySelectorAll('${config.refSelectors}')[${config.refIndex}]" does not exist.`,
			);
		}

		return refElement;
	}

	private makeSlot(slotName: string, classes: string[]): HTMLElement {
		const container = document.createElement('div');

		container.id = slotName;
		container.classList.add('gpt-ad', 'hide', ...classes);

		return container;
	}
}
