import { context } from '@wikia/ad-engine';

export const NATIVE_AD_SLOT_NAME = 'ntv-ad';
export const NATIVE_AD_SLOT_CLASS_LIST = ['ntv-ad', 'ad-slot'];
export const NATIVE_AD_WRAPPER_CLASS_LIST = ['ntv-ad'];

export const isNativeAdApplicable = (): boolean =>
	context.get('services.nativo.enabled') && context.get('wiki.opts.enableNativeAds');
