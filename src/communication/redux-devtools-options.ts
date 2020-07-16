/**
 * @link https://github.com/zalmoxisus/redux-devtools-extension/blob/master/docs/API/Arguments.md
 */
import { Action } from 'ts-action';

export interface ReduxDevtoolsOptions {
	name?: string;
	actionCreators?: object | any[];
	latency?: number;
	trace?: boolean;
	traceLimit?: boolean;
	serialize?: boolean | object;
	actionSanitizer?: (action: Action) => Action;
	stateSanitizer?: <T>(state: T) => T;
	actionsBlacklist?: string | string[];
	actionsWhitelist?: string | string[];
	predicate?: <T>(state: T, action: Action) => boolean;
	pauseActionType?: string;
	autoPause?: boolean;
	shouldStartLocked?: boolean;
	shouldHotReload?: boolean;
	shouldCatchErrors?: boolean;
	features?: object;
}
