import {
	Action,
	action,
	ActionCreator,
	Creator,
	FunctionWithParametersType,
	NotTyped,
	ParametersType,
	Typed,
} from 'ts-action';

export type GlobalAction = Action & { __global: true };
export type GlobalActionCreator = ActionCreator & { __global: true };

export function isGlobalAction(input: Action): input is GlobalAction {
	return (input as any).__global === true;
}

export function isGlobalActionCreator(input: ActionCreator): input is GlobalActionCreator {
	return (input as any).__global === true;
}

export function globalAction<T extends string>(type: T): ActionCreator<T, () => Typed<{}, T>>;
export function globalAction<T extends string>(
	type: T,
	// tslint:disable-next-line:unified-signatures
	config: { _as: 'empty' },
): ActionCreator<T, () => Typed<{}, T>>;
export function globalAction<T extends string, P, M>(
	type: T,
	config: { _as: 'fsa'; _p: P; _m: M },
): ActionCreator<
	T,
	(
		payload: P | Error,
		meta?: M,
	) =>
		| Typed<{ error: false; meta?: M; payload: P }, T>
		| Typed<{ error: true; meta?: M; payload: P }, T>
>;
export function globalAction<T extends string, P>(
	type: T,
	config: { _as: 'payload'; _p: P },
): ActionCreator<T, (payload: P) => Typed<{ payload: P }, T>>;
export function globalAction<T extends string, P extends object>(
	type: T,
	config: { _as: 'props'; _p: P },
): ActionCreator<T, (props: P & NotTyped<P>) => Typed<P, T>>;
export function globalAction<T extends string, C extends Creator>(
	type: T,
	creator: C & NotTyped<ReturnType<C>>,
): Typed<FunctionWithParametersType<ParametersType<C>, Typed<ReturnType<C>, T>>, T>;
export function globalAction<T extends string>(
	type: T,
	config?: { _as: 'empty' } | { _as: 'fsa' } | { _as: 'payload' } | { _as: 'props' } | Creator,
): Creator {
	const originalCreator = action(type, config as any);
	const globalCreator = (...creatorArgs: Parameters<typeof originalCreator>) => {
		const result = originalCreator(...creatorArgs);

		return {
			...result,
			__global: true,
		};
	};

	Object.defineProperty(globalCreator, 'type', {
		value: type,
		writable: false,
	});
	Object.defineProperty(globalCreator, '__global', {
		value: true,
		writable: false,
	});

	return globalCreator;
}
