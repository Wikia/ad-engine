import {
	A9ConfigSetup,
	AdEngineRunnerSetup,
	AdsMode,
	BiddersStateSetup,
	CommonAdEngineRunnerSetup,
	CommonBiddersStateSetup,
	CommonContextSetup,
	CommonStateSetup,
	CommonTrackingSetup,
	ContextSetup,
	CurseSlotsContextSetup,
	CurseSlotsStateSetup,
	CurseUapSetup,
	DelayModulesSetup,
	DynamicSlotsSetup,
	NoAdsMode,
	PrebidConfigSetup,
	SlotsContextSetup,
	SlotsStateSetup,
	StateSetup,
	TargetingSetup,
	TemplatesSetup,
	TrackingSetup,
	UapRestrictor,
	UapSetup,
	WikiContextSetup,
} from '@platforms/shared';
import { context, InstantConfigService } from '@wikia/ad-engine';
import { Container } from '@wikia/dependency-injection';
import { set } from 'lodash';
import * as fallbackInstantConfig from './fallback-config.json';
import { GamepediaAdsMode } from './modes/gamepedia-ads.mode';
import { GamepediaNoAdsMode } from './modes/gamepedia-no-ads.mode';
import { GamepediaDelayModulesSetup } from './setup/ad-engine-runner/delay-modules/delay-modules.setup';
import { GamepediaA9ConfigSetup } from './setup/context/a9/gamepedia-a9-config.setup';
import { GamepediaPrebidConfigSetup } from './setup/context/prebid/gamepedia-prebid-config.setup';
import { GamepediaTargetingSetup } from './setup/context/targeting/gamepedia-targeting.setup';
import { GamepediaWikiContextSetup } from './setup/context/wiki/gamepedia-wiki-context.setup';
import { GamepediaDynamicSlotsSetup } from './setup/dynamic-slots/gamepedia-dynamic-slots.setup';
import { GamepediaUapRestrictor } from './setup/dynamic-slots/uap/uap-restrictor/gamepedia-uap-restrictor';
import { GamepediaTemplatesSetup } from './setup/templates/gamepedia-templates.setup';

export async function setupGamepediaIoc(): Promise<Container> {
	const container = new Container();

	set(window, context.get('services.instantConfig.fallbackConfigKey'), fallbackInstantConfig);
	container.bind(InstantConfigService as any).value(await InstantConfigService.init());
	container.bind(WikiContextSetup).to(GamepediaWikiContextSetup);
	container.bind(TargetingSetup).to(GamepediaTargetingSetup);
	container.bind(TemplatesSetup).to(GamepediaTemplatesSetup);
	container.bind(DelayModulesSetup).to(GamepediaDelayModulesSetup);
	container.bind(AdEngineRunnerSetup).to(CommonAdEngineRunnerSetup);
	container.bind(NoAdsMode).to(GamepediaNoAdsMode);
	container.bind(AdsMode).to(GamepediaAdsMode);
	container.bind(ContextSetup).to(CommonContextSetup);
	container.bind(SlotsContextSetup).to(CurseSlotsContextSetup);
	container.bind(StateSetup).to(CommonStateSetup);
	container.bind(BiddersStateSetup).to(CommonBiddersStateSetup);
	container.bind(SlotsStateSetup).to(CurseSlotsStateSetup);
	container.bind(UapSetup).to(CurseUapSetup);
	container.bind(DynamicSlotsSetup).to(GamepediaDynamicSlotsSetup);
	container.bind(TrackingSetup).to(CommonTrackingSetup);
	container.bind(PrebidConfigSetup).to(GamepediaPrebidConfigSetup);
	container.bind(A9ConfigSetup).to(GamepediaA9ConfigSetup);
	container.bind(UapRestrictor).to(GamepediaUapRestrictor);

	return container;
}
