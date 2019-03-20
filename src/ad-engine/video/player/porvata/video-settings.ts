import { context } from '../../../services';
import { sampler } from '../../../utils';

export interface VideoParams {
	vpaidMode?: google.ima.ImaSdkSettings.VpaidMode;
	autoPlay?: undefined;
	[key: string]: any;
}

function getMoatTrackingStatus(params: VideoParams): boolean {
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
	private readonly moatTracking: boolean;

	constructor(private readonly params: VideoParams = {}) {
		this.moatTracking = getMoatTrackingStatus(params);
	}

	get(key: string): any {
		return this.params[key];
	}

	getContainer(): string | HTMLElement | undefined {
		return this.get('container');
	}

	getParams(): VideoParams {
		return this.params;
	}

	getVpaidMode(): google.ima.ImaSdkSettings.VpaidMode {
		if (typeof this.params.vpaidMode !== 'undefined') {
			return this.params.vpaidMode;
		}

		return window.google.ima.ImaSdkSettings.VpaidMode.ENABLED;
	}

	isMoatTrackingEnabled(): boolean {
		return this.moatTracking;
	}

	isAutoPlay(): boolean | undefined {
		return this.params.autoPlay;
	}
}
