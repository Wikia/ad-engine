import {
	AdEngineRunnerSetup,
	AdsMode,
	CommonAdEngineRunnerSetup,
	CommonContextSetup,
	CommonStateSetup,
	ContextSetup,
	SlotsContextSetup,
	StateSetup,
	TargetingSetup,
	WikiContextSetup,
} from '@platforms/shared';
import { context, InstantConfigService } from '@wikia/ad-engine';
import { Container } from '@wikia/dependency-injection';
import { set } from 'lodash';

import * as fallbackInstantConfig from './fallback-config.json';

import { UcpAdsMode } from './modes/ucp-ads.mode';
import { UcpSlotsContextSetup } from './setup/context/slots/ucp-slots-context-setup';
import { UcpTargetingSetup } from './setup/context/targeting/ucp-targeting.setup';
import { UcpWikiContextSetup } from './setup/context/wiki/ucp-wiki-context.setup';

export async function setupUcpIoc(): Promise<Container> {
	const container = new Container();

	set(window, context.get('services.instantConfig.fallbackConfigKey'), fallbackInstantConfig);
	container.bind(InstantConfigService as any).value(await InstantConfigService.init());
	container.bind(WikiContextSetup).to(UcpWikiContextSetup);
	container.bind(TargetingSetup).to(UcpTargetingSetup);
	container.bind(AdEngineRunnerSetup).to(CommonAdEngineRunnerSetup);
	container.bind(AdsMode).to(UcpAdsMode);
	container.bind(ContextSetup).to(CommonContextSetup);
	container.bind(SlotsContextSetup).to(UcpSlotsContextSetup);
	container.bind(StateSetup).to(CommonStateSetup);

	return container;
}
