import {
	AdSlotEventPayload,
	communicationService,
	eventsRepository,
	ofType,
} from '@ad-engine/communication';
import { AdSlotEvent, AdSlotStatus, context, targetingService } from '@ad-engine/core';
import { filter, take } from 'rxjs/operators';

/* These are all leftovers from the UAP package that are referenced in multiple places outside of UAP.
 * Removing these interfaces, variables and functions breaks certain Ad functionality.
 *
 * One notable feature that broke if the registerUapListener() function was not invoked at the bottom of this file,
 * was the inability to load incontent ads when a Top Leaderboard ad loaded, specifically when scrolling down the page. */

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

export function updateSlotsTargeting(lineItemId, creativeId): void {
	const slots = context.get('slots') || {};

	Object.keys(slots).forEach((slotId) => {
		targetingService.set('uap', lineItemId, slotId);
		targetingService.set('uap_c', creativeId, slotId);
	});
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
				adProduct: 'none',
			});
		});
}

// Side effect
registerUapListener();
