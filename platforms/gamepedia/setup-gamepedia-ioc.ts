import {
	A9ConfigSetup,
	AdEngineRunnerSetup,
	AdsMode,
	BiddersStateSetup,
	CommonBiddersStateSetup,
	CommonTrackingSetup,
	CurseSlotsContextSetup,
	CurseSlotsStateSetup,
	DynamicSlotsSetup,
	NoAdsMode,
	PrebidConfigSetup,
	SlotsContextSetup,
	SlotsStateSetup,
	TargetingSetup,
	TemplatesSetup,
	TrackingSetup,
} from '@platforms/shared';
import { context, InstantConfigService } from '@wikia/ad-engine';
import { Container } from '@wikia/dependency-injection';
import { set } from 'lodash';
import { GamepediaAdEngineRunnerSetup } from './ad-engine-runner/gamepedia-ad-engine-runner.setup';
import * as fallbackInstantConfig from './fallback-config.json';
import { GamepediaAdsMode } from './modes/gamepedia-ads.mode';
import { GamepediaNoAdsMode } from './modes/gamepedia-no-ads.mode';
import { GamepediaA9ConfigSetup } from './setup/context/a9/gamepedia-a9-config.setup';
import { GamepediaPrebidConfigSetup } from './setup/context/prebid/gamepedia-prebid-config.setup';
import { GamepediaTargetingSetup } from './setup/context/targeting/gamepedia-targeting.setup';
import { GamepediaDynamicSlotsSetup } from './setup/dynamic-slots/gamepedia-dynamic-slots.setup';
import { GamepediaTemplatesSetup } from './setup/templates/gamepedia-templates.setup';

export async function setupGamepediaIoc(): Promise<Container> {
	const container = new Container();

	set(window, context.get('services.instantConfig.fallbackConfigKey'), fallbackInstantConfig);
	container.bind(InstantConfigService as any).value(await InstantConfigService.init());
	container.bind(TargetingSetup).to(GamepediaTargetingSetup);
	container.bind(TemplatesSetup).to(GamepediaTemplatesSetup);
	container.bind(AdEngineRunnerSetup).to(GamepediaAdEngineRunnerSetup);
	container.bind(NoAdsMode).to(GamepediaNoAdsMode);
	container.bind(AdsMode).to(GamepediaAdsMode);
	container.bind(SlotsContextSetup).to(CurseSlotsContextSetup);
	container.bind(BiddersStateSetup).to(CommonBiddersStateSetup);
	container.bind(SlotsStateSetup).to(CurseSlotsStateSetup);
	container.bind(DynamicSlotsSetup).to(GamepediaDynamicSlotsSetup);
	container.bind(TrackingSetup).to(CommonTrackingSetup);
	container.bind(PrebidConfigSetup).to(GamepediaPrebidConfigSetup);
	container.bind(A9ConfigSetup).to(GamepediaA9ConfigSetup);

	return container;
}
