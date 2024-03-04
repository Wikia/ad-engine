import {
	AdSlotEventPayload,
	communicationService,
	eventsRepository,
	ofType,
} from '@ad-engine/communication';
import {
	AdSlot,
	AdSlotEvent,
	AdSlotStatus,
	btfBlockerService,
	context,
	slotService,
	targetingService,
	utils,
} from '@ad-engine/core';
import { filter, take } from 'rxjs/operators';
import * as constants from './constants';

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

export interface UapParams {
	adContainer: HTMLElement;
	adProduct: string;
	autoPlay: boolean;
	clickThroughURL: string;
	config: UapConfig;
	container: HTMLElement;
	creativeId: string;
	image1: UapImage;
	image2?: UapImage;
	isDarkTheme: boolean;
	isMobile: boolean;
	lineItemId: string;
	newTakeoverConfig: boolean;
	sequentialUapConfig: boolean;
	slotName: string;
	src: string;
	uap: string;
	height: number;
	width: number;
	thumbnail: HTMLElement;
	useVideoSpecialAdUnit: boolean;
}

export function getUapId(): string {
	return uapId;
}

function setIds(lineItemId, creativeId): void {
	uapId = lineItemId || constants.DEFAULT_UAP_ID;
	uapCreativeId = creativeId || constants.DEFAULT_UAP_ID;

	updateSlotsTargeting(uapId, uapCreativeId);
}

export const getType = (): string => {
	return uapType;
};

export function setType(type): void {
	uapType = type;
}

export function updateSlotsTargeting(lineItemId, creativeId): void {
	const slots = context.get('slots') || {};

	Object.keys(slots).forEach((slotId) => {
		targetingService.set('uap', lineItemId, slotId);
		targetingService.set('uap_c', creativeId, slotId);
	});
}

export function enableSlots(slotsToEnable): void {
	slotsToEnable.forEach((slotName) => {
		btfBlockerService.unblock(slotName);
	});
}

export function disableSlots(slotsToDisable): void {
	slotsToDisable.forEach((slotName) => {
		slotService.disable(slotName);
	});
}

export function initSlot(params: UapParams): void {
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

export function reset(): void {
	setType(constants.DEFAULT_UAP_TYPE);
	setIds(constants.DEFAULT_UAP_ID, constants.DEFAULT_UAP_ID);
}

export const isFanTakeoverLoaded = (): boolean => {
	return (
		getUapId() !== constants.DEFAULT_UAP_ID &&
		constants.FAN_TAKEOVER_TYPES.indexOf(getType()) !== -1
	);
};

export function isVideoEnabled(params): boolean {
	return params.thumbnail;
}

export function registerUapListener(): void {
	communicationService.action$
		.pipe(
			ofType(communicationService.getGlobalAction(eventsRepository.AD_ENGINE_SLOT_EVENT)),
			filter((action: AdSlotEventPayload) => {
				const isFirstCallAdSlot = !!context.get(`slots.${action.adSlotName}.firstCall`);

				return (
					isFirstCallAdSlot &&
					[
						AdSlotEvent.TEMPLATES_LOADED,
						AdSlotStatus.STATUS_COLLAPSE,
						AdSlotStatus.STATUS_FORCED_COLLAPSE,
					]
						.map((status) => action.event === status)
						.some((x) => !!x)
				);
			}),
			take(1),
		)
		.subscribe(() => {
			communicationService.emit(eventsRepository.AD_ENGINE_UAP_LOAD_STATUS, {
				isLoaded: isFanTakeoverLoaded(),
				adProduct: getType(),
			});
		});
}

// Constants are still being referenced in multiple places
// Due to linting rules setup in AdEng, constants cannot be imported by themselves
// through direct paths. They must all be stored in a variable, and resurfaced up through
// a chain of index.ts files
export const uapConsts = {
	...constants,
};

export const universalFuncs = {
	isFanTakeoverLoaded,
	reset,
	updateSlotsTargeting,
};

// Side effect
registerUapListener();
