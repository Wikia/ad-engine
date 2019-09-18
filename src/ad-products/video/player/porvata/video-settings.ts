import { context, Dictionary, Targeting, utils } from '@ad-engine/core';
import { VpaidMode } from './porvata';

export interface VideoParams extends Dictionary {
	autoPlay?: boolean;
	container?: HTMLElement;
	height?: number;
	loadVideoTimeout?: number;
	slotName?: string;
	width?: number;
	vastResponse?: string;
	vastTargeting?: Targeting;
	vastUrl?: string;
	vpaidMode?: google.ima.ImaSdkSettings.VpaidMode;
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
		return utils.sampler.sample('moat_video_tracking', sampling);
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
