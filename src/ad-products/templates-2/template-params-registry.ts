import { Dictionary } from '@ad-engine/core';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class TemplateParamsRegistry {
	register(templateName: string, templateParams: Dictionary): void {
		// override params.slotName by splitting it by comma
		// and picking first occurrence so we can rely on it
		// in used creative templates
		if (this.slotNameExists(templateParams)) {
			templateParams.slotName = templateParams.slotName.split(',').shift();
		}

		// TODO: save somewhere templateParams to be retrieved by templateName
	}

	private slotNameExists(templateParams: Dictionary): templateParams is { slotName: string } {
		return (
			templateParams &&
			(typeof templateParams.slotName === 'string' || templateParams.slotName instanceof String)
		);
	}
}
