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
import { MinervaAdEngineRunnerSetup } from './ad-engine-runner/minerva-ad-engine-runner-setup.service';
import * as fallbackInstantConfig from './fallback-config.json';
import { MinervaAdsMode } from './modes/minerva-ads-mode.service';
import { MinervaNoAdsMode } from './modes/minerva-no-ads-mode.service';
import { MinervaSlotsContextSetup } from './setup/context/slots/minerva-slots-context-setup.service';
import { MinervaTargetingSetup } from './setup/context/targeting/minerva-targeting-setup.service';
import { MinervaWikiContextSetup } from './setup/context/wiki/minerva-wiki-context-setup.service';
import { MinervaDynamicSlotsSetup } from './setup/dynamic-slots/minerva-dynamic-slots-setup.service';
import { MinervaBaseContextSetup } from './setup/minerva-base-context-setup.service';
import { MinervaSlotsStateSetup } from './setup/state/slots/minerva-slots-state-setup.service';

export async function setupMinervaIoc(): Promise<Container> {
	const container = new Container();

	set(window, context.get('services.instantConfig.fallbackConfigKey'), fallbackInstantConfig);
	container.bind(InstantConfigService as any).value(await InstantConfigService.init());
	container.bind(BaseContextSetup).to(MinervaBaseContextSetup);
	container.bind(WikiContextSetup).to(MinervaWikiContextSetup);
	container.bind(TargetingSetup).to(MinervaTargetingSetup);
	container.bind(AdEngineRunnerSetup).to(MinervaAdEngineRunnerSetup);
	container.bind(AdsMode).to(MinervaAdsMode);
	container.bind(NoAdsMode).to(MinervaNoAdsMode);
	container.bind(SlotsStateSetup).to(MinervaSlotsStateSetup);
	container.bind(SlotsContextSetup).to(MinervaSlotsContextSetup);
	container.bind(DynamicSlotsSetup).to(MinervaDynamicSlotsSetup);
	container.bind(TrackingSetup).to(CommonTrackingSetup);

	return container;
}
