import {
	AdSlotEventPayload,
	communicationService,
	eventsRepository,
	ofType,
} from '@ad-engine/communication';
import { AdSlotEvent, AdSlotStatus, context, targetingService } from '@ad-engine/core';
import { filter, take } from 'rxjs/operators';
import * as constants from './constants';

const uapId = constants.DEFAULT_UAP_ID;
const uapType = constants.DEFAULT_UAP_TYPE;

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

export const getType = (): string => {
	return uapType;
};

export function updateSlotsTargeting(lineItemId, creativeId): void {
	const slots = context.get('slots') || {};

	Object.keys(slots).forEach((slotId) => {
		targetingService.set('uap', lineItemId, slotId);
		targetingService.set('uap_c', creativeId, slotId);
	});
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

// Let's leave this, since there's a lot of spaghetti logic which prevent incontent ads from being started
// Let's remove the function export, since this function is only invoked in this file
function registerUapListener(): void {
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
				isLoaded: false,
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

// Side effect
registerUapListener();
