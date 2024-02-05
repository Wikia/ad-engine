import { Action, Communicator, setupPostQuecast } from '@wikia/post-quecast';
import { EventOptions, eventsRepository } from './event-types';
import { globalAction } from './global-action';

interface PostQuecastSettings {
	channelId?: string;
	coordinatorName?: string;
	reduxDevtoolsName?: string;
}

const SETTINGS_KEY = '@wikia/post-quecast-settings';

export class CommunicationService {
	private readonly history = new Map<string, boolean>();
	public readonly communicator: Communicator;

	constructor() {
		const { channelId, coordinatorName } = this.getSettings();

		setupPostQuecast();
		this.communicator = new Communicator({
			channelId: channelId || 'default',
			coordinatorHost: window[coordinatorName] || top,
		});
	}

	emit(event: EventOptions, payload?: object): void {
		this.dispatch(this.getGlobalAction(event)(payload));
	}

	dispatch(action: Action): void {
		this.communicator.dispatch(action);
	}

	on(action: Action, callback: (payload?: any) => void, once = false): void {
		this.communicator.addListener((a: Action) =>
			once ? this.runOnce(a, action, callback) : this.run(a, action, callback),
		);
	}

	once(action: Action, callback: (payload?: any) => void): void {
		this.communicator.addListener((a: Action) => this.runOnce(a, action, callback));
	}

	onSlotEvent(
		eventName: string | symbol,
		callback: (payload?: any) => void,
		slotName = '',
		once = false,
	): void {
		this.communicator.addListener((a: Action) =>
			once
				? this.runSlotEventOnce(a, eventName, slotName, callback)
				: this.runSlotEvent(a, eventName, slotName, callback),
		);
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

	private run(action: Action, actionToListen: Action, callback: (payload?: any) => void): void {
		if (this.ofType(action, actionToListen)) {
			callback(action);
		}
	}

	private runOnce(action: Action, actionToListen: Action, callback: (payload?: any) => void): void {
		const key = actionToListen.category + ' ' + actionToListen.name;

		if (!this.ofType(action, actionToListen)) {
			return;
		}

		if (this.history.has(key)) {
			return;
		}

		this.history.set(key, true);

		callback(action);
	}

	private runSlotEvent(
		action: Action,
		eventName: string | symbol,
		slotName: string,
		callback: (payload?: any) => void,
	) {
		if (
			this.ofType(action, eventsRepository.AD_ENGINE_SLOT_EVENT) &&
			action.event === eventName.toString() &&
			(!slotName || action.adSlotName === slotName)
		) {
			callback(action);
		}
	}

	private runSlotEventOnce(
		action: Action,
		eventName: string | symbol,
		slotName: string,
		callback: (payload?: any) => void,
	) {
		const key = 'adSlotEvent ' + eventName.toString() + ' ' + slotName;
		if (
			!(
				this.ofType(action, eventsRepository.AD_ENGINE_SLOT_EVENT) &&
				action.event === eventName.toString() &&
				(!slotName || action.adSlotName === slotName)
			)
		) {
			return;
		}

		if (this.history.has(key)) {
			return;
		}

		this.history.set(key, true);

		callback(action);
	}

	private ofType(action: Action, actionToListen: Action): boolean {
		return (
			(action.category === actionToListen.category && action.name === actionToListen.name) ||
			action.type === actionToListen.category + ' ' + actionToListen.name
		);
	}
}

export const communicationService = new CommunicationService();
