// tslint:disable-next-line:import-blacklist
import { Action, Communicator, setupPostQuecast } from '@wikia/post-quecast';
import { merge, Observable, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { isGlobalAction } from './global-action';
import { ReduxDevtoolsFactory } from './redux-devtools';

export class CommunicationService {
	action$: Observable<Action>;
	private communicator: Communicator;
	private subject: Subject<Action>;

	constructor() {
		setupPostQuecast();
		this.communicator = new Communicator();
		this.subject = new Subject<Action>();
		this.action$ = merge(
			this.communicator.actions$.pipe(filter((action) => isGlobalAction(action))),
			this.subject.asObservable().pipe(filter((action) => !isGlobalAction(action))),
		);
		this.connectReduxDevtools();
	}

	dispatch(action: Action): void {
		if (isGlobalAction(action)) {
			this.communicator.dispatch(action);
		} else {
			this.subject.next(action);
		}
	}

	private connectReduxDevtools(): void {
		const devtools = ReduxDevtoolsFactory.connect();

		if (!devtools) {
			return;
		}

		this.action$.subscribe((action) => devtools.send(action, {}));
	}
}

export const communicationService = new CommunicationService();
