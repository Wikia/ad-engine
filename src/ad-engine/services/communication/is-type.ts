import { Action, ActionCreator, isType as tsIsType } from 'ts-action';
import { isGlobalAction, isGlobalActionCreator } from './global-action';

export function isType(...args: Parameters<typeof tsIsType>): ReturnType<typeof tsIsType> {
	const action: Action = args[0];
	const creators: ActionCreator[] = args.slice(1) as any;

	return (
		tsIsType(...args) &&
		creators.some((creator) => (isGlobalActionCreator(creator) ? isGlobalAction(action) : true))
	);
}
