import { StorageStrategyInterface } from '../storage-strategies';

class AdmsStrategy implements StorageStrategyInterface {
	async get(): Promise<string> {
		if (window.SilverSurferSDK?.requestUserPPID) {
			return window.SilverSurferSDK?.requestUserPPID();
		}
	}
}

export const admsStorageService = new AdmsStrategy();
