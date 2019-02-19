import {
	btfBlockerService,
	context,
	Porvata,
	slotService,
	TwitchPlayer,
	utils,
} from '@wikia/ad-engine';
import { throttle } from 'lodash';
import * as videoUserInterface from '../interface/video';
import * as constants from './constants';

let uapCreativeId = constants.DEFAULT_UAP_ID;
let uapId = constants.DEFAULT_UAP_ID;
let uapType = constants.DEFAULT_UAP_TYPE;

function getVideoSize(slot, params, videoSettings) {
	const width = videoSettings.isSplitLayout()
		? params.videoPlaceholderElement.offsetWidth
		: slot.clientWidth;
	const height = width / params.videoAspectRatio;

	return {
		width,
		height,
	};
}

function adjustVideoAdContainer(params) {
	if (params.splitLayoutVideoPosition) {
		const videoAdContainer = params.container.querySelector('.video-player');

		videoAdContainer.classList.add(`video-player-${params.splitLayoutVideoPosition}`);
	}
}

async function loadPorvata(videoSettings, slotContainer, imageContainer) {
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

function recalculateTwitchSize(params) {
	return () => {
		const { adContainer, clickArea, player, twitchAspectRatio } = params;

		player.style.height = `${adContainer.clientHeight}px`;
		player.style.width = `${player.clientHeight * twitchAspectRatio}px`;
		clickArea.style.width = `${params.adContainer.clientWidth - player.clientWidth}px`;
	};
}

async function loadTwitchPlayer(iframe, params) {
	const { channelName, player } = params;
	const options = {
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

async function loadTwitchAd(iframe, params) {
	const { player } = params;

	await loadTwitchPlayer(iframe, params);
	window.addEventListener('resize', throttle(recalculateTwitchSize(params), 250));
	player.firstChild.id = 'twitchPlayerContainer';
}

async function loadVideoAd(videoSettings) {
	const params = videoSettings.getParams();
	const imageContainer = params.container.querySelector('div:last-of-type');
	const size = getVideoSize(params.container, params, videoSettings);

	params.vastTargeting = {
		passback: getType(),
	};
	params.width = size.width;
	params.height = size.height;
	videoSettings.updateParams(params);

	function recalculateVideoSize(video) {
		return () => {
			const currentSize = getVideoSize(params.container, params, videoSettings);

			video.resize(currentSize.width, currentSize.height);
		};
	}

	const video = await loadPorvata(videoSettings, params.container, imageContainer);

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

function getUapId() {
	return uapId;
}

function getCreativeId() {
	return uapCreativeId;
}

function setIds(lineItemId, creativeId) {
	uapId = lineItemId || constants.DEFAULT_UAP_ID;
	uapCreativeId = creativeId || constants.DEFAULT_UAP_ID;

	updateSlotsTargeting(uapId, uapCreativeId);
}

function getType() {
	return uapType;
}

function setType(type) {
	uapType = type;
}

function updateSlotsTargeting(lineItemId, creativeId) {
	const slots = context.get('slots');

	Object.keys(slots).forEach((slotId) => {
		if (!slots[slotId].nonUapSlot) {
			context.set(`slots.${slotId}.targeting.uap`, lineItemId);
			context.set(`slots.${slotId}.targeting.uap_c`, creativeId);
		}
	});
}

function enableSlots(slotsToEnable) {
	if (getType() !== 'abcd') {
		slotsToEnable.forEach((slotName) => {
			btfBlockerService.unblock(slotName);
		});
	}
}

function disableSlots(slotsToDisable) {
	slotsToDisable.forEach((slotName) => {
		slotService.disable(slotName);
	});
}

function initSlot(params) {
	const adSlot = slotService.get(params.slotName);

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

function reset() {
	setType(constants.DEFAULT_UAP_TYPE);
	setIds(constants.DEFAULT_UAP_ID, constants.DEFAULT_UAP_ID);
}

function isFanTakeoverLoaded() {
	return (
		getUapId() !== constants.DEFAULT_UAP_ID &&
		constants.FAN_TAKEOVER_TYPES.indexOf(getType()) !== -1
	);
}

export const universalAdPackage = {
	...constants,
	init(params, slotsToEnable = [], slotsToDisable = []) {
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
