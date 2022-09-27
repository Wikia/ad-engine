import { RxJsOperator } from './rxjs-operator';
import { Observable, of } from 'rxjs';
import { respondTo } from './respond-to';

export function startAndRespondTo<T>(...observables: Observable<any>[]): RxJsOperator<T, T> {
	return respondTo(...observables, of({}));
}
