import {
	AdEngineRunnerSetup,
	AdsMode,
	BaseContextSetup,
	CommonTrackingSetup,
	DynamicSlotsSetup,
	NoAdsMode,
	SlotsContextSetup,
	SlotsStateSetup,
	TargetingSetup,
	TrackingSetup,
	WikiContextSetup,
} from '@platforms/shared';
import { context, InstantConfigService } from '@wikia/ad-engine';
import { Container } from '@wikia/dependency-injection';
import { set } from 'lodash';
import { HydraAdEngineRunnerSetup } from './ad-engine-runner/hydra-ad-engine-runner-setup';
import * as fallbackInstantConfig from './fallback-config.json';
import { HydraAdsMode } from './modes/hydra-ads-mode';
import { HydraNoAdsMode } from './modes/hydra-no-ads-mode';
import { HydraSlotsContextSetup } from './setup/context/slots/hydra-slots-context-setup';
import { HydraTargetingSetup } from './setup/context/targeting/hydra-targeting-setup';
import { HydraWikiContextSetup } from './setup/context/wiki/hydra-wiki-context-setup';
import { HydraDynamicSlotsSetup } from './setup/dynamic-slots/hydra-dynamic-slots-setup';
import { HydraBaseContextSetup } from './setup/hydra-base-context-setup';
import { HydraSlotsStateSetup } from './setup/state/slots/hydra-slots-state-setup';

export async function setupHydraIoc(): Promise<Container> {
	const container = new Container();

	set(window, context.get('services.instantConfig.fallbackConfigKey'), fallbackInstantConfig);
	container.bind(InstantConfigService as any).value(await InstantConfigService.init());
	container.bind(BaseContextSetup).to(HydraBaseContextSetup);
	container.bind(WikiContextSetup).to(HydraWikiContextSetup);
	container.bind(TargetingSetup).to(HydraTargetingSetup);
	container.bind(AdEngineRunnerSetup).to(HydraAdEngineRunnerSetup);
	container.bind(AdsMode).to(HydraAdsMode);
	container.bind(NoAdsMode).to(HydraNoAdsMode);
	container.bind(SlotsStateSetup).to(HydraSlotsStateSetup);
	container.bind(SlotsContextSetup).to(HydraSlotsContextSetup);
	container.bind(DynamicSlotsSetup).to(HydraDynamicSlotsSetup);
	container.bind(TrackingSetup).to(CommonTrackingSetup);

	return container;
}
