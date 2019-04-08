import { AdSlot } from '../models';
import { context, slotService } from '../services';
import { logger } from '../utils';
import { VideoEventPayload, VideoListener, VideoParams } from './video-listeners';

export interface TwitchListenerParams extends VideoParams {
	creativeId: number;
	lineItemId: number;
	slotName: string;
	position: string;
}

export interface TwitchVideoListener extends VideoListener {
	onEvent(eventName: string, params: TwitchListenerParams, data: VideoEventPayload): void;
}

function getListeners(): TwitchVideoListener[] {
	return context.get('listeners.twitch');
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

	private listeners: TwitchVideoListener[];

	constructor(private params: TwitchListenerParams) {
		this.listeners = getListeners().filter(
			(listener) => !listener.isEnabled || listener.isEnabled(),
		);
	}

	logger(...args: any[]): void {
		logger(TwitchListener.LOG_GROUP, args);
	}

	init() {
		this.dispatch('init');
	}

	registerTwitchEvents(player) {
		Object.keys(TwitchListener.EVENTS).forEach((eventKey) => {
			player.addEventListener(eventKey, () => {
				this.dispatch(TwitchListener.EVENTS[eventKey]);
			});
		});
	}

	dispatch(eventName) {
		const data = this.getData(eventName);

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

	getData(eventName: string): VideoEventPayload {
		return {
			ad_product: this.params.adProduct,
			creative_id: this.params.creativeId || 0,
			event_name: eventName,
			line_item_id: this.params.lineItemId || 0,
			player: TwitchListener.PLAYER_NAME,
			position: this.params.slotName || '(none)',
		};
	}
}
