import {
	AdsMode,
	BiddersConfigSetup,
	BiddersStateSetup,
	CommonBiddersStateSetup,
	CommonContextSetup,
	CommonStateSetup,
	ContextSetup,
	CurseDynamicSlotsSetup,
	CurseSlotsContextSetup,
	CurseSlotsStateSetup,
	CurseUapSetup,
	DelayModulesSetup,
	DynamicSlotsSetup,
	SlotsContextSetup,
	SlotsStateSetup,
	SportsAdsMode,
	StateSetup,
	TargetingSetup,
	TemplatesSetup,
	UapSetup,
} from '@platforms/shared';
import { SportsDelayModulesSetup } from '@platforms/shared-sports';
import { context, InstantConfigService } from '@wikia/ad-engine';
import { Container } from '@wikia/dependency-injection';
import { set } from 'lodash';
import { SportsTemplatesSetup } from '../../shared/setup/templates/sports-templates.setup';
import * as fallbackInstantConfig from '../fallback-config.json';
import { MutheadBiddersConfigSetup } from './context/bidders/muthead-bidders-config.setup';
import { MutheadTargetingSetup } from './targeting/muthead-targeting.setup';

export async function setupIoc(): Promise<Container> {
	const container = new Container();

	set(window, context.get('services.instantConfig.fallbackConfigKey'), fallbackInstantConfig);
	container.bind(InstantConfigService as any).value(await InstantConfigService.init());
	container.bind(TargetingSetup).to(MutheadTargetingSetup);
	container.bind(BiddersConfigSetup).to(MutheadBiddersConfigSetup);
	container.bind(TemplatesSetup).to(SportsTemplatesSetup);
	container.bind(DelayModulesSetup).to(SportsDelayModulesSetup);
	container.bind(AdsMode).to(SportsAdsMode);
	container.bind(ContextSetup).to(CommonContextSetup);
	container.bind(SlotsContextSetup).to(CurseSlotsContextSetup);
	container.bind(StateSetup).to(CommonStateSetup);
	container.bind(BiddersStateSetup).to(CommonBiddersStateSetup);
	container.bind(SlotsStateSetup).to(CurseSlotsStateSetup);
	container.bind(UapSetup).to(CurseUapSetup);
	container.bind(DynamicSlotsSetup).to(CurseDynamicSlotsSetup);

	return container;
}
