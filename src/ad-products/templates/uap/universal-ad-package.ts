import {
	AdSlotEventPayload,
	communicationService,
	eventsRepository,
	ofType,
} from '@ad-engine/communication';
import { AdSlot, btfBlockerService, context, slotService, Targeting, utils } from '@ad-engine/core';
import { filter, take } from 'rxjs/operators';
import * as constants from './constants';

let uapCreativeId = constants.DEFAULT_UAP_ID;
let uapId = constants.DEFAULT_UAP_ID;
let uapType: AdProductType = constants.DEFAULT_UAP_TYPE;

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
		top?: UapState<number>;
		right?: UapState<number>;
		bottom?: UapState<number>;
		width?: UapState<number>;
	};
}

export interface UapImage {
	element: HTMLImageElement;
	background?: string;
}

export interface VideoSize {
	height: number;
	width: number;
}

export interface UapParams {
	adContainer: HTMLElement;
	adProduct: AdProductType;
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
	image2?: UapImage;
	isDarkTheme: boolean;
	isMobile: boolean;
	isSticky: boolean;
	lineItemId: string;
	loadMedrecFromBTF: boolean;
	moatTracking: boolean;
	player: string;
	resolvedStateAspectRatio: number;
	resolvedStateAutoPlay: boolean;
	resolvedStateForced?: boolean;
	restartOnUnmute: boolean;
	slotName: string;
	splitLayoutVideoPosition: string;
	src: string;
	stickyAdditionalTime: number;
	stickyUntilSlotViewed: boolean;
	stickyUntilVideoViewed: boolean;
	theme: string;
	thumbnail: HTMLElement;
	uap: string;
	videoAspectRatio: number;
	videoPlaceholderElement: HTMLElement;
	videoTriggers: any[];

	// Video
	vastTargeting: Targeting;
	videoTriggerElement: HTMLVideoElement;
	type: string;
	useVideoSpecialAdUnit: boolean;

	height: number;
	width: number;
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

function setType(type: AdProductType): void {
	uapType = type;
	context.set('state.uap.type', uapType);
}

function updateSlotsTargeting(lineItemId, creativeId): void {
	const slots = context.get('slots') || {};

	Object.keys(slots).forEach((slotId) => {
		context.set(`slots.${slotId}.targeting.uap`, lineItemId);
		context.set(`slots.${slotId}.targeting.uap_c`, creativeId);
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

	if (params.useVideoSpecialAdUnit) {
		adSlot.setConfigProperty('videoAdUnit', constants.SPECIAL_VIDEO_AD_UNIT);
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
		let adProduct: AdProductType = 'uap';

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
	isVideoEnabled(params): boolean {
		const triggersArrayIsNotEmpty =
			Array.isArray(params.videoTriggers) && params.videoTriggers.length > 0;

		return !!params.videoAspectRatio && (params.videoPlaceholderElement || triggersArrayIsNotEmpty);
	},
	reset,
	setType,
	updateSlotsTargeting,
};

export function registerUapListener(): void {
	communicationService.action$
		.pipe(
			ofType(communicationService.getGlobalAction(eventsRepository.AD_ENGINE_SLOT_EVENT)),
			filter((action: AdSlotEventPayload) => {
				const isFirstCallAdSlot = !!context.get(`slots.${action.adSlotName}.firstCall`);

				return (
					isFirstCallAdSlot &&
					[AdSlot.TEMPLATES_LOADED, AdSlot.STATUS_COLLAPSE, AdSlot.STATUS_FORCED_COLLAPSE]
						.map((status) => action.event === status)
						.some((x) => !!x)
				);
			}),
			take(1),
		)
		.subscribe(() => {
			communicationService.emit(eventsRepository.AD_ENGINE_UAP_LOAD_STATUS, {
				isLoaded: universalAdPackage.isFanTakeoverLoaded(),
				adProduct: universalAdPackage.getType(),
			});
		});
}

// Side effect
registerUapListener();
