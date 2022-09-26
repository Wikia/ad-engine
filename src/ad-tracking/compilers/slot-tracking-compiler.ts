import { AdSlot, context, InstantConfigCacheStorage, utils } from '@ad-engine/core';
import { AdInfoContext } from '../slot-tracker';

interface AdClickContext {
	slot: AdSlot;
	data: {
		ad_status: string;
	};
}

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

export const slotTrackingCompiler = ({ data, slot }: AdClickContext): AdInfoContext => {
	const cacheStorage = InstantConfigCacheStorage.make();
	const now = new Date();
	const timestamp: number = now.getTime();
	const isUap =
		slot.getConfigProperty('targeting.uap') && slot.getConfigProperty('targeting.uap') !== 'none';

	return {
		slot,
		data: {
			...data,
			timestamp,
			browser: `${utils.client.getOperatingSystem()} ${utils.client.getBrowser()}`,
			country: (utils.geoService.getCountryCode() || '').toUpperCase(),
			device: utils.client.getDeviceType(),
			is_uap: isUap ? 1 : 0,
			kv_ah: window.document.body.scrollHeight,
			kv_lang: context.get('targeting.lang') || '',
			kv_s0v: context.get('targeting.s0v') || '',
			kv_s2: context.get('targeting.s2') || '',
			kv_skin: context.get('targeting.skin') || '',
			labrador: cacheStorage.getSamplingResults().join(';'),
			opt_in: checkOptIn(),
			opt_out_sale: checkOptOutSale(),
			page_width:
				(window.document.body.scrollWidth && window.document.body.scrollWidth.toString()) || '',
			ppid: context.get('targeting.ppid'),
			pv: context.get('wiki.pvNumber') || window.pvNumber || '',
			pv_unique_id: context.get('wiki.pvUID') || window.pvUID || '',
			scroll_y: window.scrollY || window.pageYOffset,
			tz_offset: now.getTimezoneOffset(),
			viewport_height: window.innerHeight || 0,
		},
	};
};
