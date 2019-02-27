import { context, slotService, trackingOptIn } from '../services';

const availableVideoPositions = ['preroll', 'midroll', 'postroll'];
const baseUrl = 'https://pubads.g.doubleclick.net/gampad/ads?';
const correlator = Math.round(Math.random() * 10000000000);

function getCustomParameters(slot, extraTargeting = {}) {
	const params = { ...context.get('targeting'), ...slot.getTargeting(), ...extraTargeting };

	return encodeURIComponent(
		Object.keys(params)
			.filter((key) => params[key])
			.map((key) => `${key}=${params[key]}`)
			.join('&'),
	);
}

function getVideoSizes(slot) {
	const sizes = slot.getVideoSizes();

	if (sizes) {
		return sizes.map((size) => size.join('x')).join('|');
	}

	return '640x480';
}

export function buildVastUrl(aspectRatio, slotName, options = {}) {
	const params = [
		'output=vast',
		'env=vp',
		'gdfp_req=1',
		'impl=s',
		'unviewed_position_start=1',
		`url=${encodeURIComponent(window.location.href)}`,
		`description_url=${encodeURIComponent(window.location.href)}`,
		`correlator=${correlator}`,
	];
	const slot = slotService.get(slotName);

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

	params.push(`npa=${trackingOptIn.isOptedIn() ? 0 : 1}`);

	return baseUrl + params.join('&');
}
