import { communicationService, eventsRepository } from '@ad-engine/communication';
import { AdSlot, Dictionary } from '../models';
import { slotService, SlotTargeting, targetingService, trackingOptIn } from '../services';
import { isCoppaSubject } from './is-coppa-subject';

export interface TaglessSlotOptions {
	correlator: number;
	targeting: SlotTargeting;
	adUnit: string;
	size: string;
}

export interface VastOptions {
	correlator: number;
	targeting: SlotTargeting;
	videoAdUnitId: string;
	contentSourceId: string;
	customParams: string;
	videoId: string;
	numberOfAds: number;
	vpos: string;
	isTagless: boolean;
}

const availableVideoPositions: string[] = ['preroll', 'midroll', 'postroll'];
const vastBaseUrl = 'https://pubads.g.doubleclick.net/gampad/ads?';

export function getCustomParameters(
	slot: AdSlot,
	extraTargeting: Dictionary = {},
	encode = true,
): string {
	const targetingData = targetingService.dump() || {};
	const targeting = {};

	function setTargetingValue(
		key: string,
		value: string | string[] | (() => string | string[]),
	): void {
		if (typeof value === 'function') {
			targeting[key] = value();
		} else if (value !== 'undefined' && value !== null) {
			targeting[key] = value;
		}
	}

	Object.keys(targetingData).forEach((key) => {
		setTargetingValue(key, targetingData[key]);
	});

	communicationService.emit(eventsRepository.AD_ENGINE_INVALIDATE_SLOT_TARGETING, { slot });

	const params: Dictionary = {
		...targeting,
		...slot.getTargeting(),
		...extraTargeting,
	};

	const paramsInString = Object.keys(params)
		.filter((key: string) => params[key])
		.map((key: string) => `${key}=${params[key]}`)
		.join('&');

	return encode ? encodeURIComponent(paramsInString) : paramsInString;
}

function getVideoSizes(slot: AdSlot): string {
	const sizes: number[][] = slot.getVideoSizes();

	if (sizes) {
		return sizes.map((size: number[]) => size.join('x')).join('|');
	}

	return '640x480';
}

function generateCorrelator(): number {
	return Math.round(Math.random() * 10000000000);
}

export function buildVastUrl(
	aspectRatio: number,
	slotName: string,
	options: Partial<VastOptions> = {},
): string {
	const params: string[] = [
		'output=xml_vast4',
		'env=vp',
		'gdfp_req=1',
		'impl=s',
		'unviewed_position_start=1',
		`url=${encodeURIComponent(window.location.href)}`,
		`description_url=${encodeURIComponent(window.location.href)}`,
		`correlator=${generateCorrelator()}`,
	];
	const slot: AdSlot = slotService.get(slotName);
	const ppid = targetingService.get('ppid');
	const over18 = targetingService.get('over18');

	if (over18) {
		params.push(`over_18=${over18}`);
	}

	if (ppid) {
		params.push(`ppid=${ppid}`);
	}

	if (isCoppaSubject()) {
		params.push('tfcd=1');
	}

	if (slot) {
		params.push(`iu=${slot.getVideoAdUnit()}`);

		params.push(`sz=${getVideoSizes(slot)}`);
		params.push(`cust_params=${getCustomParameters(slot, options.targeting)}`);
	} else if (options.videoAdUnitId && options.customParams) {
		// This condition can be removed once we have Porvata3 and AdEngine3 everywhere
		params.push(`iu=${options.videoAdUnitId}`);
		params.push(`sz=640x480`);
		params.push(`cust_params=${encodeURIComponent(options.customParams)}`);
	} else {
		throw Error('Slot does not exist!');
	}

	if (options.contentSourceId && options.videoId) {
		params.push(`cmsid=${options.contentSourceId}`);
		params.push(`vid=${options.videoId}`);
	}

	if (options.vpos && availableVideoPositions.indexOf(options.vpos) > -1) {
		params.push(`vpos=${options.vpos}`);
	}

	if (options.numberOfAds !== undefined) {
		params.push(`pmad=${options.numberOfAds}`);
	}

	params.push(`rdp=${trackingOptIn.isOptOutSale() ? 1 : 0}`);

	if (options.isTagless) {
		params.push('tagless=1');
	}

	return vastBaseUrl + params.join('&');
}
