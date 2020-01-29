import { VideoSettings } from '../video-settings';

export interface PorvataPlugin {
	isEnabled(videoSettings: VideoSettings): boolean;
	/**
	 * load method is executed before "ADS_MANAGER_LOADED" IMA event,
	 * and only if method isEnabled returns true
	 */
	load(): Promise<any>;
	/**
	 * init method is executed after "ADS_MANAGER_LOADED" IMA event,
	 * once player has set adsManager property
	 */
	init(adsManager: google.ima.AdsManager, videoSettings: VideoSettings): Promise<void>;
}
