import { communicationService, eventsRepository } from '@ad-engine/communication';
import { InstantConfigInterpreter } from './instant-config.interpreter';
import { instantConfigLoader } from './instant-config.loader';
import { InstantConfigValue } from './instant-config.models';
import { InstantConfigOverrider } from './instant-config.overrider';
import { Dictionary } from '../../models';
import { utils } from '../../index';

const logGroup = 'instant-config-service';

export interface InstantConfigServiceInterface {
	get<T extends InstantConfigValue>(key: string, defaultValue?: T): T;
}

export class InstantConfigService implements InstantConfigServiceInterface {
	private static instancePromise: Promise<InstantConfigService>;

	static async init(globals: Dictionary = {}): Promise<InstantConfigService> {
		if (!InstantConfigService.instancePromise) {
			InstantConfigService.instancePromise = instantConfigLoader
				.getConfig()
				.then((config) => new InstantConfigOverrider().override(config))
				.then((config) => new InstantConfigInterpreter().init(config, globals))
				.then((interpreter) => new InstantConfigService(interpreter));
		}

		return InstantConfigService.instancePromise;
	}

	private repository: Dictionary<InstantConfigValue>;

	private constructor(private interpreter: InstantConfigInterpreter) {
		this.repository = this.interpreter.getValues();
		utils.logger(logGroup, 'instantiated with', this.repository);

		communicationService.on(
			eventsRepository.AD_ENGINE_INSTANT_CONFIG_CACHE_RESET,
			() => {
				this.repository = this.interpreter.getValues();
			},
			false,
		);
	}

	get<T extends InstantConfigValue>(key: string, defaultValue?: T): T {
		if (key in this.repository && this.repository[key] !== undefined) {
			return this.repository[key] as any;
		}

		return defaultValue;
	}
}
