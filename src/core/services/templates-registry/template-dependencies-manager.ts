import { container, DependencyContainer, injectable, isNormalToken, Lifecycle } from 'tsyringe';
import {
	AdSlot,
	Dictionary,
	isDependencyProvider,
	isDependencyValue,
	TemplateDependency,
} from '../../models/';
import { TEMPLATE } from './template-symbols';

@injectable()
export class TemplateDependenciesManager {
	private readonly container: DependencyContainer;

	constructor() {
		this.container = container.createChildContainer();
	}

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
		this.container.register(TEMPLATE.NAME, { useValue: templateName });
		this.container.register(TEMPLATE.SLOT, { useValue: templateSlot });
		this.container.register(TEMPLATE.PARAMS, { useValue: templateParams });
		dependencies.forEach((dependency) => this.register(dependency));
	}

	resetDependencies(): void {
		this.container.clearInstances();
		this.container.reset();
	}

	getContainer(): DependencyContainer {
		return this.container;
	}

	private register(dependency: TemplateDependency): void {
		if (isDependencyProvider(dependency)) {
			this.container.register(dependency.bind, { useFactory: dependency.provider });
			return;
		}

		if (isDependencyValue(dependency)) {
			this.container.register(dependency.bind, { useValue: dependency.value });
			return;
		}

		if (isNormalToken(dependency)) {
			this.container.register(dependency, { useValue: dependency });
			return;
		}

		this.container.register(
			dependency,
			{ useClass: dependency },
			{ lifecycle: Lifecycle.ContainerScoped },
		);
	}
}
