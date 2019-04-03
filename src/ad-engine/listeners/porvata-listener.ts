import { AdSlot } from '../models';
import { context, slotService } from '../services';
import { client, logger } from '../utils';
import { PorvataListenerParams, PorvataPlayer, vastParser } from '../video';

export interface PorvataEventPayload {
	ad_error_code: google.ima.AdError.ErrorCode;
	ad_product: string;
	audio: 0 | 1;
	content_type: string;
	creative_id: string | number;
	ctp: 0 | 1;
	event_name: string;
	line_item_id: string | number;
	player: string;
	position: string;
	/** @deprecated */
	browser: string;
	/** @deprecated */
	timestamp: number;
	/** @deprecated */
	tz_offset: number;
}

export interface Listener {
	isEnabled(): void;
	onEvent(eventName: string, params: PorvataListenerParams, data: PorvataEventPayload): void;
}

function getListeners(): Listener[] {
	return context.get('listeners.porvata') || [];
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
		wikiaAdUnmute: 'unmute',
		wikiaInViewportWithOffer: 'in_viewport_with_offer',
		wikiaInViewportWithoutOffer: 'in_viewport_without_offer',
	};
	static LOG_GROUP = 'porvata-listener';
	static PLAYER_NAME = 'porvata';

	listeners: Listener[];
	video: PorvataPlayer;

	constructor(public params: PorvataListenerParams) {
		this.listeners = getListeners().filter(
			(listener) => !listener.isEnabled || listener.isEnabled(),
		);
	}

	logger = (...args: any[]): void => logger(PorvataListener.LOG_GROUP, ...args);

	init(): void {
		this.dispatch('init');
	}

	registerVideoEvents(video: PorvataPlayer): void {
		this.video = video;
		this.dispatch('ready');

		Object.keys(PorvataListener.EVENTS).forEach((eventKey) => {
			video.addEventListener(eventKey, (event: google.ima.AdEvent | google.ima.AdErrorEvent) => {
				let errorCode: google.ima.AdError.ErrorCode;
				if ((event as any).getError) {
					errorCode = (event as google.ima.AdErrorEvent).getError().getErrorCode();
				}
				this.dispatch(PorvataListener.EVENTS[eventKey], errorCode);
			});
		});
	}

	dispatch(eventName: string, errorCode = 0): void {
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

	getData(eventName: string, errorCode: google.ima.AdError.ErrorCode): PorvataEventPayload {
		let contentType: string;
		let creativeId: string;
		let lineItemId: string;
		const imaAd: google.ima.Ad =
			this.video && this.video.ima.getAdsManager() && this.video.ima.getAdsManager().getCurrentAd();

		if (imaAd) {
			const adInfo = vastParser.getAdInfo(imaAd);
			contentType = adInfo.contentType;
			creativeId = adInfo.creativeId;
			lineItemId = adInfo.lineItemId;
		} else if (this.video && this.video.container) {
			contentType = this.video.container.getAttribute('data-vast-content-type');
			creativeId = this.video.container.getAttribute('data-vast-creative-id');
			lineItemId = this.video.container.getAttribute('data-vast-line-item-id');
		}

		const now = new Date();

		return {
			ad_error_code: errorCode,
			ad_product: this.params.adProduct,
			audio: this.params.withAudio ? 1 : 0,
			content_type: contentType || '(none)',
			creative_id: creativeId || 0,
			ctp: this.params.withCtp ? 1 : 0,
			event_name: eventName,
			line_item_id: lineItemId || 0,
			player: PorvataListener.PLAYER_NAME,
			position: this.params.position ? this.params.position.toLowerCase() : '(none)',
			// @DEPRECATED
			browser: `${client.getOperatingSystem()} ${client.getBrowser()}`,
			timestamp: now.getTime(),
			tz_offset: now.getTimezoneOffset(),
		};
	}
}
