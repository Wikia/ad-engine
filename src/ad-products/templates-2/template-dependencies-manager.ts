import { AdSlot, Dictionary } from '@ad-engine/core';
import { Container, Injectable } from '@wikia/dependency-injection';
import { TEMPLATE } from './template-symbols';

@Injectable()
export class TemplateDependenciesManager {
	constructor(private container: Container) {}

	/**
	 * Binds template slot and params. Consecutive call overwrites previous one.
	 * Designed to be called right before instantiating TemplateStateHandlers.
	 * Allows TemplateParams and TemplateAdSlot to be scoped to TemplateStateHandlers of a given Template.
	 */
	provideDependencies(templateName: string, slot: AdSlot, templateParams: Dictionary = {}): void {
		// override params.slotName by splitting it by comma and picking first occurrence
		// so we can rely on it in used creative templates
		if (this.slotNameExists(templateParams)) {
			templateParams.slotName = templateParams.slotName.split(',').shift();
		}

		this.container.bind(TEMPLATE.PARAMS).value({ ...templateParams, templateName });
		this.container.bind(TEMPLATE.SLOT).value(slot);
		this.container.bind(TEMPLATE.NAME).value(templateName);
	}

	private slotNameExists(templateParams: Dictionary): templateParams is { slotName: string } {
		return (
			templateParams &&
			(typeof templateParams.slotName === 'string' || templateParams.slotName instanceof String)
		);
	}

	resetDependencies(): void {
		this.container.bind(TEMPLATE.PARAMS).provider(() => {
			throw new Error(this.constructErrorMessage(TEMPLATE.PARAMS.toString()));
		});
		this.container.bind(TEMPLATE.SLOT).provider(() => {
			throw new Error(this.constructErrorMessage(TEMPLATE.SLOT.toString()));
		});
		this.container.bind(TEMPLATE.NAME).provider(() => {
			throw new Error(this.constructErrorMessage(TEMPLATE.NAME.toString()));
		});
	}

	private constructErrorMessage(name: string): string {
		return `${name} can only be injected in template handler constructor`;
	}
}
