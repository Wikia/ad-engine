import { communicationService, eventsRepository } from '@ad-engine/communication';
import {
	BrowserMatcher,
	DeviceMatcher,
	InstantConfigInterpreter,
	InstantConfigLoader,
	InstantConfigOverrider,
	InstantConfigValue,
} from '@wikia/instant-config-loader';
import { context, utils } from '../../index';
import { Dictionary } from '../../models';

const logGroup = 'instant-config-service';

export interface InstantConfigServiceInterface {
	get<T extends InstantConfigValue>(key: string, defaultValue?: T): T;
}

export class InstantConfigService implements InstantConfigServiceInterface {
	private interpreter: InstantConfigInterpreter;
	private repository: Dictionary<InstantConfigValue>;

	async init(globals: Dictionary = {}): Promise<InstantConfigService> {
		const instantConfigLoader = new InstantConfigLoader({
			appName: context.get('services.instantConfig.appName'),
			instantConfigEndpoint: context.get('services.instantConfig.endpoint'),
			instantConfigVariant: context.get('wiki.services_instantConfig_variant'),
			instantConfigFallbackEndpoint: context.get('services.instantConfig.fallback'),
		});
		const instantConfigInterpreter = new InstantConfigInterpreter(
			new BrowserMatcher(utils.client.getBrowser()),
			new DeviceMatcher(utils.client.getDeviceType() as unknown as string),
		);

		this.interpreter = await instantConfigLoader
			.getConfig()
			.then((config) =>
				new InstantConfigOverrider().override(utils.queryString.getURLSearchParams(), config),
			)
			.then((config) =>
				instantConfigInterpreter.init(config, globals, utils.geoService.isProperGeo),
			);
		this.repository = this.interpreter.getValues();

		utils.logger(logGroup, 'instantiated with', this.repository);

		communicationService.on(
			eventsRepository.AD_ENGINE_INSTANT_CONFIG_CACHE_RESET,
			() => {
				this.repository = this.interpreter.getValues();
			},
			false,
		);

		return this;
	}

	get<T extends InstantConfigValue>(key: string, defaultValue?: T): T {
		if (key in this.repository && this.repository[key] !== undefined) {
			return this.repository[key] as any;
		}

		return defaultValue;
	}
}
