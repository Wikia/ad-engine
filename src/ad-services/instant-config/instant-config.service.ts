import { Dictionary, utils } from '@ad-engine/core';
import { InstantConfigInterpreter } from './instant-config.interpreter';
import { instantConfigLoader } from './instant-config.loader';
import { InstantConfigValue } from './instant-config.models';
import { InstantConfigOverrider } from './instant-config.overrider';

const logGroup = 'instant-config-service';

export class InstantConfigService {
	private static instancePromise: Promise<InstantConfigService>;

	static async init(globals: Dictionary = {}): Promise<InstantConfigService> {
		if (!InstantConfigService.instancePromise) {
			InstantConfigService.instancePromise = instantConfigLoader
				.getConfig()
				.then((config) => new InstantConfigOverrider().override(config))
				.then((config) => new InstantConfigInterpreter().getValues(config, globals))
				.then((values) => new InstantConfigService(values));
		}

		return InstantConfigService.instancePromise;
	}

	private constructor(private repository: Dictionary<InstantConfigValue> = {}) {
		utils.logger(logGroup, 'instantiated with', this.repository);
	}

	get<T extends InstantConfigValue>(key: string, defaultValue: T = undefined): T {
		if (key in this.repository && this.repository[key] !== undefined) {
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
