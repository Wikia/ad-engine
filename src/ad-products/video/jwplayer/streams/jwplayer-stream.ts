import { RxJsOperator } from '@ad-engine/models';
import { Observable } from 'rxjs';
import { filter, map, withLatestFrom } from 'rxjs/operators';
import { JWPlayer } from '../external-types/jwplayer';
import { JwpEventKey, JwpEventName } from './jwplayer-events';
import { createJwpStateStream, JwpState } from './jwplayer-stream-state';
import { createJwpStatelessStream, JwpStatelessEvent } from './jwplayer-stream-stateless';

export type JwpStream<T extends JwpEventKey = JwpEventName> = Observable<JwpEvent<T>>;

export interface JwpEvent<TEvent extends JwpEventKey> extends JwpStatelessEvent<TEvent> {
	state: JwpState;
}

export function ofJwpEvent<T extends JwpEventName[], P extends JwpEvent<T[number]>>(
	...names: T
): RxJsOperator<JwpEvent<any>, P> {
	return (source: Observable<any>) => source.pipe(filter(({ name }) => names.includes(name)));
}

/**
 * Creates stateful stream of jwplayer events.
 * It is an amalgamation of stateless stream and state stream.
 * Can be filtered using ofJwpEvent operator.
 * @see ofJwpEvent
 */
export function createJwpStream(jwplayer: JWPlayer): JwpStream {
	const stream$ = createJwpStatelessStream(jwplayer);
	const state$ = createJwpStateStream(stream$, jwplayer);

	return stream$.pipe(
		withLatestFrom(state$),
		map(([value, state]) => ({ ...value, state })),
	);
}
