import { Action, action, ActionCreator } from 'ts-action';

export type GlobalAction = Action & { __global: true };
export type GlobalActionCreator = ActionCreator & { __global: true };

export function isGlobalAction(input: Action): input is GlobalAction {
	return (input as any).__global === true;
}

export function isGlobalActionCreator(input: ActionCreator): input is GlobalActionCreator {
	return (input as any).__global === true;
}

export function globalAction(...args: Parameters<typeof action>): ReturnType<typeof action> {
	const type: string = args[0];
	const originalCreator = action(...args);
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

	return globalCreator as any;
}
