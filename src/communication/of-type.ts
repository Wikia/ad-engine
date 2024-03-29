import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Action, ActionCreator, ActionType } from 'ts-action';
import { ofType as tsOfType } from 'ts-action-operators';
import { isGlobalAction, isGlobalActionCreator } from './global-action';

export function ofType<C extends ActionCreator[]>(
	...creators: C
): (source: Observable<Action>) => Observable<ActionType<C[number]>> {
	return (source) =>
		source.pipe(
			tsOfType(...creators),
			filter((action: ActionType<C[number]>) =>
				creators.some((creator) =>
					isGlobalActionCreator(creator) ? isGlobalAction(action) : !isGlobalAction(action),
				),
			),
		);
}
