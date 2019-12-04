import { context, Dictionary, InstantConfigCacheStorage, utils } from '@ad-engine/core';
import { AdInfoContext } from './slot-tracker';

function checkOptIn(): string {
	if (context.get('options.geoRequiresConsent')) {
		return context.get('options.trackingOptIn') ? 'yes' : 'no';
	}

	return '';
}

function checkOptOutSale(): string {
	if (context.get('options.geoRequiresSignal')) {
		return context.get('options.optOutSale') ? 'yes' : 'no';
	}

	return '';
}

export const slotTrackingMiddleware: utils.Middleware<AdInfoContext> = ({ data, slot }, next) => {
	const cacheStorage = InstantConfigCacheStorage.make();
	const now = new Date();
	const timestamp: number = now.getTime();
	const keyVals: Dictionary<string> = {
		likho: (context.get('targeting.likho') || []).join('|'),
	};
	let topOffset = slot.getTopOffset();

	if (typeof topOffset === 'number') {
		topOffset = Math.round(topOffset);
	}

	return next({
		slot,
		data: {
			...data,
			timestamp,
			browser: `${utils.client.getOperatingSystem()} ${utils.client.getBrowser()}`,
			country: (utils.geoService.getCountryCode() || '').toUpperCase(),
			device: utils.client.getDeviceType(),
			document_visibility: utils.getDocumentVisibilityStatus(),
			is_uap: slot.getConfigProperty('targeting.uap') ? 1 : 0,
			key_vals: Object.keys(keyVals)
				.filter((key) => keyVals[key])
				.map((key) => `${key}=${keyVals[key]}`)
				.join(';'),
			kv_ah: window.document.body.scrollHeight,
			kv_esrb: context.get('targeting.esrb') || '',
			kv_lang: context.get('targeting.lang') || '',
			kv_ref: context.get('targeting.ref') || '',
			kv_s0: context.get('targeting.s0') || '',
			kv_s0v: context.get('targeting.s0v') || '',
			kv_s1: context.get('targeting.s1') || '',
			kv_s2: context.get('targeting.s2') || '',
			kv_skin: context.get('targeting.skin') || '',
			kv_top: context.get('targeting.top') || '',
			labrador: cacheStorage.getSamplingResults().join(';'),
			opt_in: checkOptIn(),
			opt_out_sale: checkOptOutSale(),
			page_layout: `pos_top=${topOffset}`,
			page_width:
				(window.document.body.scrollWidth && window.document.body.scrollWidth.toString()) || '',
			pv: window.pvNumber || '',
			pv_unique_id: window.pvUID || '',
			scroll_y: window.scrollY || window.pageYOffset,
			time_bucket: now.getHours(),
			tz_offset: now.getTimezoneOffset(),
			viewport_height: window.innerHeight || 0,
		},
	});
};
