import {
	AdSlot,
	context,
	slotService,
	utils,
	VideoData,
	VideoEventListener,
} from '@ad-engine/core';
import { TwitchPlayer } from './index';

export interface TwitchListenerParams {
	adProduct: string;
	creativeId: string;
	lineItemId: string;
	position: string;
	slotName: string;
}

export interface TwitchEventListener extends VideoEventListener {
	onEvent(eventName: string, params: TwitchListenerParams, data: VideoData): void;
}

function getListeners(): TwitchEventListener[] {
	return context.get('listeners.twitch') || [];
}

export class TwitchListener {
	static EVENTS = {
		ended: 'closed',
		offline: 'offline',
		online: 'online',
		pause: 'pause',
		play: 'play_triggered',
		playback_blocked: 'playback_blocked',
		playing: 'playing',
		ready: 'ready',
	};
	static LOG_GROUP = 'twitch-listener';
	static PLAYER_NAME = 'twitch';

	private listeners: TwitchEventListener[];

	constructor(private params: TwitchListenerParams) {
		this.listeners = getListeners().filter(
			(listener) => !listener.isEnabled || listener.isEnabled(),
		);
	}

	logger(...args: any[]): void {
		utils.logger(TwitchListener.LOG_GROUP, args);
	}

	init(): void {
		this.dispatch('init');
	}

	registerTwitchEvents(player: TwitchPlayer): void {
		Object.keys(TwitchListener.EVENTS).forEach((eventKey) => {
			player.addEventListener(eventKey, () => {
				this.dispatch(TwitchListener.EVENTS[eventKey]);
			});
		});
	}

	dispatch(eventName: string): void {
		const data: VideoData = this.getVideoData(eventName);

		this.logger(eventName, data);
		this.listeners.forEach((listener) => {
			listener.onEvent(eventName, this.params, data);
		});

		// FIXME: add TwitchListener.EVENTS.viewable_impression
		if (this.params.position && eventName === (TwitchListener.EVENTS as any).viewable_impression) {
			const adSlot = slotService.get(this.params.position);

			adSlot.emit(AdSlot.VIDEO_VIEWED_EVENT);
		}
	}

	getVideoData(eventName: string): VideoData {
		return {
			ad_product: this.params.adProduct,
			creative_id: this.params.creativeId || '',
			event_name: eventName,
			line_item_id: this.params.lineItemId || '',
			player: TwitchListener.PLAYER_NAME,
			position: this.params.slotName || '(none)',
		};
	}
}
