import { context } from '@wikia/ad-engine';

export const nativeAdSlotName = 'ntv-ad';
export const nativeAdWrapperClassList = ['ntv-ad'];
export const nativeAdSlotClassList = ['ntv-ad', 'ad-slot'];

export const isNativeAdApplicable = (): boolean =>
	context.get('services.nativo.enabled') && context.get('wiki.opts.enableNativeAds');
