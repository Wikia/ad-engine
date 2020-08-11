import { RxJsOperator } from '@ad-engine/communication';
import { merge, Observable } from 'rxjs';
import { filter, take, tap } from 'rxjs/operators';

export function tapOnce<T>(
	next?: (x: T) => void,
	error?: (e: any) => void,
	complete?: () => void,
): RxJsOperator<T, T> {
	return (source: Observable<T>) => {
		const tapSource = source.pipe(
			take(1),
			tap(next, error, complete),
			filter(() => false),
		);

		return merge(tapSource, source);
	};
}
