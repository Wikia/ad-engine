// tslint:disable-next-line:import-blacklist
import { Action } from '@wikia/post-quecast';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { RxJsOperator } from './rxjs-operator';

export function onlyNew<T>(): RxJsOperator<Action<T>, T> {
	return (source: Observable<Action<T>>): Observable<Action<T>> => {
		const timestamp = Date.now();

		return source.pipe(filter((action) => action.timestamp > timestamp));
	};
}
