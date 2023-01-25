import { merge, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { RxJsOperator } from './rxjs-operator';

export function respondTo<T>(...observables: Observable<any>[]): RxJsOperator<T, T> {
	return (source: Observable<T>) => {
		return source.pipe(switchMap((value) => merge(...observables).pipe(map(() => value))));
	};
}
