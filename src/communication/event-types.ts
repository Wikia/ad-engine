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

export interface VideoAdsOptions {
	showAds: boolean;
	targetingParams?: string;
	videoAdUnitPath?: string;
}

export const eventsRepository = {
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
	AD_ENGINE_CONSENT_UPDATE: {
		category: '[AdEngine OptIn]',
		name: 'update opt in',
		payload: props<GdprConsentPayload & CcpaSignalPayload>(),
	},
	AD_ENGINE_GPT_READY: {
		name: 'GPT Ready',
	},
	AD_ENGINE_INSTANT_CONFIG_CACHE_RESET: {
		name: 'Instant Config cache reset',
	},
	AD_ENGINE_INSTANT_CONFIG_CACHE_READY: {
		name: 'Instant Config cache ready',
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
	AD_ENGINE_PARTNERS_READY: {
		name: 'Partners Ready',
	},
	AD_ENGINE_STACK_START: {
		name: 'Ad Stack started',
	},
	AD_ENGINE_STACK_COMPLETED: {
		name: 'Ad Stack completed',
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
	AD_ENGINE_AD_RESIZED: {
		name: 'Ad slot resized',
		payload: props<{ slot: AdSlot; sizes: Dictionary }>(),
	},
	AD_ENGINE_AD_CLICKED: {
		name: 'Ad clicked',
		payload: props<Dictionary>(),
	},
	// Integrated partners events //
	IDENTITY_PARTNER_DATA_OBTAINED: {
		name: 'Identity partner data obtained',
		payload: payload<IdentityDataPayload>(),
	},
	PARTNER_LOAD_STATUS: {
		name: 'Partner load status',
		payload: props<{ status: string }>(),
	},
	// Integrated partners events //
	ANYCLIP_READY: {
		name: 'Anyclip ready',
	},
	ANYCLIP_START: {
		name: 'Anyclip start',
	},
	ANYCLIP_LATE_INJECT: {
		name: 'Anyclip late inject',
	},
	SYSTEM1_STARTED: {
		name: 'System1 started',
	},
	NO_NATIVE_PREBID_AD: {
		name: 'No native prebid ad',
		payload: props<{ slotName: string }>(),
	},
	CONNATIX_LATE_INJECT: {
		name: 'Connatix late inject',
	},
	CONNATIX_READY: {
		name: 'Connatix ready',
	},
	INTENT_IQ_GROUP_OBTAINED: {
		name: 'IntentIQ A/B test group obtained',
		payload: props<{ abTestGroup: string }>(),
	},
	NO_NATIVO_AD: {
		name: 'No nativo ad',
		payload: props<{ slotName: string }>(),
	},
	LIVE_CONNECT_STARTED: {
		name: 'LiveConnect started',
	},
	LIVE_CONNECT_CACHED: {
		name: 'LiveConnect data cached',
	},
	LIVE_CONNECT_RESPONDED_UUID: {
		name: 'LiveConnect responded with UUID',
	},
	YAHOO_STARTED: {
		name: 'Yahoo started',
	},
	IDENTITY_ENGINE_READY: {
		category: '[IdentityEngine]',
		name: 'Identity ready',
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
	PLATFORM_PAGE_CHANGED: {
		category: '[Platform]',
		name: 'Page changed',
	},
	PLATFORM_PAGE_EXTENDED: {
		category: '[Platform]',
		name: 'Page extended',
	},
	PLATFORM_AD_PLACEMENT_READY: {
		category: '[Platform]',
		name: 'Ad placement ready',
		payload: props<{ placementId: string }>(),
	},
	PLATFORM_LIGHTBOX_READY: {
		category: '[Platform]',
		name: 'Lightbox ready',
		payload: props<{ placementId: string }>(),
	},
	PLATFORM_LIGHTBOX_CLOSED: {
		category: '[Platform]',
		name: 'Lightbox closed',
		payload: props<{ placementId: string }>(),
	},
	PLATFORM_LIGHTBOX_IMAGE_CHANGE: {
		category: '[Platform]',
		name: 'Lightbox image change',
		payload: props<{ placementId: string }>(),
	},
	RAIL_READY: {
		category: '[Rail]',
		name: 'Ready',
	},
	// Bidders events //
	A9_WITHOUT_CONSENTS: {
		name: 'A9 without consents',
	},
	A9_APSTAG_HEM_SENT: {
		name: 'A9 Apstag HEM sent',
	},
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
	BIDDERS_AUCTION_DONE: {
		category: '[Prebid]',
		name: 'Auction done',
	},
	BIDDERS_CALL_PER_GROUP: {
		category: '[Prebid]',
		name: 'Call per group',
		payload: props<{ group: string; callback: () => void }>(),
	},
	SLOT_REFRESHER_SET_MAXIMUM_SLOT_HEIGHT: {
		category: '[Bidders]',
		name: 'Filter adSlot sizes taller than rendered adSlot',
		payload: props<{ adSlot: AdSlot }>(),
	},
	// Video events //
	VIDEO_SETUP: {
		category: '[Video]',
		name: 'Setup done',
		payload: props<{
			autoplayDisabled: boolean;
			showAds: boolean;
			videoAdUnitPath: string;
			targetingParams: string;
		}>(),
	},
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
	VIDEO_PLAYER_RENDERED: {
		category: '[Video]',
		name: 'Player rendered',
		payload: props<{ renderId: string; videoAdsOptions: VideoAdsOptions }>(),
	},
	// Events emitted by Google Ad Manager creatives //
	GAM_AD_INTERVENTION: {
		category: '[GAM iframe]',
		name: 'Ad intervention',
		payload: props<AdIntervention>(),
	},
	GAM_AD_DELAYED_COLLAPSE: {
		category: '[GAM iframe]',
		name: 'Delayed collapse',
		payload: props<{ source: string }>(),
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
} as const satisfies Dictionary<EventOptions>;
