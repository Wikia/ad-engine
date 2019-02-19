import { context } from '../../../services';
import { sampler } from '../../../utils';

function getMoatTrackingStatus(params) {
	const sampling = context.get('options.video.moatTracking.sampling');

	if (typeof params.moatTracking === 'boolean') {
		return params.moatTracking;
	}

	if (!context.get('options.video.moatTracking.enabled')) {
		return false;
	}

	if (sampling === 100) {
		return true;
	}

	if (sampling > 0) {
		return sampler.sample('moat_video_tracking', sampling);
	}

	return false;
}

export class VideoSettings {
	constructor(params = {}) {
		this.params = params;
		this.moatTracking = getMoatTrackingStatus(params);
	}

	get(key) {
		return this.params[key];
	}

	getContainer() {
		return this.get('container');
	}

	getParams() {
		return this.params;
	}

	getVpaidMode() {
		if (typeof this.params.vpaidMode !== 'undefined') {
			return this.params.vpaidMode;
		}

		return window.google.ima.ImaSdkSettings.VpaidMode.ENABLED;
	}

	isMoatTrackingEnabled() {
		return this.moatTracking;
	}

	isAutoPlay() {
		return this.params.autoPlay;
	}
}
