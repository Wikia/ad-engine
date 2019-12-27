import { Observable } from 'rxjs';

export type RxJsOperator<TSource, TResult> = (source: Observable<TSource>) => Observable<TResult>;
