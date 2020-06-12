import { filter } from 'rxjs/operators';
import { ActionCreator } from 'ts-action';
import { ofType as tsOfType } from 'ts-action-operators';
import { isGlobalAction, isGlobalActionCreator } from './global-action';

export function ofType(...args: Parameters<typeof tsOfType>): ReturnType<typeof tsOfType> {
	const creators: ActionCreator[] = args as any;

	return (source) =>
		source.pipe(
			tsOfType(...args),
			filter((action) =>
				creators.some((creator) =>
					isGlobalActionCreator(creator) ? isGlobalAction(action) : true,
				),
			),
		);
}
