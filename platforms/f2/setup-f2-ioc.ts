import { BaseContextSetup } from '@platforms/shared';
import { context, InstantConfigService } from '@wikia/ad-engine';
import { Container } from '@wikia/dependency-injection';
import { set } from 'lodash';
import * as fallbackInstantConfig from './fallback-config.json';
import { F2_CONFIG, F2Config } from './setup-f2';
import { F2BaseContextSetup } from './setup/f2-base-context.setup';

export async function setupF2Ioc(f2Config: F2Config): Promise<Container> {
	const container = new Container();

	set(window, context.get('services.instantConfig.fallbackConfigKey'), fallbackInstantConfig);
	container.bind(InstantConfigService).value(await InstantConfigService.init());
	container.bind(BaseContextSetup).to(F2BaseContextSetup);
	container.bind(F2_CONFIG).value(f2Config);

	return container;
}
