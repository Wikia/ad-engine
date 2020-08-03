import { context, DiProcess, InstantConfigService } from '@wikia/ad-engine';
import { Container, Injectable } from '@wikia/dependency-injection';
import { set } from 'lodash';
import * as fallbackInstantConfig from './fallback-config.json';

@Injectable()
export class BingeBotIocSetup implements DiProcess {
	constructor(private container: Container) {}

	async execute(): Promise<void> {
		set(window, context.get('services.instantConfig.fallbackConfigKey'), fallbackInstantConfig);

		this.container.bind(InstantConfigService).value(await InstantConfigService.init());
	}
}
