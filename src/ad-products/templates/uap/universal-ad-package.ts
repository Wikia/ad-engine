import { AdSlot, btfBlockerService, context, slotService, utils } from '@ad-engine/core';
import { throttle } from 'lodash';
import { Porvata, PorvataPlayer } from '../../video/player/porvata/porvata';
import { TwitchOptions, TwitchPlayer } from '../../video/player/twitch';
import * as videoUserInterface from '../interface/video';
import * as constants from './constants';
import { UapVideoSettings } from './uap-video-settings';

let uapCreativeId = constants.DEFAULT_UAP_ID;
let uapId = constants.DEFAULT_UAP_ID;
let uapType = constants.DEFAULT_UAP_TYPE;

export interface UapState<T> {
	default: T;
	resolved: T;
}

export type UapRatio = UapState<number>;

export interface UapConfig {
	aspectRatio: UapRatio;
	background: UapState<string>;
	video: {
		thumb: string;
	};
	state: {
		height: UapState<number>;
	};
}

export interface UapImage {
	element: HTMLImageElement;
	background: string;
}

export interface VideoSize {
	height: number;
	width: number;
}

export interface UapParams {
	adContainer: HTMLElement;
	adProduct: string;
	aspectRatio: number;
	autoPlay: boolean;
	backgroundColor: string;
	blockOutOfViewportPausing: boolean;
	clickThroughURL: string;
	config: UapConfig;
	container: HTMLElement;
	creativeId: string;
	fullscreenable: boolean;
	fullscreenAllowed: boolean;
	image1: UapImage;
	image2: UapImage;
	isDarkTheme: boolean;
	isMobile: boolean;
	isSticky: boolean;
	lineItemId: string;
	loadMedrecFromBTF: boolean;
	moatTracking: boolean;
	player: HTMLElement;
	resolvedStateAspectRatio: number;
	resolvedStateAutoPlay: boolean;
	resolvedStateForced?: boolean;
	restartOnUnmute: boolean;
	slotName: string;
	splitLayoutVideoPosition: string;
	src: string;
	stickyAdditionalTime: number;
	stickyUntilVideoViewed: boolean;
	theme: string;
	thumbnail: HTMLElement;
	uap: string;
	videoAspectRatio: number;
	videoPlaceholderElement: HTMLElement;
	videoTriggers: any[];

	// Video
	vastTargeting: {
		passback: string;
	};
	videoTriggerElement: HTMLVideoElement;
	type: string;

	height: number;
	width: number;

	// Twitch params
	channelName: string;
}

function getVideoSize(
	slot: HTMLElement,
	params: UapParams,
	videoSettings: UapVideoSettings,
): VideoSize {
	const width: number = videoSettings.isSplitLayout()
		? params.videoPlaceholderElement.offsetWidth
		: slot.clientWidth;
	const height = width / params.videoAspectRatio;

	return {
		width,
		height,
	};
}

function adjustVideoAdContainer(params: UapParams): void {
	if (params.splitLayoutVideoPosition) {
		const videoAdContainer = params.container.querySelector('.video-player');

		videoAdContainer.classList.add(`video-player-${params.splitLayoutVideoPosition}`);
	}
}

async function loadPorvata(videoSettings, slotContainer, imageContainer): Promise<PorvataPlayer> {
	const params = videoSettings.getParams();
	const template = videoUserInterface.selectTemplate(videoSettings);

	params.autoPlay = videoSettings.isAutoPlay();
	videoSettings.updateParams(params);

	const video = await Porvata.inject(params);

	video.container.style.position = 'relative';
	videoUserInterface.setup(video, template, {
		autoPlay: videoSettings.isAutoPlay(),
		image: imageContainer,
		container: slotContainer,
		thumbnail: params.thumbnail,
		clickThroughURL: params.clickThroughURL,
		aspectRatio: params.aspectRatio,
		videoAspectRatio: params.videoAspectRatio,
		hideWhenPlaying: params.videoPlaceholderElement || params.image,
		splitLayoutVideoPosition: params.splitLayoutVideoPosition,
	});

	video.addEventListener('wikiaAdCompleted', () => {
		video.reload();
	});

	adjustVideoAdContainer(params);

	return video;
}

function recalculateTwitchSize(params): () => void {
	return () => {
		const { adContainer, clickArea, player, twitchAspectRatio } = params;

		player.style.height = `${adContainer.clientHeight}px`;
		player.style.width = `${player.clientHeight * twitchAspectRatio}px`;
		clickArea.style.width = `${params.adContainer.clientWidth - player.clientWidth}px`;
	};
}

async function loadTwitchPlayer(iframe: HTMLIFrameElement, params): Promise<TwitchPlayer> {
	const { channelName, player } = params;
	const options: TwitchOptions = {
		height: '100%',
		width: '100%',
		channel: channelName,
	};

	iframe.parentNode.insertBefore(player, iframe);

	const twitchPlayer = new TwitchPlayer(player, options, params);

	await twitchPlayer.getPlayer();

	recalculateTwitchSize(params)();

	return twitchPlayer;
}

async function loadTwitchAd(iframe: HTMLIFrameElement, params: UapParams): Promise<void> {
	const { player } = params;

	await loadTwitchPlayer(iframe, params);
	window.addEventListener('resize', throttle(recalculateTwitchSize(params), 250));
	(player.firstChild as HTMLElement).id = 'twitchPlayerContainer';
}

async function loadVideoAd(videoSettings: UapVideoSettings): Promise<PorvataPlayer> {
	const params = videoSettings.getParams();
	const imageContainer: HTMLElement = params.container.querySelector('div:last-of-type');
	const size: VideoSize = getVideoSize(params.container, params, videoSettings);

	params.vastTargeting = {
		passback: getType(),
	};
	params.width = size.width;
	params.height = size.height;
	videoSettings.updateParams(params);

	function recalculateVideoSize(video): () => void {
		return () => {
			const currentSize = getVideoSize(params.container, params, videoSettings);

			video.resize(currentSize.width, currentSize.height);
		};
	}

	const video: PorvataPlayer = await loadPorvata(videoSettings, params.container, imageContainer);

	window.addEventListener('resize', throttle(recalculateVideoSize(video), 250));

	if (params.videoTriggerElement) {
		params.videoTriggerElement.addEventListener('click', () => video.play());
	} else if (params.videoTriggers) {
		params.videoTriggers.forEach((trigger) => {
			trigger.addEventListener('click', () => video.play());
		});
	}

	return video;
}

function getUapId(): string {
	return uapId;
}

function getCreativeId(): string {
	return uapCreativeId;
}

function setIds(lineItemId, creativeId): void {
	uapId = lineItemId || constants.DEFAULT_UAP_ID;
	uapCreativeId = creativeId || constants.DEFAULT_UAP_ID;

	updateSlotsTargeting(uapId, uapCreativeId);
}

function getType(): string {
	return uapType;
}

function setType(type): void {
	uapType = type;
}

function updateSlotsTargeting(lineItemId, creativeId): void {
	const slots = context.get('slots') || {};

	Object.keys(slots).forEach((slotId) => {
		if (!slots[slotId].nonUapSlot) {
			context.set(`slots.${slotId}.targeting.uap`, lineItemId);
			context.set(`slots.${slotId}.targeting.uap_c`, creativeId);
		}
	});
}

function enableSlots(slotsToEnable): void {
	if (getType() !== 'abcd') {
		slotsToEnable.forEach((slotName) => {
			btfBlockerService.unblock(slotName);
		});
	}
}

function disableSlots(slotsToDisable): void {
	slotsToDisable.forEach((slotName) => {
		slotService.disable(slotName);
	});
}

function initSlot(params: UapParams): void {
	const adSlot: AdSlot = slotService.get(params.slotName);

	params.container = adSlot.getElement();

	if (params.isDarkTheme) {
		params.container.classList.add('is-dark');
	}
	if (params.isMobile) {
		params.container.classList.add('is-mobile-layout');
	}
	if (utils.client.isSmartphone() || utils.client.isTablet()) {
		params.container.classList.add('is-mobile-device');
	}
}

function reset(): void {
	setType(constants.DEFAULT_UAP_TYPE);
	setIds(constants.DEFAULT_UAP_ID, constants.DEFAULT_UAP_ID);
}

function isFanTakeoverLoaded(): boolean {
	return (
		getUapId() !== constants.DEFAULT_UAP_ID &&
		constants.FAN_TAKEOVER_TYPES.indexOf(getType()) !== -1
	);
}

export const universalAdPackage = {
	...constants,
	init(params: UapParams, slotsToEnable: string[] = [], slotsToDisable: string[] = []): void {
		let adProduct = 'uap';

		if (this.isVideoEnabled(params)) {
			adProduct = 'vuap';
		}

		params.adProduct = params.adProduct || adProduct;

		setIds(params.uap, params.creativeId);
		disableSlots(slotsToDisable);
		enableSlots(slotsToEnable);
		setType(params.adProduct);

		if (params.slotName) {
			initSlot(params);
		}
	},
	initSlot,
	isFanTakeoverLoaded,
	getCreativeId,
	getType,
	getUapId,
	isVideoEnabled(params) {
		const triggersArrayIsNotEmpty =
			Array.isArray(params.videoTriggers) && params.videoTriggers.length > 0;

		return !!params.videoAspectRatio && (params.videoPlaceholderElement || triggersArrayIsNotEmpty);
	},
	loadVideoAd,
	loadTwitchAd,
	reset,
	setType,
};
