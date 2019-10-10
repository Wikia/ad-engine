import {
	AdEnginePreStarter,
	AdStackSetup,
	BiddersConfigSetup,
	DelayModulesSetup,
	TargetingSetup,
	TemplateSetup,
} from '@platforms/shared';
import {
	SportsAdEnginePreStarter,
	SportsAdStackSetup,
	SportsDelayModulesSetup,
	SportsTemplateSetup,
} from '@platforms/shared-sports';
import { context, InstantConfigService } from '@wikia/ad-engine';
import { Container } from '@wikia/dependency-injection';
import { set } from 'lodash';
import { FutheadBiddersConfigSetup } from '../bidders/bidders-config-setup';
import * as fallbackInstantConfig from '../fallback-config.json';
import { FutheadTargetingSetup } from './targeting-setup';

export async function setupIoc(): Promise<Container> {
	const container = new Container();

	set(window, context.get('services.instantConfig.fallbackConfigKey'), fallbackInstantConfig);
	container.bind(InstantConfigService as any).value(await InstantConfigService.init());
	container.bind(TargetingSetup).to(FutheadTargetingSetup);
	container.bind(BiddersConfigSetup).to(FutheadBiddersConfigSetup);
	container.bind(TemplateSetup).to(SportsTemplateSetup);
	container.bind(DelayModulesSetup).to(SportsDelayModulesSetup);
	container.bind(AdStackSetup).to(SportsAdStackSetup);
	container.bind(AdEnginePreStarter).to(SportsAdEnginePreStarter);

	return container;
}
