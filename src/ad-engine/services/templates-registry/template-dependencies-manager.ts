import { Container, Injectable } from '@wikia/dependency-injection';
import { AdSlot, Dictionary } from '../../models/';
import { TEMPLATE } from './template-symbols';

@Injectable()
export class TemplateDependenciesManager {
	constructor(private container: Container) {}

	/**
	 * Binds template slot and params. Consecutive call overwrites previous one.
	 * Designed to be called right before instantiating TemplateStateHandlers.
	 * Allows TemplateParams and TemplateAdSlot to be scoped to TemplateStateHandlers of a given Template.
	 */
	provideDependencies(
		templateName: string,
		templateSlot: AdSlot,
		templateParams: Dictionary,
		templateContext: Dictionary,
	): void {
		this.container.bind(TEMPLATE.NAME).value(templateName);
		this.container.bind(TEMPLATE.SLOT).value(templateSlot);
		this.container.bind(TEMPLATE.PARAMS).value(templateParams);
		this.container.bind(TEMPLATE.CONTEXT).value(templateContext);
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
		this.container.bind(TEMPLATE.CONTEXT).provider(() => {
			throw new Error(this.constructErrorMessage(TEMPLATE.CONTEXT.toString()));
		});
	}

	private constructErrorMessage(name: string): string {
		return `${name} can only be injected in template handler constructor`;
	}
}
