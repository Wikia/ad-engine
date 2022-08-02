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

export interface BiddersEventPayload {
	provider: string;
	slotName: string;
}

export interface AdSlotEventPayload {
	event: string;
	slot: AdSlot;
	adSlotName: string;
	status: string;
	payload?: any;
}

export interface IdentityDataPayload {
	partnerName: string;
	partnerIdentityId: string | null;
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
	AD_ENGINE_LOAD_TIME_INIT: {
		name: 'Ad engine load time init',
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
	AD_ENGINE_UAP_DOM_CHANGED: {
		name: 'UAP DOM changed',
		payload: props<{ element: string; size: number }>(),
	},
	AD_ENGINE_UAP_LOAD_STATUS: {
		name: 'UAP Load status',
		payload: props<UapLoadStatus>(),
	},
	AD_ENGINE_UAP_NTC_LOADED: {
		name: 'UAP NTC loaded',
	},
	AD_ENGINE_PARTNERS_READY: {
		name: 'Ad Partners Ready',
	},
	// Ad slot events //
	AD_ENGINE_INVALIDATE_SLOT_TARGETING: {
		name: 'Invalidate slot targeting',
		payload: props<{ slot: AdSlot }>(),
	},
	AD_ENGINE_VIDEO_OVERLAY_CLICKED: {
		name: 'Video overlay added',
		payload: props<{ adSlotName: string; ad_status: string }>(),
	},
	AD_ENGINE_VIDEO_TOGGLE_UI_OVERLAY_CLICKED: {
		name: 'Video toggle ui overlay clicked',
		payload: props<{ adSlotName: string; ad_status: string }>(),
	},
	AD_ENGINE_VIDEO_LEARN_MORE_CLICKED: {
		name: 'Video learn more displayed',
		payload: props<{ adSlotName: string; ad_status: string }>(),
	},
	AD_ENGINE_SLOT_ADDED: {
		name: 'Ad Slot added',
		payload: props<{ name: string; slot: AdSlot; state: string }>(),
	},
	AD_ENGINE_SLOT_EVENT: {
		name: 'Ad Slot event',
		payload: props<AdSlotEventPayload>(),
	},
	AD_ENGINE_SLOT_LOADED: {
		name: 'Ad Slot loaded',
		payload: props<GeneralPayload>(),
	},
	AD_ENGINE_AD_CLICKED: {
		name: 'Ad clicked',
		payload: props<Dictionary>(),
	},
	// Identity resolution events //
	IDENTITY_RESOLUTION_PPID_UPDATED: {
		category: '[Identity resolution]',
		name: 'PPID Updated',
		payload: props<string>(),
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
	IDENTITY_PARTNER_DATA_OBTAINED: {
		name: 'Identity partner data obtained',
		payload: payload<IdentityDataPayload>(),
	},
	LIVE_CONNECT_STARTED: {
		name: 'LiveConnect started',
	},
	LIVE_CONNECT_RESPONDED_UUID: {
		name: 'LiveConnect responded with UUID',
	},
	NATIVO_LOADED: {
		name: 'Nativo loaded',
		payload: props<{ isLoaded: boolean }>(),
	},
	NO_NATIVE_PREBID_AD: {
		name: 'No native prebid ad',
		payload: props<{ slotName: string }>(),
	},
	NO_NATIVO_AD: {
		name: 'No nativo ad',
		payload: props<{ slotName: string }>(),
	},
	TIMESTAMP_EVENT: {
		name: 'Timestamp event',
		payload: props<{ eventName: string; timestamp: number }>(),
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
	QUIZ_AD_INJECTED: {
		category: '[quizConsumption]',
		name: 'ad slot injected',
		payload: props<{ slotId: string }>(),
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
		payload: props<BiddersEventPayload>(),
	},
	BIDDERS_BIDS_CALLED: {
		category: '[Prebid]',
		name: 'Bids called',
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
	BIDDERS_INIT_STAGE_DONE: {
		category: '[Prebid]',
		name: 'Init stage done',
	},
	BIDDERS_MAIN_STAGE_DONE: {
		category: '[Prebid]',
		name: 'Main stage done',
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
	GAM_INTERSTITIAL_LOADED: {
		category: '[GAM iframe]',
		name: 'Interstitial loaded',
	},
	GAM_LOAD_TEMPLATE: {
		category: '[GAM iframe]',
		name: 'Load template',
		payload: payload<LoadTemplatePayload>(),
	},
};
