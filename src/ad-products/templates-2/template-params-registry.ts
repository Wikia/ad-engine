import { Dictionary } from '@ad-engine/core';
import { Container, Injectable } from '@wikia/dependency-injection';
import { TemplateParams } from './template-params';

@Injectable()
export class TemplateParamsRegistry {
	constructor(private container: Container) {}

	register(templateName: string, templateParams: Dictionary): void {
		// override params.slotName by splitting it by comma
		// and picking first occurrence so we can rely on it
		// in used creative templates
		if (!this.slotNameExists(templateParams)) {
			throw new Error(`Template ${templateName} - slot params do not contain slot name`);
		}

		templateParams.slotName = templateParams.slotName.split(',').shift();
		this.container
			.bind(TemplateParams)
			.scope('Transient')
			.value({ ...templateParams, templateName });
	}

	private slotNameExists(templateParams: Dictionary): templateParams is { slotName: string } {
		return (
			templateParams &&
			(typeof templateParams.slotName === 'string' || templateParams.slotName instanceof String)
		);
	}
}
