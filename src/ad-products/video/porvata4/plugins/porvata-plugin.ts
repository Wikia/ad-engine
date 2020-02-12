import { PorvataPlayer } from '../porvata-player';
import { PorvataSettings } from '../porvata-settings';

export interface PorvataPlugin {
	isEnabled(videoSettings: PorvataSettings): boolean;
	/**
	 * load method is executed before "ADS_MANAGER_LOADED" IMA event,
	 * and only if method isEnabled returns true
	 */
	load(): Promise<any>;
	/**
	 * init method is executed after "ADS_MANAGER_LOADED" IMA event,
	 * once player has set adsManager property
	 */
	init(player: PorvataPlayer, videoSettings: PorvataSettings): Promise<void>;
}
