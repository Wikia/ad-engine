import { Dictionary } from '../../../models';
import { context } from '../../../services';
import { sampler } from '../../../utils';
import { VpaidMode } from '../porvata';

export interface VideoParams extends Dictionary {
	vpaidMode?: google.ima.ImaSdkSettings.VpaidMode;
	autoPlay?: boolean;
	loadVideoTimeout?: number;
}

function getMoatTrackingStatus(params: VideoParams): boolean {
	const sampling: number = context.get('options.video.moatTracking.sampling');

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

	getContainer(): HTMLElement | undefined {
		return this.get('container');
	}

	getParams(): VideoParams {
		return this.params;
	}

	getVpaidMode(): google.ima.ImaSdkSettings.VpaidMode {
		if (!!this.params.vpaidMode) {
			return this.params.vpaidMode;
		}

		return VpaidMode.ENABLED;
	}

	isMoatTrackingEnabled(): boolean {
		return this.moatTracking;
	}

	isAutoPlay(): boolean | undefined {
		return this.params.autoPlay;
	}
}
