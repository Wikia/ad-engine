import { AdSlot, Dictionary } from '@ad-engine/core';
import { Action } from '@wikia/post-quecast';
import { payload, props } from 'ts-action';

export interface EventOptions {
	category?: string;
	name: string;
	payload?: any;
	action?: Action;
}

interface GeneralPayload {
	name: string;
	state: string;
}

interface ViewRenderedProps {
	viewType: string;
	beaconId: string;
	pvNumber: number;
	pvNumberGlobal: number;
	pvUID: string;
	sessionId: string;
}

export interface AdIntervention {
	id: string;
	message: string;
	slotName: string;
}

export interface CcpaSignalPayload {
	ccpaSignal: boolean;
	geoRequiresSignal: boolean;
}

export interface GdprConsentPayload {
	gdprConsent: boolean;
	geoRequiresConsent: boolean;
}

export interface LoadTemplatePayload {
	slotName: string;
	type: string;
}

export interface TrackingBidDefinition {
	bidderName: string;
	buyerId?: string;
	price: string;
	responseTimestamp: number;
	slotName: string;
	size: string;
	timeToRespond: number;
}

export interface UapLoadStatus {
	isLoaded: boolean;
	adProduct: string;
}

export const eventsRepository: Dictionary<EventOptions> = {
	// AdEngine life cycle events //
	AD_ENGINE_BAB_DETECTION: {
		category: '[Ad Engine]',
		name: 'BAB detection finished',
		payload: props<{ detected: boolean }>(),
	},
	AD_ENGINE_CONFIGURED: {
		name: 'Configured',
	},
	AD_ENGINE_CONSENT_READY: {
		category: '[AdEngine OptIn]',
		name: 'set opt in',
		payload: props<GdprConsentPayload & CcpaSignalPayload>(),
	},
	AD_ENGINE_INSTANT_CONFIG_CACHE_RESET: {
		name: 'Instant Config cache reset',
	},
	AD_ENGINE_INTERSTITIAL_DISPLAYED: {
		name: 'Interstitial displayed',
	},
	AD_ENGINE_MESSAGE_BOX_EVENT: {
		name: 'MessageBox event',
		payload: props<{ adSlotName: string; ad_status: string }>(),
	},
	AD_ENGINE_STACK_START: {
		name: 'Ad Stack started',
	},
	AD_ENGINE_TEMPLATE_LOADED: {
		name: 'Template loaded',
		payload: props<GeneralPayload>(),
	},
	AD_ENGINE_UAP_LOAD_STATUS: {
		name: 'UAP Load status',
		payload: props<UapLoadStatus>(),
	},
	// Ad slot events //
	AD_ENGINE_INVALIDATE_SLOT_TARGETING: {
		name: 'Invalidate slot targeting',
		payload: props<{ slot: AdSlot }>(),
	},
	AD_ENGINE_VIDEO_LEARN_MORE_DISPLAYED: {
		name: 'Video learn more displayed',
		payload: props<{ adSlotName: string; learnMoreLink: HTMLElement }>(),
	},
	AD_ENGINE_SLOT_ADDED: {
		name: 'Ad Slot added',
		payload: props<{ name: string; slot: AdSlot; state: string }>(),
	},
	AD_ENGINE_SLOT_EVENT: {
		name: 'Ad Slot event',
		payload: props<{
			event: string;
			slot: AdSlot;
			adSlotName: string;
			status: string;
			payload?: any;
		}>(),
	},
	AD_ENGINE_SLOT_LOADED: {
		name: 'Ad Slot loaded',
		payload: props<GeneralPayload>(),
	},
	// Integrated partners events //
	ADMARKETPLACE_INIT: {
		category: '[Search suggestions]',
		name: 'Initialized',
	},
	ADMARKETPLACE_CALLED: {
		category: '[Search suggestions]',
		name: 'Called',
		payload: props<{ query: string }>(),
	},
	ATS_JS_LOADED: {
		name: 'ATS.js loaded',
		payload: props<{ loadTime: number }>(),
	},
	ATS_IDS_LOADED: {
		name: 'ATS ids loaded',
		payload: props<{ envelope: string }>(),
	},
	ATS_NOT_LOADED_LOGGED: {
		name: 'ATS.js not loaded for logged in user',
		payload: props<{ reason: string }>(),
	},
	AUDIGENT_LOADED: {
		name: 'Audigent loaded',
	},
	LIVERAMP_IDS_LOADED: {
		name: 'LiveRamp Prebid ids loaded',
		payload: props<{ userId: string }>(),
	},
	NATIVO_LOADED: {
		name: 'Nativo loaded',
		payload: props<{ isLoaded: boolean }>(),
	},
	// Platforms events //
	BINGEBOT_AD_SLOT_INJECTED: {
		category: '[BingeBot]',
		name: 'ad slot injected',
		payload: props<{ slotId: string }>(),
	},
	BINGEBOT_BEFORE_VIEW_CHANGE: {
		category: '[BingeBot]',
		name: 'before view change',
	},
	BINGEBOT_DESTROY_AD_SLOT: {
		category: '[BingeBot]',
		name: 'destroy ad slot',
		payload: props<{ slotId: string }>(),
	},
	BINGEBOT_VIEW_RENDERED: {
		category: '[BingeBot]',
		name: 'view rendered',
		payload: props<ViewRenderedProps>(),
	},
	F2_HIDE_SMART_BANNER: {
		category: '[AdEngine F2 Templates]',
		name: 'hide smart banner',
	},
	FAN_FEED_READY: {
		category: '[FanFeed]',
		name: 'Ready',
	},
	PLATFORM_BEFORE_PAGE_CHANGE: {
		category: '[Platform]',
		name: 'Before page change',
	},
	RAIL_READY: {
		category: '[Rail]',
		name: 'Ready',
	},
	// Bidders events //
	BIDDERS_BIDDING_DONE: {
		category: '[Prebid]',
		name: 'Bidding done',
		payload: props<{ provider: string; slotName: string }>(),
	},
	BIDDERS_BIDS_REFRESH: {
		category: '[Prebid]',
		name: 'Bids refresh',
		payload: props<{ refreshedSlotNames: string[] }>(),
	},
	BIDDERS_BIDS_RESPONSE: {
		category: '[Prebid]',
		name: 'Bids response',
		payload: props<{ bidResponse: TrackingBidDefinition }>(),
	},
	BIDDERS_PREBID_LAZY_CALL: {
		category: '[Prebid]',
		name: 'Prebid lazy call',
	},
	// Video events //
	VIDEO_EVENT: {
		category: '[Video]',
		name: 'Video event',
		payload: props<{ videoEvent: object }>(),
	},
	VIDEO_PLAYER_TRACKING: {
		category: '[Video]',
		name: 'Video player tracking',
		payload: props<{ eventInfo: object }>(),
	},
	// Events emitted by Google Ad Manager creatives //
	GAM_AD_INTERVENTION: {
		category: '[GAM iframe]',
		name: 'Ad intervention',
		payload: props<AdIntervention>(),
	},
	GAM_LOAD_TEMPLATE: {
		category: '[GAM iframe]',
		name: 'Load template',
		payload: payload<LoadTemplatePayload>(),
	},
};
