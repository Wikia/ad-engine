import Cookies from 'js-cookie';
import { slotService, vastParser } from '@wikia/ad-engine';
import playerEventEmitter from './player-event-emitter';
import videoEventDataProvider from './video-event-data-provider';

const trackingEventsMap = {
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

	/**
	 * @param {Object} params
	 */
	constructor(params = {}) {
		this.adProduct = params.adProduct || null;
		this.audio = params.audio || false;
		this.contentType = null;
		this.creativeId = null;
		this.ctp = params.ctp || false;
		this.isCtpAudioUpdateEnabled = true;
		this.lineItemId = null;
		this.slotName = params.slotName;
		this.userBlockAutoplay = params.userBlockAutoplay || null;
		this.videoId = params.videoId || null;

		this.emit('setup');
	}

	/**
	 * Update withCtp and withAudio based on player and slot
	 *
	 * @param {AdSlot | null} slot
	 */
	updatePlayerState(slot = null) {
		if (slot && slot.config.autoplay !== undefined && slot.config.audio !== undefined) {
			this.ctp = !slot.config.autoplay;
			this.audio = slot.config.audio;
			this.isCtpAudioUpdateEnabled = false;
		} else {
			this.ctp = !this.playerInstance.getConfig().autostart;
			this.audio = !this.playerInstance.getMute();
		}
	}

	/**
	 * @returns {void}
	 */
	updateVideoId() {
		const playlistItem = this.playerInstance.getPlaylist();
		const playlistIndex = this.playerInstance.getPlaylistIndex();

		this.videoId = playlistItem[playlistIndex].mediaid;
	}

	/**
	 * Update creative details
	 * @param {Object} params
	 * @returns {void}
	 */
	updateCreativeData(params = {}) {
		this.lineItemId = params.lineItemId;
		this.creativeId = params.creativeId;
		this.contentType = params.contentType;
	}

	/**
	 * Register event listeners on player
	 * @param {Object} player
	 * @returns {void}
	 */
	register(player) {
		this.playerInstance = player;

		this.updateVideoId();

		this.emit('init');

		player.on('videoStart', () => {
			this.updateCreativeData();
		});

		player.on('adRequest', (event) => {
			const currentAd = vastParser.getAdInfo(event.ima && event.ima.ad);

			this.updateCreativeData(currentAd);
		});

		this.updatePlayerState();

		Object.keys(trackingEventsMap).forEach((playerEvent) => {
			player.on(playerEvent, (event) => {
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

	/**
	 * Dispatch single event
	 * @param {string} eventName
	 * @param {int} errorCode
	 * @returns {void}
	 */
	emit(eventName, errorCode = 0) {
		this.userBlockAutoplay = -1;

		const featuredVideoAutoplayCookie = Cookies.get('featuredVideoAutoplay');

		if (['0', '1'].indexOf(featuredVideoAutoplayCookie) > -1) {
			this.userBlockAutoplay = featuredVideoAutoplayCookie === '0' ? 1 : 0;
		}

		const eventInfo = videoEventDataProvider.getEventData({
			ad_error_code: errorCode,
			ad_product: this.adProduct,
			audio: this.audio,
			content_type: this.contentType,
			creative_id: this.creativeId,
			ctp: this.ctp,
			event_name: eventName,
			line_item_id: this.lineItemId,
			player: JWPlayerTracker.PLAYER_NAME,
			position: this.slotName,
			user_block_autoplay: this.userBlockAutoplay,
			video_id: this.videoId,
		});

		playerEventEmitter.emit(eventInfo);
	}
}
