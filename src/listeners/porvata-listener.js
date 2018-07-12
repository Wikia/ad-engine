import { client, logger } from '../utils';
import { context, slotService } from '../services';
import { AdSlot } from '../models';
import { vastParser } from '../video';

function getListeners() {
	return context.get('listeners.porvata');
}

export class PorvataListener {
	static EVENTS = {
		adCanPlay: 'ad_can_play',
		complete: 'completed',
		click: 'clicked',
		firstquartile: 'first_quartile',
		impression: 'impression',
		loaded: 'loaded',
		midpoint: 'midpoint',
		pause: 'paused',
		resume: 'resumed',
		start: 'started',
		thirdquartile: 'third_quartile',
		viewable_impression: 'viewable_impression',
		adError: 'error',
		wikiaAdPlayTriggered: 'play_triggered',
		wikiaAdStop: 'closed',
		wikiaAdMute: 'mute',
		wikiaAdUnmute: 'unmute'
	};
	static LOG_GROUP = 'porvata-listener';
	static PLAYER_NAME = 'porvata';

	constructor(params) {
		this.params = params;
		this.listeners = getListeners().filter(listener => !listener.isEnabled || listener.isEnabled());
		this.logger = (...args) => logger(PorvataListener.LOG_GROUP, ...args);
	}

	init() {
		this.dispatch('init');
	}

	registerVideoEvents(video) {
		this.video = video;
		this.dispatch('ready');

		Object.keys(PorvataListener.EVENTS).forEach((eventKey) => {
			video.addEventListener(eventKey, (event) => {
				const errorCode = event.getError && event.getError().getErrorCode();

				this.dispatch(PorvataListener.EVENTS[eventKey], errorCode);
			});
		});
	}

	dispatch(eventName, errorCode = 0) {
		const data = this.getData(eventName, errorCode);

		this.logger(eventName, data);
		this.listeners.forEach((listener) => {
			listener.onEvent(eventName, this.params, data);
		});

		if (this.params.position && eventName === PorvataListener.EVENTS.viewable_impression) {
			const adSlot = slotService.get(this.params.position);
			adSlot.emit(AdSlot.VIDEO_VIEWED_EVENT);
		}
	}

	getData(eventName, errorCode) {
		const imaAd = this.video && this.video.ima.getAdsManager() && this.video.ima.getAdsManager().getCurrentAd();
		let { contentType, creativeId, lineItemId } = vastParser.getAdInfo(imaAd);

		if (!imaAd && this.video && this.video.container) {
			contentType = this.video.container.getAttribute('data-vast-content-type');
			creativeId = this.video.container.getAttribute('data-vast-creative-id');
			lineItemId = this.video.container.getAttribute('data-vast-line-item-id');
		}

		return {
			ad_error_code: errorCode,
			ad_product: this.params.adProduct,
			browser: `${client.getOperatingSystem()} ${client.getBrowser()}`,
			content_type: contentType || '(none)',
			creative_id: creativeId || 0,
			event_name: eventName,
			line_item_id: lineItemId || 0,
			player: PorvataListener.PLAYER_NAME,
			position: this.params.position || '(none)',
			timestamp: new Date().getTime(),
			audio: this.params.withAudio ? 1 : 0
		};
	}
}
