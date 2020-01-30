import {
	AdSlot,
	Dictionary,
	slotService,
	vastParser,
	VideoData,
	VideoEventData,
} from '@ad-engine/core';
import * as Cookies from 'js-cookie';
import playerEventEmitter from './player-event-emitter';
import videoEventDataProvider from './video-event-data-provider';

interface PlayerInstance {
	[key: string]: any;
}

interface CreativeParams {
	lineItemId?: string | null;
	creativeId?: string | null;
	contentType?: string | null;
}

const trackingEventsMap: Dictionary<string> = {
	ready: 'ready',
	adBlock: 'blocked',
	adClick: 'clicked',
	adRequest: 'loaded',
	adError: 'error',
	adImpression: 'impression',
	adStarted: 'started',
	adViewableImpression: 'viewable_impression',
	adFirstQuartile: 'first_quartile',
	adMidPoint: 'midpoint',
	adThirdQuartile: 'third_quartile',
	adComplete: 'completed',
	adSkipped: 'skipped',
	videoStart: 'content_started',
	complete: 'content_completed',
};

/**
 * Ads tracker for JWPlayer
 */
export class JWPlayerTracker {
	static PLAYER_NAME = 'jwplayer';

	adProduct: string | null;
	audio = false;
	contentType: string | null = null;
	creativeId: string | null = null;
	ctp = false;
	isCtpAudioUpdateEnabled = true;
	lineItemId: string | null = null;
	slotName: string;
	userBlockAutoplay: 1 | 0 | -1 = -1;
	videoId: string | null = null;
	playerInstance: PlayerInstance;

	constructor(params: Dictionary = {}) {
		this.adProduct = params.adProduct || null;
		this.audio = params.audio || false;
		this.ctp = params.ctp || false;
		this.slotName = params.slotName;
		this.userBlockAutoplay = params.userBlockAutoplay || null;
		this.videoId = params.videoId || null;

		this.emit('setup');
	}

	/**
	 * Update withCtp and withAudio based on player and slot
	 */
	updatePlayerState(slot?: AdSlot): void {
		if (slot && slot.config.autoplay !== undefined && slot.config.audio !== undefined) {
			this.ctp = !slot.config.autoplay;
			this.audio = slot.config.audio;
			this.isCtpAudioUpdateEnabled = false;
		} else {
			this.ctp = !this.playerInstance.getConfig().autostart;
			this.audio = !this.playerInstance.getMute();
		}
	}

	updateVideoId(): void {
		const playlistItem = this.playerInstance.getPlaylist();
		const playlistIndex = this.playerInstance.getPlaylistIndex();

		this.videoId = playlistItem[playlistIndex].mediaid;
	}

	/**
	 * Update creative details
	 */
	updateCreativeData(params: CreativeParams = {}): void {
		this.lineItemId = params.lineItemId;
		this.creativeId = params.creativeId;
		this.contentType = params.contentType;
	}

	/**
	 * Register event listeners on player
	 * @param {Object} player
	 */
	register(player: any): void {
		this.playerInstance = player;

		this.updateVideoId();

		this.emit('init');

		if (player.getConfig().itemReady) {
			this.emit('late_ready');
		}

		player.on('videoStart', () => {
			this.updateCreativeData();
		});

		player.on('adRequest', (event: any) => {
			const currentAd = vastParser.getAdInfo(event.ima && event.ima.ad);

			this.updateCreativeData(currentAd);
		});

		this.updatePlayerState();

		Object.keys(trackingEventsMap).forEach((playerEvent) => {
			player.on(playerEvent, (event: any) => {
				let errorCode;

				if (
					['adRequest', 'adError', 'ready', 'videoStart'].indexOf(playerEvent) !== -1 &&
					this.isCtpAudioUpdateEnabled
				) {
					const slot = slotService.get(this.slotName);

					this.updatePlayerState(slot);
				}

				if (playerEvent === 'adError') {
					errorCode = event && event.code;
				}

				this.emit(trackingEventsMap[playerEvent], errorCode);

				// Disable updating ctp and audio on video completed event
				// It is a failsafe for the case where updating
				// has not been disabled by calling updatePlayerState with VAST params
				if (playerEvent === 'complete') {
					this.isCtpAudioUpdateEnabled = false;
					this.ctp = false;
				}
			});
		});

		player.on('adError', () => {
			this.updateCreativeData();
		});
	}

	getVideoData(eventName: string, errorCode: number): VideoData {
		return {
			ad_error_code: errorCode,
			ad_product: this.adProduct,
			audio: this.audio ? 1 : 0,
			content_type: this.contentType,
			creative_id: this.creativeId,
			ctp: this.ctp ? 1 : 0,
			event_name: eventName,
			line_item_id: this.lineItemId,
			player: JWPlayerTracker.PLAYER_NAME,
			position: this.slotName,
			user_block_autoplay: this.userBlockAutoplay,
			video_id: this.videoId || '',
		};
	}

	/**
	 * Dispatch single event
	 */
	emit(eventName: string, errorCode = 0): void {
		this.userBlockAutoplay = -1;

		const featuredVideoAutoplayCookie: string | undefined = Cookies.get('featuredVideoAutoplay');

		if (['0', '1'].indexOf(featuredVideoAutoplayCookie) > -1) {
			this.userBlockAutoplay = featuredVideoAutoplayCookie === '0' ? 1 : 0;
		}

		const videoData: VideoData = this.getVideoData(eventName, errorCode);
		const eventInfo: VideoEventData = videoEventDataProvider.getEventData(videoData);

		playerEventEmitter.emit(eventInfo);
	}
}
