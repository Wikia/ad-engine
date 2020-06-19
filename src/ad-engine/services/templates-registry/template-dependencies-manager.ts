import { Container, Injectable } from '@wikia/dependency-injection';
import { AdSlot, Dictionary } from '../../models/';
import { TEMPLATE } from './template-symbols';

export type TemplateDependency<T = any> = Parameters<Container['bind']>[0];

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
		dependencies: TemplateDependency[],
	): void {
		this.container.bind(TEMPLATE.NAME).value(templateName);
		this.container.bind(TEMPLATE.SLOT).value(templateSlot);
		this.container.bind(TEMPLATE.PARAMS).value(templateParams);
		dependencies.forEach((dependency) => this.container.bind(dependency));
	}

	resetDependencies(dependencies: TemplateDependency[]): void {
		this.container.unbind(TEMPLATE.PARAMS);
		this.container.unbind(TEMPLATE.SLOT);
		this.container.unbind(TEMPLATE.NAME);
		dependencies.forEach((dependency) => this.container.unbind(dependency));
	}
}
