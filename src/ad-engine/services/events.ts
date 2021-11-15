import * as EventEmitter from 'eventemitter3';
import { logger } from '../utils';

const groupName = 'eventService';

export const events = {
	AD_SLOT_CREATED: Symbol('AD_SLOT_CREATED'),
	FIRST_CALL_ENDED: Symbol('FIRST_CALL_ENDED'),
	BEFORE_PAGE_CHANGE_EVENT: Symbol('BEFORE_PAGE_CHANGE_EVENT'),
	PAGE_CHANGE_EVENT: Symbol('PAGE_CHANGE_EVENT'),
	PAGE_RENDER_EVENT: Symbol('PAGE_RENDER_EVENT'),

	// video events should happen in the order below
	VIDEO_AD_REQUESTED: Symbol('VIDEO_AD_REQUESTED'),
	VIDEO_AD_ERROR: Symbol('VIDEO_AD_ERROR'),
	VIDEO_AD_IMPRESSION: Symbol('VIDEO_AD_IMPRESSION'),
	VIDEO_AD_USED: Symbol('VIDEO_AD_USED'),

	VIDEO_EVENT: Symbol('VIDEO_EVENT'),

	INVALIDATE_SLOT_TARGETING: Symbol('INVALIDATE_SLOT_TARGETING'),

	BIDS_REFRESH: Symbol('BIDS_REFRESH'),
	BIDS_RESPONSE: Symbol('BIDS_RESPONSE'),
	PREBID_LAZY_CALL: Symbol('PREBID_LAZY_CALL'),

	SCROLL_TRACKING_TIME_CHANGED: Symbol('SCROLL_TRACKING_TIME_CHANGED'),

	AD_STACK_START: 'Ad Stack started',

	INTERSTITIAL_DISPLAYED: 'interstitial-displayed',
	LOGO_REPLACED: 'logo-replaced',
};

/**
 * @deprecated For new actions use CommunicationService instead.
 */
class EventService extends EventEmitter.EventEmitter {
	constructor() {
		super();
	}

	emit(event: symbol | string, ...args: any[]): boolean {
		logger(groupName, 'emit', event, ...args);
		return super.emit(event, ...args);
	}
}

/**
 * @deprecated For new actions use communicationService instead.
 */
export const eventService = new EventService();
