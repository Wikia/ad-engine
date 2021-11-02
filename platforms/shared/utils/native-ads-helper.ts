import { context } from '@wikia/ad-engine';

export const NATIVO_INCONTENT_AD_SLOT_NAME = 'ntv_ad';
export const NATIVE_AD_SLOT_CLASS_LIST = ['ntv-ad', 'ad-slot'];

export const isNativeAdApplicable = (): boolean =>
	context.get('services.nativo.enabled') && context.get('wiki.opts.enableNativeAds');
