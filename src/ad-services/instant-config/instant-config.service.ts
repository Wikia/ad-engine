import { Dictionary, utils } from '@ad-engine/core';
import { instantConfigLoader } from './instant-config.loader';
import { InstantConfigResult } from './instant-config.models';

export class InstantConfigService {
	static instancePromise: Promise<InstantConfigService>;

	static async init(instantGlobals: Dictionary = {}): Promise<InstantConfigService> {
		if (!InstantConfigService.instancePromise) {
			InstantConfigService.instancePromise = instantConfigLoader
				.getConfig()
				.then((config) => new InstantConfigService(instantGlobals, config));
		}

		return InstantConfigService.instancePromise;
	}

	private constructor(private instantGlobals: Dictionary, private config: InstantConfigResult) {}

	get<T>(key: string, defaultValue: T = null): T {
		if (this.config && key in this.config) {
			return this.config[key] as any;
		}

		if (this.instantGlobals && key in this.instantGlobals) {
			return this.instantGlobals[key];
		}

		return defaultValue;
	}

	/**
	 * Use only for legacy wgAdDriver keys
	 * @deprecated
	 */
	isGeoEnabled(key: string): boolean {
		if (!key.startsWith('wgAdDriver')) {
			throw new Error('This method should be only used for legacy wgAdDriver keys');
		}

		return utils.geoService.isProperGeo(this.get(key), key);
	}
}
