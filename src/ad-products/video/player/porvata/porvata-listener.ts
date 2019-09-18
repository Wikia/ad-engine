import {
	AdSlot,
	context,
	slotService,
	utils,
	vastParser,
	VideoData,
	VideoEventListener,
} from '@ad-engine/core';
import { PorvataPlayer } from './porvata';

export interface PorvataListenerParams {
	adProduct: string;
	position: string;
	src: string;
	withAudio: boolean;
	withCtp: boolean;
}

export interface PorvataEventListener extends VideoEventListener {
	onEvent(eventName: string, params: PorvataListenerParams, data: VideoData): void;
}

function getListeners(): PorvataEventListener[] {
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

	listeners: PorvataEventListener[];
	video: PorvataPlayer;

	constructor(public params: PorvataListenerParams) {
		this.listeners = getListeners().filter(
			(listener) => !listener.isEnabled || listener.isEnabled(),
		);
	}

	logger = (...args: any[]): void => utils.logger(PorvataListener.LOG_GROUP, ...args);

	init(): void {
		this.dispatch('init');
	}

	registerVideoEvents(video: PorvataPlayer): void {
		this.video = video;
		this.dispatch('ready');

		Object.keys(PorvataListener.EVENTS).forEach((eventKey) => {
			video.addEventListener(eventKey, (event: google.ima.AdEvent | google.ima.AdErrorEvent) => {
				let errorCode: google.ima.AdError.ErrorCode;
				let currentAd: google.ima.Ad;

				if ((event as any).getError) {
					errorCode = (event as google.ima.AdErrorEvent).getError().getErrorCode();
				}
				if ((event as google.ima.AdEvent).getAd) {
					currentAd = (event as google.ima.AdEvent).getAd();
				}
				this.dispatch(PorvataListener.EVENTS[eventKey], errorCode, currentAd);
			});
		});
	}

	dispatch(eventName: string, errorCode = 0, currentAd?: google.ima.Ad): void {
		const data: VideoData = this.getVideoData(eventName, errorCode, currentAd);

		this.logger(eventName, data);
		this.listeners.forEach((listener) => {
			listener.onEvent(eventName, this.params, data);
		});

		if (this.params.position && eventName === PorvataListener.EVENTS.viewable_impression) {
			const adSlot = slotService.get(this.params.position);

			adSlot.emit(AdSlot.VIDEO_VIEWED_EVENT);
		}
	}

	getVideoData(
		eventName: string,
		errorCode: google.ima.AdError.ErrorCode,
		currentAd?: google.ima.Ad,
	): VideoData {
		let contentType: string;
		let creativeId: string;
		let lineItemId: string;

		if (currentAd) {
			const adInfo = vastParser.getAdInfo(currentAd);
			contentType = adInfo.contentType;
			creativeId = adInfo.creativeId;
			lineItemId = adInfo.lineItemId;
		} else if (this.video && this.video.container) {
			contentType = this.video.container.getAttribute('data-vast-content-type');
			creativeId = this.video.container.getAttribute('data-vast-creative-id');
			lineItemId = this.video.container.getAttribute('data-vast-line-item-id');
		}

		return {
			ad_error_code: errorCode,
			ad_product: this.params.adProduct,
			audio: this.params.withAudio ? 1 : 0,
			content_type: contentType || '(none)',
			creative_id: creativeId || '',
			ctp: this.params.withCtp ? 1 : 0,
			event_name: eventName,
			line_item_id: lineItemId || '',
			player: PorvataListener.PLAYER_NAME,
			position: this.params.position ? this.params.position.toLowerCase() : '(none)',
		};
	}
}
