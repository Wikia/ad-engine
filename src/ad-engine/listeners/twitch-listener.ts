import { AdSlot } from '../models';
import { context, slotService } from '../services';
import { logger } from '../utils';

function getListeners() {
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

	constructor(params) {
		this.params = params;
		this.listeners = getListeners().filter(
			(listener) => !listener.isEnabled || listener.isEnabled(),
		);
		this.logger = (...args) => logger(TwitchListener.LOG_GROUP, ...args);
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

		if (this.params.position && eventName === TwitchListener.EVENTS.viewable_impression) {
			const adSlot = slotService.get(this.params.position);

			adSlot.emit(AdSlot.VIDEO_VIEWED_EVENT);
		}
	}

	getData(eventName) {
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
