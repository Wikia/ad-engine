import { Dictionary } from '@ad-engine/core';
// tslint:disable-next-line:import-blacklist
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

export interface LoadTemplatePayload {
	slotName: string;
	type: string;
}

export interface UapLoadStatus {
	isLoaded: boolean;
	adProduct: string;
}

export const eventsRepository: Dictionary<EventOptions> = {
	AD_ENGINE_BAB_DETECTION: {
		category: '[Ad Engine]',
		name: 'BAB detection finished',
		payload: props<{ detected: boolean }>(),
	},
	AD_ENGINE_CONFIGURED: {
		name: 'Configured',
	},
	AD_ENGINE_MESSAGEBOX_EVENT: {
		name: 'MessageBox event',
		payload: props<{ adSlotName: string; ad_status: string }>(),
	},
	AD_ENGINE_SLOT_ADDED: {
		name: 'Ad Slot added',
		payload: props<GeneralPayload>(),
	},
	AD_ENGINE_SLOT_EVENT: {
		name: 'Ad Slot event',
		payload: props<{ event: string; payload?: any; adSlotName: string }>(),
	},
	AD_ENGINE_SLOT_LOADED: {
		name: 'Ad Slot loaded',
		payload: props<GeneralPayload>(),
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
	AD_ENGINE_VIDEO_LEARN_MORE_DISPLAYED: {
		name: 'Video learn more displayed',
		payload: props<{ adSlotName: string; learnMoreLink: HTMLElement }>(),
	},
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
	AUDIGENT_LOADED: {
		name: 'ATS.js not loaded for logged in user',
	},
	ATS_NOT_LOADED_LOGGED: {
		name: 'Audigent loaded',
		payload: props<{ reason: string }>(),
	},
	BIDDERS_BIDDING_DONE: {
		category: '[Prebid]',
		name: 'Bidding done',
		payload: props<{ provider: string; slotName: string }>(),
	},
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
	LIVERAMP_IDS_LOADED: {
		name: 'LiveRamp Prebid ids loaded',
		payload: props<{ userId: string }>(),
	},
	NATIVO_LOADED: {
		name: 'Nativo loaded',
		payload: props<{ isLoaded: boolean }>(),
	},
};
