import {
	AdsMode,
	BiddersConfigSetup,
	BiddersStateSetup,
	CommonBiddersStateSetup,
	CommonContextSetup,
	CommonStateSetup,
	CommonTrackingSetup,
	ContextSetup,
	CurseDynamicSlotsSetup,
	CurseSlotsContextSetup,
	CurseSlotsStateSetup,
	CurseUapSetup,
	DelayModulesSetup,
	DynamicSlotsSetup,
	NoAdsMode,
	SlotsContextSetup,
	SlotsStateSetup,
	StateSetup,
	TargetingSetup,
	TemplatesSetup,
	TrackingSetup,
	UapSetup,
	WikiContextSetup,
} from '@platforms/shared';
import { context, InstantConfigService } from '@wikia/ad-engine';
import { Container } from '@wikia/dependency-injection';
import { set } from 'lodash';
import * as fallbackInstantConfig from '../fallback-config.json';
import { GamepediaNoAdsMode } from '../modes/gamepedia-no-ads.mode';
import { GamepediaAdsMode } from '../modes/gampedia-ads.mode';
import { GamepediaBiddersConfigSetup } from './context/bidders/gamepedia-bidders-config.setup';
import { GamepediaTargetingSetup } from './context/targeting/gamepedia-targeting.setup';
import { GamepediaWikiContextSetup } from './context/wiki/gamepedia-wiki-context.setup';
import { GamepediaDelayModulesSetup } from './delay-modules-setup';
import { GamepediaTemplatesSetup } from './templates/gamepedia-templates.setup';

export async function setupIoc(): Promise<Container> {
	const container = new Container();

	set(window, context.get('services.instantConfig.fallbackConfigKey'), fallbackInstantConfig);
	container.bind(InstantConfigService as any).value(await InstantConfigService.init());
	container.bind(WikiContextSetup).to(GamepediaWikiContextSetup);
	container.bind(TargetingSetup).to(GamepediaTargetingSetup);
	container.bind(BiddersConfigSetup).to(GamepediaBiddersConfigSetup);
	container.bind(TemplatesSetup).to(GamepediaTemplatesSetup);
	container.bind(DelayModulesSetup).to(GamepediaDelayModulesSetup);
	container.bind(NoAdsMode).to(GamepediaNoAdsMode);
	container.bind(AdsMode).to(GamepediaAdsMode);
	container.bind(ContextSetup).to(CommonContextSetup);
	container.bind(SlotsContextSetup).to(CurseSlotsContextSetup);
	container.bind(StateSetup).to(CommonStateSetup);
	container.bind(BiddersStateSetup).to(CommonBiddersStateSetup);
	container.bind(SlotsStateSetup).to(CurseSlotsStateSetup);
	container.bind(UapSetup).to(CurseUapSetup);
	container.bind(DynamicSlotsSetup).to(CurseDynamicSlotsSetup);
	container.bind(TrackingSetup).to(CommonTrackingSetup);

	return container;
}
