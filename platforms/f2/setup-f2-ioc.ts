import {
	AdsMode,
	BaseContextSetup,
	NoAdsMode,
	SlotsContextSetup,
	UcpNoAdsMode,
} from '@platforms/shared';
import { context, InstantConfigCacheStorage, InstantConfigService } from '@wikia/ad-engine';
import { Container } from '@wikia/dependency-injection';
import { set } from 'lodash';
import * as fallbackInstantConfig from './fallback-config.json';
import { F2AdsMode } from './modes/f2-ads.mode';
import { F2_ENV, F2Environment } from './setup-f2';
import { F2SlotsContextSetup } from './setup/context/slots/f2-slots-context.setup';
import { F2BaseContextSetup } from './setup/f2-base-context.setup';
import { getF2StateBinder } from './utils/f2-state-binder';

export async function setupF2Ioc(f2Env: F2Environment): Promise<Container> {
	const container = new Container();

	set(window, context.get('services.instantConfig.fallbackConfigKey'), fallbackInstantConfig);
	container.bind(InstantConfigService).value(await InstantConfigService.init());
	container.bind(InstantConfigCacheStorage).value(InstantConfigCacheStorage.make());
	container.bind(BaseContextSetup).to(F2BaseContextSetup);
	container.bind(SlotsContextSetup).to(F2SlotsContextSetup);
	container.bind(AdsMode).to(F2AdsMode);
	container.bind(NoAdsMode).to(UcpNoAdsMode);
	container.bind(F2_ENV).value(f2Env);
	container.bind(getF2StateBinder());

	return container;
}
