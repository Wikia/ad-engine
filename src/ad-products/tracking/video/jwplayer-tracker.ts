import {
	AdSlot,
	Dictionary,
	slotService,
	vastParser,
	VideoData,
	VideoEventData,
} from '@ad-engine/core';
import * as Cookies from 'js-cookie';
import { JWPlayer } from '../../video/jwplayer/external-types/jwplayer';
import playerEventEmitter from './player-event-emitter';
import videoEventDataProvider from './video-event-data-provider';

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
	adComplete: 'completed', // when ad completes
	adSkipped: 'skipped',
	videoStart: 'content_started',
	complete: 'content_completed', // when video completes (not ad)
};

/**
 * Ads tracker for JWPlayer
 */
export class JWPlayerTracker {
	static PLAYER_NAME = 'jwplayer';

	/**
	 * updated in helper.resetTrackerAdProduct and helper.playVideoAd
	 * depends on adSlot and position ('midroll' | 'postroll' | 'preroll')
	 */
	adProduct: string | null;
	/**
	 * from player config and ad slot
	 */
	private audio = false;
	/**
	 * from currentAd (duplicated in helper.setSlotParams)
	 */
	private contentType: string | null = null;
	/**
	 * from currentAd (duplicated in helper.setSlotParams)
	 */
	private creativeId: string | null = null;
	/**
	 * from currentAd (duplicated in helper.setSlotParams)
	 */
	private lineItemId: string | null = null;
	/**
	 * whether or on user clicked to see video
	 * resets to false after "complete" (after actual video completes).
	 * from player config and ad slot
	 */
	private clickedToPlay = false;
	/**
	 * flag, changes to false after first of
	 * ['adRequest', 'adError', 'ready', 'videoStart', 'complete']
	 */
	private isCtpAudioUpdateEnabled = true;
	/**
	 * feel unnecessary, should be replaced with adSlot from manager
	 */
	private readonly slotName: string;
	/**
	 * from player (duplicate of helper.updateVideoId)
	 */
	private videoId: string | null = null;
	private playerInstance: JWPlayer;

	constructor(private adSlot: AdSlot) {
		this.adProduct = this.adSlot.config.trackingKey || null;
		this.slotName = this.adSlot.config.slotName;
	}

	/**
	 * Register event listeners on player
	 * @param {Object} player
	 */
	register(player: any): void {
		this.playerInstance = player;
		this.clickedToPlay = !this.playerInstance.getConfig().autostart;
		this.audio = !this.playerInstance.getMute();

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

		Object.keys(trackingEventsMap).forEach((playerEvent) => {
			player.on(playerEvent, (event: any) => {
				let errorCode;

				if (
					['adRequest', 'adError', 'ready', 'videoStart'].indexOf(playerEvent) !== -1 &&
					this.isCtpAudioUpdateEnabled
				) {
					const slot = slotService.get(this.slotName);

					this.clickedToPlay = !slot.config.autoplay;
					this.audio = slot.config.audio;
					this.isCtpAudioUpdateEnabled = false;
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
					this.clickedToPlay = false;
				}
			});
		});

		player.on('adError', () => {
			this.updateCreativeData();
		});
	}

	/**
	 * used at the beginning
	 * used in helper.updateVideoId
	 *   on 'beforePlay'
	 */
	updateVideoId(): void {
		const playlist = this.playerInstance.getPlaylist();
		const playlistIndex = this.playerInstance.getPlaylistIndex();

		this.videoId = playlist[playlistIndex].mediaid;
	}

	/**
	 * Update creative details
	 * duplicate of helper.setSlotParams
	 */
	private updateCreativeData(params: CreativeParams = {}): void {
		this.lineItemId = params.lineItemId;
		this.creativeId = params.creativeId;
		this.contentType = params.contentType;
	}

	/**
	 * Dispatch single event
	 */
	private emit(eventName: string, errorCode = 0): void {
		const videoData: VideoData = this.getVideoData(eventName, errorCode);
		const eventInfo: VideoEventData = videoEventDataProvider.getEventData(videoData);

		playerEventEmitter.emit(eventInfo);
	}

	private getVideoData(eventName: string, errorCode: number): VideoData {
		return {
			ad_error_code: errorCode,
			ad_product: this.adProduct,
			audio: this.audio ? 1 : 0,
			content_type: this.contentType,
			creative_id: this.creativeId,
			ctp: this.clickedToPlay ? 1 : 0,
			event_name: eventName,
			line_item_id: this.lineItemId,
			player: JWPlayerTracker.PLAYER_NAME,
			position: this.slotName,
			user_block_autoplay: this.getUserBlockAutoplay(),
			video_id: this.videoId || '',
		};
	}

	private getUserBlockAutoplay(): 1 | 0 | -1 {
		const featuredVideoAutoplayCookie = Cookies.get('featuredVideoAutoplay') || '-1';

		switch (featuredVideoAutoplayCookie) {
			case '1':
				return 1;
			case '0':
				return 0;
			case '-1':
			default:
				return -1;
		}
	}
}
