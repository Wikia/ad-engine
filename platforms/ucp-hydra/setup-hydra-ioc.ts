import {
	A9ConfigSetup,
	AdEngineRunnerSetup,
	AdsMode,
	BaseContextSetup,
	BiddersStateSetup,
	CommonBiddersStateSetup,
	CommonTrackingSetup,
	DynamicSlotsSetup,
	NoAdsMode,
	PrebidConfigSetup,
	SlotsContextSetup,
	SlotsStateSetup,
	TargetingSetup,
	TrackingSetup,
	WikiContextSetup,
} from '@platforms/shared';
import { context, InstantConfigService } from '@wikia/ad-engine';
import { Container } from '@wikia/dependency-injection';
import { set } from 'lodash';
import { HydraAdEngineRunnerSetup } from './ad-engine-runner/hydra-ad-engine-runner-setup.service';
import * as fallbackInstantConfig from './fallback-config.json';
import { HydraAdsMode } from './modes/hydra-ads-mode.service';
import { HydraNoAdsMode } from './modes/hydra-no-ads-mode.service';
import { HydraA9ConfigSetup } from './setup/context/a9/a9';
import { HydraPrebidConfigSetup } from './setup/context/prebid/hydra-prebid-config-setup.service';
import { HydraSlotsContextSetup } from './setup/context/slots/hydra-slots-context-setup.service';
import { HydraTargetingSetup } from './setup/context/targeting/hydra-targeting-setup.service';
import { HydraWikiContextSetup } from './setup/context/wiki/hydra-wiki-context-setup.service';
import { HydraDynamicSlotsSetup } from './setup/dynamic-slots/hydra-dynamic-slots-setup.service';
import { HydraBaseContextSetup } from './setup/hydra-base-context-setup.service';
import { HydraSlotsStateSetup } from './setup/state/slots/hydra-slots-state-setup.service';

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
	container.bind(BiddersStateSetup).to(CommonBiddersStateSetup);
	container.bind(PrebidConfigSetup).to(HydraPrebidConfigSetup);
	container.bind(A9ConfigSetup).to(HydraA9ConfigSetup);

	return container;
}
