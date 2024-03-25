import { Dictionary } from "../core/models/dictionary";
import { payload, props } from 'ts-action';
import { EventOptions } from "./events/event-options";

export interface GeneralPayload {
	name: string;
	state: string;
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
	additionalInfo?: {
		dsa?: object;
	};
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
	slot: object;
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
	RAIL_READY: {
		category: '[Rail]',
		name: 'Ready',
	},
} as const satisfies Dictionary<EventOptions>;
