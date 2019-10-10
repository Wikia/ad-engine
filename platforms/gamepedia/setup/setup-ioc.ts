import {
	BiddersConfigSetup,
	BiddersStateSetup,
	CommonBiddersStateSetup,
	CommonContextSetup,
	CommonStateSetup,
	ContextSetup,
	CurseSlotsContextSetup,
	CurseSlotsStateSetup,
	DelayModulesSetup,
	LabradorTracker,
	PlatformAdsMode,
	PlatformNoAdsMode,
	SlotsContextSetup,
	SlotsStateSetup,
	StateSetup,
	TargetingSetup,
	TemplateSetup,
	WikiContextSetup,
} from '@platforms/shared';
import { context, InstantConfigService } from '@wikia/ad-engine';
import { Container } from '@wikia/dependency-injection';
import { set } from 'lodash';
import { GamepediaBiddersConfigSetup } from '../bidders/bidders-config-setup';
import * as fallbackInstantConfig from '../fallback-config.json';
import { GamepediaTemplateSetup } from '../templates/templates-setup';
import { GamepediaLabradorTracker } from '../tracking/labrador-tracker';
import { GamepediaAdsMode } from './ads-mode';
import { GamepediaDelayModulesSetup } from './delay-modules-setup';
import { GamepediaNoAdsMode } from './no-ads-mode';
import { GamepediaTargetingSetup } from './targeting-setup';
import { GamepediaWikiContextSetup } from './wiki-context-setup';

export async function setupIoc(): Promise<Container> {
	const container = new Container();

	set(window, context.get('services.instantConfig.fallbackConfigKey'), fallbackInstantConfig);
	container.bind(InstantConfigService as any).value(await InstantConfigService.init());
	container.bind(WikiContextSetup).to(GamepediaWikiContextSetup);
	container.bind(TargetingSetup).to(GamepediaTargetingSetup);
	container.bind(BiddersConfigSetup).to(GamepediaBiddersConfigSetup);
	container.bind(TemplateSetup).to(GamepediaTemplateSetup);
	container.bind(DelayModulesSetup).to(GamepediaDelayModulesSetup);
	container.bind(PlatformNoAdsMode).to(GamepediaNoAdsMode);
	container.bind(PlatformAdsMode).to(GamepediaAdsMode);
	container.bind(LabradorTracker).to(GamepediaLabradorTracker);
	container.bind(ContextSetup).to(CommonContextSetup);
	container.bind(SlotsContextSetup).to(CurseSlotsContextSetup);
	container.bind(StateSetup).to(CommonStateSetup);
	container.bind(BiddersStateSetup).to(CommonBiddersStateSetup);
	container.bind(SlotsStateSetup).to(CurseSlotsStateSetup);

	return container;
}
