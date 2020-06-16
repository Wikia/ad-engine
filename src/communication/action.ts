// tslint:disable-next-line:import-blacklist
import {
	action as tsAction,
	ActionCreator,
	Creator,
	FunctionWithParametersType,
	NotTyped,
	ParametersType,
	Typed,
} from 'ts-action';

/**
 * Use it for internal AdEngine actions.
 * Those actions will NOT be dispatched using PostQuecast.
 * Those actions will NOT be listened on PostQuecast stream.
 */
export function action<T extends string>(type: T): ActionCreator<T, () => Typed<{}, T>>;
/**
 * @see action
 */
export function action<T extends string>(
	type: T,
	// tslint:disable-next-line:unified-signatures
	config: { _as: 'empty' },
): ActionCreator<T, () => Typed<{}, T>>;
/**
 * @see action
 */
export function action<T extends string, P, M>(
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
/**
 * @see action
 */
export function action<T extends string, P>(
	type: T,
	config: { _as: 'payload'; _p: P },
): ActionCreator<T, (payload: P) => Typed<{ payload: P }, T>>;
/**
 * @see action
 */
export function action<T extends string, P extends object>(
	type: T,
	config: { _as: 'props'; _p: P },
): ActionCreator<T, (props: P & NotTyped<P>) => Typed<P, T>>;
/**
 * @see action
 */
export function action<T extends string, C extends Creator>(
	type: T,
	creator: C & NotTyped<ReturnType<C>>,
): Typed<FunctionWithParametersType<ParametersType<C>, Typed<ReturnType<C>, T>>, T>;
/**
 * @see action
 */
export function action<T extends string>(
	type: T,
	config?: { _as: 'empty' } | { _as: 'fsa' } | { _as: 'payload' } | { _as: 'props' } | Creator,
): Creator {
	return tsAction(type, config as any);
}
