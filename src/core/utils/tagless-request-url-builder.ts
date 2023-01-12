import { communicationService, eventsRepository } from '@ad-engine/communication';
import { AdSlot, Dictionary } from '../models';
import { config, slotService, SlotTargeting, targetingService, trackingOptIn } from '../services';
import { targeting } from './targeting';

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
}

const availableVideoPositions: string[] = ['preroll', 'midroll', 'postroll'];
const displayBaseUrl = 'https://securepubads.g.doubleclick.net/gampad/adx?';
const vastBaseUrl = 'https://pubads.g.doubleclick.net/gampad/ads?';
const correlator: number = Math.round(Math.random() * 10000000000);

function getCustomParameters(slot: AdSlot, extraTargeting: Dictionary = {}): string {
	const contextTargeting = targetingService.dump() || {};
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

	Object.keys(contextTargeting).forEach((key) => {
		setTargetingValue(key, contextTargeting[key]);
	});

	communicationService.emit(eventsRepository.AD_ENGINE_INVALIDATE_SLOT_TARGETING, { slot });

	const params: Dictionary = {
		...targeting,
		...slot.getTargeting(),
		...extraTargeting,
	};

	return encodeURIComponent(
		Object.keys(params)
			.filter((key: string) => params[key])
			.map((key: string) => `${key}=${params[key]}`)
			.join('&'),
	);
}

function getVideoSizes(slot: AdSlot): string {
	const sizes: number[][] = slot.getVideoSizes();

	if (sizes) {
		return sizes.map((size: number[]) => size.join('x')).join('|');
	}

	return '640x480';
}

export function buildVastUrl(
	aspectRatio: number,
	slotName: string,
	options: Partial<VastOptions> = {},
): string {
	const params: string[] = [
		'output=vast',
		'env=vp',
		'gdfp_req=1',
		'impl=s',
		'unviewed_position_start=1',
		`url=${encodeURIComponent(window.location.href)}`,
		`description_url=${encodeURIComponent(window.location.href)}`,
		`correlator=${correlator}`,
	];
	const slot: AdSlot = slotService.get(slotName);
	const ppid = targetingService.get('ppid');

	if (ppid) {
		params.push(`ppid=${ppid}`);
	}

	if (config.rollout.coppaFlag().gam && targeting.isWikiDirectedAtChildren()) {
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

	return vastBaseUrl + params.join('&');
}

export function buildTaglessRequestUrl(options: Partial<TaglessSlotOptions> = {}): string {
	const ppid = targetingService.get('ppid');
	const params: string[] = [`c=${correlator}`, 'tile=1', 'd_imp=1'];

	params.push(`iu=${options.adUnit}`);
	params.push(`sz=${options.size}`);

	if (ppid) {
		params.push(`ppid=${ppid}`);
	}

	if (config.rollout.coppaFlag().gam && targeting.isWikiDirectedAtChildren()) {
		params.push('tfcd=1');
	}

	if (options.targeting) {
		params.push(
			`t=${encodeURIComponent(
				Object.keys(options.targeting)
					.filter((key: string) => options.targeting[key])
					.map((key: string) => `${key}=${options.targeting[key]}`)
					.join('&'),
			)}`,
		);
	}

	params.push(`rdp=${trackingOptIn.isOptOutSale() ? 1 : 0}`);

	return displayBaseUrl + params.join('&');
}
