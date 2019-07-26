import { Dictionary, utils } from '@ad-engine/core';
import { InstantConfigInterpreter } from './instant-config.interpreter';
import { instantConfigLoader } from './instant-config.loader';
import { InstantConfigValue } from './instant-config.models';

export class InstantConfigService {
	static instancePromise: Promise<InstantConfigService>;

	static async init(globals: Dictionary = {}): Promise<InstantConfigService> {
		if (!InstantConfigService.instancePromise) {
			InstantConfigService.instancePromise = instantConfigLoader
				.getConfig()
				.then((config) => new InstantConfigInterpreter().getValues(config, globals))
				.then((values) => new InstantConfigService(values));
		}

		return InstantConfigService.instancePromise;
	}

	private constructor(private repository: Dictionary<InstantConfigValue> = {}) {}

	get<T extends InstantConfigValue>(key: string, defaultValue: T = null): T {
		if (key in this.repository) {
			return this.repository[key] as any;
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
