import { RxJsOperator } from '@ad-engine/models';
import { Action } from '@wikia/post-quecast';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

export function onlyNew<T>(): RxJsOperator<Action<T>, T> {
	return (source: Observable<Action<T>>): Observable<Action<T>> => {
		const timestamp = Date.now();

		return source.pipe(filter((action: Action<T>) => action.timestamp > timestamp));
	};
}
