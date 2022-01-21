import { Action, Communicator, setupPostQuecast } from '@wikia/post-quecast';
import { fromEventPattern, merge, Observable, Subject } from 'rxjs';
import { filter, shareReplay, skip, take } from 'rxjs/operators';
import { EventOptions, eventsRepository } from './event-types';
import { globalAction, isGlobalAction } from './global-action';
import { ofType } from './of-type';
import { ReduxDevtoolsFactory } from './redux-devtools';

interface PostQuecastSettings {
	channelId?: string;
	coordinatorName?: string;
	reduxDevtoolsName?: string;
}

const SETTINGS_KEY = '@wikia/post-quecast-settings';

export class CommunicationService {
	action$: Observable<Action>;
	private communicator: Communicator;
	private subject: Subject<Action>;

	constructor() {
		const { channelId, coordinatorName, reduxDevtoolsName } = this.getSettings();

		setupPostQuecast();
		this.communicator = new Communicator({
			channelId: channelId || 'default',
			coordinatorHost: window[coordinatorName] || top,
		});

		const actions$: Observable<Action> = fromEventPattern(
			(handler) => this.communicator.addListener(handler),
			(handler) => this.communicator.removeListener(handler),
		).pipe(shareReplay({ refCount: true }));
		this.subject = new Subject<Action>();

		this.action$ = merge(
			actions$.pipe(filter((action) => isGlobalAction(action))),
			this.subject.asObservable().pipe(filter((action) => !isGlobalAction(action))),
		);
		this.connectReduxDevtools(reduxDevtoolsName);
	}

	emit(event: EventOptions, payload?: object): void {
		this.dispatch(this.getGlobalAction(event)(payload));
	}

	on(event: EventOptions, callback: (payload?: any) => void, once = true): void {
		this.action$
			.pipe(ofType(this.getGlobalAction(event)), once ? take(1) : skip(0))
			.subscribe(callback);
	}

	onSlotEvent(
		eventName: string | symbol,
		callback: (payload?: any) => void,
		slotName = '',
		once = false,
	): void {
		this.action$
			.pipe(
				ofType(this.getGlobalAction(eventsRepository.AD_ENGINE_SLOT_EVENT)),
				filter(
					(action) =>
						action.event === eventName.toString() && (!slotName || action.adSlotName === slotName),
				),
				once ? take(1) : skip(0),
			)
			.subscribe(callback);
	}

	dispatch(action: Action): void {
		if (isGlobalAction(action)) {
			this.communicator.dispatch(action);
		} else {
			this.subject.next(action);
		}
	}

	getGlobalAction(event: EventOptions): Action {
		if (!event.action) {
			event.action = event.payload
				? globalAction(`${event.category || '[AdEngine]'} ${event.name}`, event.payload)
				: globalAction(`${event.category || '[AdEngine]'} ${event.name}`);
		}

		return event.action;
	}

	private getSettings(): PostQuecastSettings {
		return window[SETTINGS_KEY] || {};
	}

	private connectReduxDevtools(name?: string): void {
		const devtools = ReduxDevtoolsFactory.connect(name);

		if (!devtools) {
			return;
		}

		devtools.subscribe((message) => {
			try {
				if (message.source === '@devtools-extension' && message.type === 'ACTION') {
					// According to:
					// * https://medium.com/@zalmoxis/redux-devtools-without-redux-or-how-to-have-a-predictable-state-with-any-architecture-61c5f5a7716f
					// * https://github.com/zalmoxisus/mobx-remotedev/blob/master/src/monitorActions.js
					// * https://github.com/zalmoxisus/remotedev-utils/blob/98ca5b35d8dd042d35dbcdd2653e5e168a2022f5/src/index.js#L75-L78
					const action = new Function(`return ${message.payload}`)();

					this.dispatch(action);
				}
			} catch (e) {
				devtools.error(e.message);
			}
		});

		this.action$.subscribe((action) => devtools.send(action, {}));
	}
}

export const communicationService = new CommunicationService();
