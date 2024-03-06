import {
	context,
	InstantConfigCacheStorage,
	TargetingData,
	targetingService,
	utils,
} from '@ad-engine/core';
import { CmpType } from '../../ad-services';
import { CompilerPartial } from '../base-tracker';

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

function getCmp(): CmpType {
	return window.OneTrust !== undefined ? CmpType.ONE_TRUST : CmpType.TRACKING_OPT_IN;
}

export const slotTrackingCompiler = ({ data, slot }: CompilerPartial): CompilerPartial => {
	const cacheStorage = InstantConfigCacheStorage.make();
	const now = new Date();
	const timestamp: number = now.getTime();
	const isUap = slot.getTargetingProperty('uap') && slot.getTargetingProperty('uap') !== 'none';

	const targetingData: TargetingData = targetingService.dump<TargetingData>();
	const experimentGroups: string[] = targetingData?.experiment_groups || [];

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
			kv_lang: targetingData.lang || '',
			kv_s0v: targetingData.s0v || '',
			kv_s1: targetingData.s1 || '',
			kv_s2: targetingData.s2 || '',
			kv_skin: targetingData.skin || '',
			labrador: [...cacheStorage.getSamplingResults(), ...experimentGroups].join(';'),
			opt_in: checkOptIn(),
			opt_out_sale: checkOptOutSale(),
			page_width:
				(window.document.body.scrollWidth && window.document.body.scrollWidth.toString()) || '',
			ppid: targetingData.ppid,
			pa_available: targetingService.get('pa_available'),
			pv: context.get('wiki.pvNumber') || window.pvNumber || '',
			pv_unique_id: context.get('wiki.pvUID') || window.pvUID || '',
			scroll_y: window.scrollY || window.pageYOffset,
			topics_available: targetingService.get('topics_available'),
			tz_offset: now.getTimezoneOffset(),
			viewport_height: window.innerHeight || 0,
			rollout_tracking: getCmp(), // TODO: Remove once OneTrust replaces Tracking Opt In
		},
	};
};
