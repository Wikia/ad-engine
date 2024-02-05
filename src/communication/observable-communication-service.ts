import { Action, Communicator } from '@wikia/post-quecast';
import { fromEventPattern, merge, Observable, Subject } from 'rxjs';
import { filter, shareReplay } from 'rxjs/operators';
import { isGlobalAction } from './global-action';

export class ObservableCommunicationService {
	public action$: Observable<Action>;
	private subject: Subject<Action>;

	constructor(communicator: Communicator) {
		const actions$: Observable<Action> = fromEventPattern(
			(handler) => communicator.addListener(handler),
			(handler) => communicator.removeListener(handler),
		).pipe(shareReplay({ refCount: true }));
		this.subject = new Subject<Action>();

		this.action$ = merge(
			actions$.pipe(filter((action: Action<string>) => isGlobalAction(action))),
			this.subject.asObservable().pipe(filter((action: Action<string>) => !isGlobalAction(action))),
		);
	}
	static toObservable(communicator: Communicator) {
		return new ObservableCommunicationService(communicator);
	}
}
