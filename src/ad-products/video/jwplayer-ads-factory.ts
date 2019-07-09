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
	vastParser,
} from '@wikia/ad-engine';
import { JWPlayerTracker } from '../tracking/video/jwplayer-tracker';
import featuredVideo15s from './featured-video-f15s';

interface HdPlayerEvent extends CustomEvent {
	detail: {
		slotStatus?: {
			vastParams: any;
			statusName: string;
		};
		name?: string | null;
		errorCode: number;
	};
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
 *
 * @param {number} depth
 * @returns {number}
 */
function calculateRV(depth) {
	const capping = context.get('options.video.adsOnNextVideoFrequency');

	return depth < 2 || !capping ? 1 : Math.floor((depth - 1) / capping) + 1;
}

/**
 * @param {number} depth
 * @returns {boolean}
 */
function shouldPlayAdOnNextVideo(depth) {
	const capping = context.get('options.video.adsOnNextVideoFrequency');

	return (
		context.get('options.video.playAdsOnNextVideo') && capping > 0 && (depth - 1) % capping === 0
	);
}

/**
 * @param {number} depth
 * @returns {boolean}
 */
function canAdBePlayed(depth) {
	const isReplay = depth > 1;

	return !isReplay || (isReplay && shouldPlayAdOnNextVideo(depth));
}

/**
 * @param {number} videoDepth
 * @returns {boolean}
 */
function shouldPlayPreroll(videoDepth) {
	return canAdBePlayed(videoDepth);
}

/**
 * @param {number} videoDepth
 * @returns {boolean}
 */
function shouldPlayMidroll(videoDepth) {
	return context.get('options.video.isMidrollEnabled') && canAdBePlayed(videoDepth);
}

/**
 * @param {number} videoDepth
 * @returns {boolean}
 */
function shouldPlayPostroll(videoDepth) {
	return context.get('options.video.isPostrollEnabled') && canAdBePlayed(videoDepth);
}

/**
 * @param {string} placement
 * @param {string} vastUrl
 * @returns {void}
 */
function setCurrentVast(placement, vastUrl) {
	vastUrls[placement] = vastUrl;
	vastUrls.last = vastUrl;
}

/**
 * @param {string} placement
 * @returns {string}
 */
function getCurrentVast(placement) {
	return vastUrls[placement] || vastUrls.last;
}

/**
 * @param {Object} slot
 * @param {string} position
 * @param {number} depth
 * @param {number} correlator
 * @param {Object} slotTargeting
 * @returns {string}
 */
function getVastUrl(slot, position, depth, correlator, slotTargeting) {
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

/**
 * @param {Object} adSlot
 * @param {Object} vastParams
 */
function updateSlotParams(adSlot, vastParams) {
	adSlot.lineItemId = vastParams.lineItemId;
	adSlot.creativeId = vastParams.creativeId;
	adSlot.creativeSize = vastParams.size;
}

/**
 * Creates instance with ads schedule and tracking for JWPlayer
 * @param options
 * @param options.adProduct Base ad product name
 * @param options.slotName Slot name for video ads
 * @param [options.audio] Initial state of audio of created player
 * @param [options.autoplay] Initial state of autoplay of created player
 * @param [options.featured] Decides about ad slot used in the video
 * @param [options.videoId] Id of initialized video
 * @returns {{register: register}}
 */
function create(options) {
	function register(player, slotTargeting: Dictionary = {}) {
		const slot = slotService.get(slotName);
		const adProduct = slot.config.trackingKey;
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
		let lastBrokenAdPlayId = null;

		slot.element = videoContainer;
		slot.setConfigProperty('audio', !player.getMute());
		slot.setConfigProperty('autoplay', player.getConfig().autostart);

		if (context.get('options.video.moatTracking.enabledForArticleVideos')) {
			const partnerCode =
				context.get('options.video.moatTracking.articleVideosPartnerCode') ||
				context.get('options.video.moatTracking.partnerCode');

			player.on('adImpression', (event) => {
				if (window.moatjw) {
					window.moatjw.add({
						adImpressionEvent: event,
						partnerCode,
						player,
					});
				}
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
			slot.setConfigProperty('audio', !player.getMute());
			slot.setConfigProperty('videoDepth', depth);

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
					const vastUrl = getVastUrl(slot, 'preroll', depth, correlator, targeting);

					setCurrentVast('preroll', vastUrl);
					player.playAd(vastUrl);
				};

				if (options.featured) {
					fillInSlot();
				} else {
					btfBlockerService.push(slot, fillInSlot);
				}
			}

			prerollPositionReached = true;
		});

		player.on('videoMidPoint', () => {
			if (shouldPlayMidroll(depth)) {
				const vastUrl = getVastUrl(slot, 'midroll', depth, correlator, targeting);

				tracker.adProduct = `${adProduct}-midroll`;
				slot.setConfigProperty('audio', !player.getMute());
				setCurrentVast('midroll', vastUrl);
				player.playAd(vastUrl);
			}
		});

		player.on('beforeComplete', () => {
			if (shouldPlayPostroll(depth)) {
				const vastUrl = getVastUrl(slot, 'postroll', depth, correlator, targeting);

				tracker.adProduct = `${adProduct}-postroll`;
				slot.setConfigProperty('audio', !player.getMute());
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
			const f15sTime = parseFloat(featuredVideo15s.getTime(currentMedia.mediaid));

			if (currentTime >= f15sTime && !f15sMidrollPlayed) {
				const vastUrl = getVastUrl(slot, 'midroll', depth, correlator, targeting);

				tracker.adProduct = `${adProduct}-midroll`;
				slot.setConfigProperty('audio', !player.getMute());
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

			vastDebugger.setVastAttributesFromVastParams(videoContainer, 'success', vastParams);
			eventService.emit(events.VIDEO_AD_REQUESTED, slot);
		});

		player.on('adImpression', (event) => {
			const vastParams = vastParser.parse(event.tag, {
				imaAd: event.ima && event.ima.ad,
			});

			updateSlotParams(slot, vastParams);
			slot.setStatus(AdSlot.STATUS_SUCCESS);
			eventService.emit(events.VIDEO_AD_IMPRESSION, slot);
		});

		player.on('adError', (event) => {
			const vastParams = vastParser.parse(event.tag, {
				imaAd: event.ima && event.ima.ad,
			});
			const { adPlayId } = event;

			// JWPlayer can fire adError multiple times for the same ad
			if (adPlayId && adPlayId === lastBrokenAdPlayId) {
				return;
			}

			lastBrokenAdPlayId = adPlayId;

			log(`ad error message: ${event.message}`);
			updateSlotParams(slot, vastParams);
			vastDebugger.setVastAttributesFromVastParams(videoContainer, 'error', vastParams);

			if (event.adErrorCode === EMPTY_VAST_CODE) {
				slot.setStatus(AdSlot.STATUS_COLLAPSE);
			} else {
				slot.setStatus(AdSlot.STATUS_ERROR);
			}
			eventService.emit(events.VIDEO_AD_ERROR, slot);
		});

		if (context.get('options.wad.hmdRec.enabled')) {
			document.addEventListener('hdPlayerEvent', (event: HdPlayerEvent) => {
				if (event.detail.slotStatus) {
					updateSlotParams(slot, event.detail.slotStatus.vastParams);
					tracker.updateCreativeData(event.detail.slotStatus.vastParams);
					slot.setStatus(event.detail.slotStatus.statusName);
				}

				if (event.detail.name) {
					tracker.emit(event.detail.name, event.detail.errorCode);
				}
			});
		}

		tracker.register(player);
	}

	const slotName = options.slotName || (options.featured ? 'featured' : 'video');
	const slot = slotService.get(slotName) || new AdSlot({ id: slotName });

	if (!slotService.get(slotName)) {
		slotService.add(slot);
	}

	const tracker = new JWPlayerTracker({
		adProduct: slot.config.trackingKey,
		audio: options.audio,
		ctp: !options.autoplay,
		slotName,
		videoId: options.videoId,
	});

	return {
		register,
	};
}

function loadMoatPlugin() {
	utils.scriptLoader.loadScript(context.get('options.video.moatTracking.jwplayerPluginUrl'));
}

export const jwplayerAdsFactory = {
	create,
	getCurrentVast,
	loadMoatPlugin,
};
