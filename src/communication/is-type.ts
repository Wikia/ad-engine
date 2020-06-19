// tslint:disable-next-line:import-blacklist
import { Action, ActionCreator, ActionType, isType as tsIsType } from 'ts-action';
import { isGlobalAction, isGlobalActionCreator } from './global-action';

export function isType<T extends ActionCreator[]>(
	action: Action,
	...creators: T
): action is ActionType<T[number]> {
	return (
		tsIsType(action, ...creators) &&
		creators.some((creator) =>
			isGlobalActionCreator(creator) ? isGlobalAction(action) : !isGlobalAction(action),
		)
	);
}
