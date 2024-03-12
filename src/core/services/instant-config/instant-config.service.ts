import { communicationService, eventsRepository } from '@ad-engine/communication';
import {
	BrowserMatcher,
	DeviceMatcher,
	DomainMatcher,
	InstantConfigInterpreter,
	InstantConfigLoader,
	InstantConfigLoaderParams,
	InstantConfigOverrider,
	InstantConfigValue,
	RegionMatcher,
} from '@wikia/instant-config-loader';
import { InstantConfigCacheStorage } from '../../index';
import { Dictionary } from '../../models';
import { client, geoService, logger, queryString } from '../../utils';

const logGroup = 'instant-config-service';

export interface InstantConfigServiceInterface {
	get<T extends InstantConfigValue>(key: string, defaultValue?: T): T;
}

export class InstantConfigService implements InstantConfigServiceInterface {
	private interpreter: InstantConfigInterpreter;
	private repository: Dictionary<InstantConfigValue>;

	constructor(private readonly params: InstantConfigLoaderParams) {}

	async init(globals: Dictionary = {}): Promise<InstantConfigService> {
		const instantConfigLoader = new InstantConfigLoader(this.params);
		const instantConfigInterpreter = new InstantConfigInterpreter(
			new BrowserMatcher(client.getBrowser()),
			new DeviceMatcher(client.getDeviceType() as unknown as string),
			new DomainMatcher(),
			new RegionMatcher(),
			InstantConfigCacheStorage.make(),
		);

		this.interpreter = await instantConfigLoader
			.getConfig()
			.then((config) =>
				new InstantConfigOverrider().override(queryString.getURLSearchParams(), config),
			)
			.then((config) => instantConfigInterpreter.init(config, globals, geoService.isProperGeo));
		this.repository = this.interpreter.getValues();

		logger(logGroup, 'instantiated with', this.repository);

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
		try {
			return key in this.repository && this.repository[key] !== undefined
				? (this.repository[key] as T)
				: defaultValue;
		} catch (e) {
			return defaultValue;
		}
	}
}
