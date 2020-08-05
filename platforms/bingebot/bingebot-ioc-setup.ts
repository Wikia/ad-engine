import { context, DiProcess, InstantConfigService } from '@wikia/ad-engine';
import { Container, Injectable } from '@wikia/dependency-injection';
import { set } from 'lodash';
import * as fallbackInstantConfig from './fallback-config.json';
import { BingeBotTargetingSetup } from './setup/context/targeting/bingebot-targeting.setup';

@Injectable()
export class BingeBotIocSetup implements DiProcess {
	constructor(private container: Container) {}

	async execute(): Promise<void> {
		set(window, context.get('services.instantConfig.fallbackConfigKey'), fallbackInstantConfig);

		this.container.bind(InstantConfigService).value(await InstantConfigService.init());
		this.container.bind(BingeBotTargetingSetup.skin('bingebot'));
	}
}
