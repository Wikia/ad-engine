// @ts-strict-ignore
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
import { utils } from '../../index';
import { Dictionary } from '../../models';

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
			new BrowserMatcher(utils.client.getBrowser()),
			new DeviceMatcher(utils.client.getDeviceType() as unknown as string),
			new DomainMatcher(),
			new RegionMatcher(),
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

	getActiveLabradorKeyValues(): string[] {
		return this.interpreter.getActiveLabradorKeyValues();
	}
}
