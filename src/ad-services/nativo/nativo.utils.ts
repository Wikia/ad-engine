import { context } from '@ad-engine/core';

export const NATIVO_INCONTENT_AD_SLOT_NAME = 'ntv_ad';
export const NATIVO_FEED_AD_SLOT_NAME = 'ntv_feed_ad';
export const NATIVO_AD_SLOT_CLASS_LIST = ['ntv-ad', 'ad-slot'];

export const isNativeAdApplicable = (): boolean =>
	context.get('services.nativo.enabled') && context.get('wiki.opts.enableNativeAds');
