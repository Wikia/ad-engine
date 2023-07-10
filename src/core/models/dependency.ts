import { delay, DependencyContainer, InjectionToken, isNormalToken } from 'tsyringe';
import { constructor } from 'tsyringe/dist/typings/types';

type BoundTemplateDependencyValue<T> = { bind: InjectionToken<T>; value: T };
type BoundTemplateDependencyProvider<T> = {
	bind: InjectionToken<T>;
	provider: (container: DependencyContainer) => T;
};
export type TemplateDependency<T = any> =
	| InjectionToken<T>
	| BoundTemplateDependencyValue<T>
	| BoundTemplateDependencyProvider<T>;

// It could be exported from tsyringe, but it is not
type DelayedConstructor<T> = ReturnType<typeof delay<T>>;
const isConstructorToken = (
	dependency: InjectionToken,
): dependency is constructor<any> | DelayedConstructor<any> => typeof dependency === 'function';

export const isInjectionToken = (
	dependency: TemplateDependency,
): dependency is InjectionToken<unknown> =>
	isNormalToken(dependency as InjectionToken) || isConstructorToken(dependency as InjectionToken);

export const isDependencyProvider = (
	dependency: TemplateDependency,
): dependency is BoundTemplateDependencyProvider<unknown> => {
	return (
		!isInjectionToken(dependency) &&
		dependency.bind !== undefined &&
		'provider' in dependency &&
		dependency.provider !== undefined
	);
};

export const isDependencyValue = (
	dependency: TemplateDependency,
): dependency is BoundTemplateDependencyValue<unknown> => {
	return (
		!isInjectionToken(dependency) &&
		dependency.bind !== undefined &&
		'value' in dependency &&
		dependency.value !== undefined
	);
};
