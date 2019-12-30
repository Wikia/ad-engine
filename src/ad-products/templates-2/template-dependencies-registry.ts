import { AdSlot, Dictionary } from '@ad-engine/core';
import { Container, Injectable } from '@wikia/dependency-injection';
import { TemplateAdSlot } from './template-ad-slot';
import { TemplateParams } from './template-params';

@Injectable()
export class TemplateDependenciesRegistry {
	constructor(private container: Container) {}

	register(templateName: string, slot: AdSlot, templateParams: Dictionary = {}): void {
		// override params.slotName by splitting it by comma
		// and picking first occurrence so we can rely on it
		// in used creative templates
		if (this.slotNameExists(templateParams)) {
			templateParams.slotName = templateParams.slotName.split(',').shift();
		}

		this.container.bind(TemplateParams).value({ ...templateParams, templateName });
		this.container.bind(TemplateAdSlot).value(slot);
	}

	private slotNameExists(templateParams: Dictionary): templateParams is { slotName: string } {
		return (
			templateParams &&
			(typeof templateParams.slotName === 'string' || templateParams.slotName instanceof String)
		);
	}
}
