import {
	AdSlot,
	btfBlockerService,
	buildVastUrl,
	context,
	Dictionary,
	events,
	eventService,
	slotService,
	utils,
	vastDebugger,
	VastParams,
	vastParser,
} from '@ad-engine/core';
import { JWPlayerTracker } from '../tracking/video/jwplayer-tracker';
import featuredVideo15s from './featured-video-f15s';
import { iasVideoTracker } from './player/porvata/ias/ias-video-tracker';

interface JwPlayerAdsFactoryOptions {
	adProduct: string;
	slotName: string;
	audio: boolean;
	autoplay: boolean;
	featured: boolean;
	videoId: string;
}

const vastUrls = {
	last: null,
	preroll: null,
	midroll: null,
	postroll: null,
};
// 21009	VAST_EMPTY_RESPONSE
const EMPTY_VAST_CODE = 21009;
const log = (...args) => utils.logger('jwplayer-ads-factory', ...args);

/**
 * Calculate depth
 */
function calculateRV(depth: number): number {
	const capping = context.get('options.video.adsOnNextVideoFrequency');

	return depth < 2 || !capping ? 1 : Math.floor((depth - 1) / capping) + 1;
}

function shouldPlayAdOnNextVideo(depth: number): boolean {
	const capping = context.get('options.video.adsOnNextVideoFrequency');

	return (
		context.get('options.video.playAdsOnNextVideo') && capping > 0 && (depth - 1) % capping === 0
	);
}

function canAdBePlayed(depth: number): boolean {
	const isReplay = depth > 1;

	return !isReplay || (isReplay && shouldPlayAdOnNextVideo(depth));
}

function shouldPlayPreroll(videoDepth: number): boolean {
	return canAdBePlayed(videoDepth);
}

function shouldPlayMidroll(videoDepth: number): boolean {
	return context.get('options.video.isMidrollEnabled') && canAdBePlayed(videoDepth);
}

function shouldPlayPostroll(videoDepth: number): boolean {
	return context.get('options.video.isPostrollEnabled') && canAdBePlayed(videoDepth);
}

function setCurrentVast(placement: string, vastUrl: string): void {
	vastUrls[placement] = vastUrl;
	vastUrls.last = vastUrl;
}

function getCurrentVast(placement: string): string {
	return vastUrls[placement] || vastUrls.last;
}

function getVastUrl(
	slot: AdSlot,
	position: string,
	depth: number,
	correlator: number,
	slotTargeting: object,
): string {
	return buildVastUrl(16 / 9, slot.getSlotName(), {
		correlator,
		vpos: position,
		targeting: {
			passback: 'jwplayer',
			rv: calculateRV(depth),
			...slotTargeting,
		},
	});
}

function updateSlotParams(adSlot: AdSlot, vastParams: VastParams): void {
	adSlot.lineItemId = vastParams.lineItemId;
	adSlot.creativeId = vastParams.creativeId;
	adSlot.creativeSize = vastParams.size;
}

/**
 * Creates instance with ads schedule and tracking for JWPlayer
 */
function create(
	options: JwPlayerAdsFactoryOptions,
): { register: (player, slotTargeting?: Dictionary) => void } {
	function register(player, slotTargeting: Dictionary = {}): void {
		const adSlot = slotService.get(slotName);
		const adProduct = adSlot.config.trackingKey;
		const videoElement = player && player.getContainer && player.getContainer();
		const videoContainer = videoElement && videoElement.parentNode;
		const targeting = slotTargeting;

		let correlator;
		let depth = 0;
		let prerollPositionReached = false;
		// the flag is needed to avoid playing the same mid-roll
		// in the very same second, so there is no race condition
		// in JWPlayer when removing ad layer and going back to the video
		// player.off('time') solves it but it also unregisters other event handlers
		let f15sMidrollPlayed = false;
		/** @type {string} */
		let lastRequestedVastUrl = null;
		let lastBrokenAdPlayId = null;

		adSlot.element = videoContainer;
		adSlot.setConfigProperty('audio', !player.getMute());
		adSlot.setConfigProperty('autoplay', player.getConfig().autostart);

		if (context.get('options.video.moatTracking.enabledForArticleVideos')) {
			const partnerCode =
				context.get('options.video.moatTracking.articleVideosPartnerCode') ||
				context.get('options.video.moatTracking.partnerCode');

			player.on('adImpression', (event) => {
				if (window.moatjw) {
					window.moatjw.add({
						partnerCode,
						player,
						adImpressionEvent: event,
					});
				}
			});
		}

		if (context.get('options.video.iasTracking.enabled')) {
			const iasConfig = context.get('options.video.iasTracking.config');

			iasVideoTracker.loadScript();

			player.on('adsManager', (event) => {
				const { adsManager, videoElement: videoNode } = event;

				iasVideoTracker.init(window.google, adsManager, videoNode, iasConfig);
			});
		}

		player.on('adBlock', () => {
			tracker.adProduct = adProduct;
		});

		player.on('beforePlay', () => {
			const currentMedia = player.getPlaylistItem() || {};

			targeting.v1 = currentMedia.mediaid;
			tracker.updateVideoId();

			if (prerollPositionReached) {
				return;
			}

			correlator = Math.round(Math.random() * 10000000000);
			depth += 1;
			adSlot.setConfigProperty('audio', !player.getMute());
			adSlot.setConfigProperty('videoDepth', depth);

			if (featuredVideo15s.isEnabled(currentMedia.mediaid)) {
				prerollPositionReached = true;

				return;
			}

			if (shouldPlayPreroll(depth)) {
				tracker.adProduct = `${adProduct}-preroll`;
				/**
				 * Fill in slot handle
				 * @returns {void}
				 */
				const fillInSlot = () => {
					const vastUrl = getVastUrl(adSlot, 'preroll', depth, correlator, targeting);

					setCurrentVast('preroll', vastUrl);
					player.playAd(vastUrl);
				};

				if (options.featured) {
					if (context.get('options.video.iasTracking.enabled')) {
						iasVideoTracker.loadScript().then(() => {
							fillInSlot();
						});
					} else {
						fillInSlot();
					}
				} else {
					btfBlockerService.push(adSlot, fillInSlot);
				}
			}

			prerollPositionReached = true;
		});

		player.on('videoMidPoint', () => {
			if (shouldPlayMidroll(depth)) {
				const vastUrl = getVastUrl(adSlot, 'midroll', depth, correlator, targeting);

				tracker.adProduct = `${adProduct}-midroll`;
				adSlot.setConfigProperty('audio', !player.getMute());
				setCurrentVast('midroll', vastUrl);
				player.playAd(vastUrl);
			}
		});

		player.on('beforeComplete', () => {
			if (shouldPlayPostroll(depth)) {
				const vastUrl = getVastUrl(adSlot, 'postroll', depth, correlator, targeting);

				tracker.adProduct = `${adProduct}-postroll`;
				adSlot.setConfigProperty('audio', !player.getMute());
				setCurrentVast('postroll', vastUrl);
				player.playAd(vastUrl);
			}
		});

		player.on('time', (data) => {
			const currentMedia = player.getPlaylistItem() || {};

			if (f15sMidrollPlayed) {
				return;
			}

			if (!featuredVideo15s.isEnabled(currentMedia.mediaid)) {
				return;
			}

			const { currentTime } = data;
			const f15sTime = featuredVideo15s.getTime(currentMedia.mediaid);

			if (currentTime >= f15sTime && !f15sMidrollPlayed) {
				const vastUrl = getVastUrl(adSlot, 'midroll', depth, correlator, targeting);

				tracker.adProduct = `${adProduct}-midroll`;
				adSlot.setConfigProperty('audio', !player.getMute());
				setCurrentVast('midroll', vastUrl);
				player.playAd(vastUrl);
				f15sMidrollPlayed = true;
			}
		});

		player.on('complete', () => {
			prerollPositionReached = false;
			tracker.adProduct = adProduct;
		});

		player.on('adRequest', (event) => {
			const vastParams = vastParser.parse(event.tag, {
				imaAd: event.ima && event.ima.ad,
			});

			lastRequestedVastUrl = event.tag;

			vastDebugger.setVastAttributesFromVastParams(videoContainer, 'success', vastParams);
			eventService.emit(events.VIDEO_AD_REQUESTED, adSlot);
		});

		player.on('adImpression', (event) => {
			const vastParams = vastParser.parse(event.tag, {
				imaAd: event.ima && event.ima.ad,
			});

			updateSlotParams(adSlot, vastParams);
			adSlot.setStatus(AdSlot.STATUS_SUCCESS);
			eventService.emit(events.VIDEO_AD_IMPRESSION, adSlot);
		});

		player.on('adError', (event) => {
			const vastParams = vastParser.parse(event.tag || lastRequestedVastUrl, {
				imaAd: event.ima && event.ima.ad,
			});
			const { adPlayId } = event;

			// JWPlayer can fire adError multiple times for the same ad
			if (adPlayId && adPlayId === lastBrokenAdPlayId) {
				return;
			}

			lastBrokenAdPlayId = adPlayId;

			log(`ad error message: ${event.message}`);
			updateSlotParams(adSlot, vastParams);
			vastDebugger.setVastAttributesFromVastParams(videoContainer, 'error', vastParams);

			if (event.adErrorCode === EMPTY_VAST_CODE) {
				adSlot.setStatus(AdSlot.STATUS_COLLAPSE);
			} else {
				adSlot.setStatus(AdSlot.STATUS_ERROR);
			}
			eventService.emit(events.VIDEO_AD_ERROR, adSlot);
		});

		tracker.register(player);
	}

	const slotName = options.slotName || (options.featured ? 'featured' : 'video');
	const slot = slotService.get(slotName) || new AdSlot({ id: slotName });

	if (!slotService.get(slotName)) {
		slotService.add(slot);
	}

	const tracker = new JWPlayerTracker({
		slotName,
		adProduct: slot.config.trackingKey,
		audio: options.audio,
		ctp: !options.autoplay,
		videoId: options.videoId,
	});

	return {
		register,
	};
}

function loadMoatPlugin(): void {
	utils.scriptLoader.loadScript(context.get('options.video.moatTracking.jwplayerPluginUrl'));
}

export const jwplayerAdsFactory = {
	create,
	getCurrentVast,
	loadMoatPlugin,
};
