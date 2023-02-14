import { container, DependencyContainer, injectable, InjectionToken } from 'tsyringe';
import { AdSlot, Dictionary } from '../../models/';
import { TEMPLATE } from './template-symbols';

type BoundTemplateDependencyValue<T> = { bind: InjectionToken<T>; value: T };
type BoundTemplateDependencyProvider<T> = {
	bind: InjectionToken<T>;
	provider: (container: DependencyContainer) => T;
};
export type TemplateDependency<T = any> =
	| InjectionToken<T>
	| BoundTemplateDependencyValue<T>
	| BoundTemplateDependencyProvider<T>;

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
		this.container.reset();
	}

	getContainer(): DependencyContainer {
		return this.container;
	}

	private isDependencyProvider(
		dependency: TemplateDependency,
	): dependency is BoundTemplateDependencyProvider<unknown> {
		return (
			!this.isSimpleDependency(dependency) &&
			Object.hasOwn(dependency, 'bind') &&
			// @ts-expect-error FIXME wtf?
			dependency?.bind !== undefined &&
			Object.hasOwn(dependency, 'provider') &&
			// @ts-expect-error FIXME wtf?
			dependency?.provider !== undefined
		);
	}

	private register(dependency: TemplateDependency): void {
		if (this.isDependencyProvider(dependency)) {
			this.container.register(dependency.bind, { useFactory: dependency.provider });
			return;
		}

		if (this.isDependencyValue(dependency)) {
			this.container.register(dependency.bind, { useValue: dependency.value });
			return;
		}

		this.container.register(
			dependency,
			// @ts-expect-error Typescript cannot figure out which overload method to use
			this.isSimpleDependency(dependency) ? { useValue: dependency } : { useClass: dependency },
		);
	}

	private isDependencyValue(
		dependency: TemplateDependency,
	): dependency is BoundTemplateDependencyValue<unknown> {
		return (
			!this.isSimpleDependency(dependency) &&
			Object.hasOwn(dependency, 'bind') &&
			// @ts-expect-error FIXME wtf?
			dependency?.bind !== undefined &&
			Object.hasOwn(dependency, 'value') &&
			// @ts-expect-error FIXME wtf?
			dependency?.value !== undefined
		);
	}

	private isSimpleDependency(dependency: TemplateDependency): dependency is string | symbol {
		return ['string', 'symbol'].includes(typeof dependency);
	}
}
