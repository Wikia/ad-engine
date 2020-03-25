import { Observable, of } from 'rxjs';
import { respondTo } from './respond-to';
import { RxJsOperator } from './rxjs-operator';

export function startAndRespondTo<T>(...observables: Observable<any>[]): RxJsOperator<T, T> {
	return respondTo(...observables, of({}));
}
