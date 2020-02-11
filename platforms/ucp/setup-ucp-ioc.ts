import {
	AdEngineRunnerSetup,
	AdsMode,
	CommonTrackingSetup,
	DynamicSlotsSetup,
	SlotsContextSetup,
	SlotsStateSetup,
	TargetingSetup,
	TrackingSetup,
	WikiContextSetup,
} from '@platforms/shared';
import {
	babDetection,
	bidders,
	context,
	InhibitorsRegistry,
	InstantConfigService,
} from '@wikia/ad-engine';
import { Container } from '@wikia/dependency-injection';
import { set } from 'lodash';
import { UcpAdEngineRunnerSetup } from './ad-engine-runner/ucp-ad-engine-runner.setup';
import * as fallbackInstantConfig from './fallback-config.json';
import { UcpAdsMode } from './modes/ucp-ads.mode';
import { UcpSlotsContextSetup } from './setup/context/slots/ucp-slots-context.setup';
import { UcpTargetingSetup } from './setup/context/targeting/ucp-targeting.setup';
import { UcpWikiContextSetup } from './setup/context/wiki/ucp-wiki-context.setup';
import { UcpDynamicSlotsSetup } from './setup/dynamic-slots/ucp-dynamic-slots.setup';
import { UcpSlotsStateSetup } from './setup/state/slots/ucp-slots-state-setup';

export async function setupUcpIoc(): Promise<Container> {
	const container = new Container();

	set(window, context.get('services.instantConfig.fallbackConfigKey'), fallbackInstantConfig);
	container.bind(InstantConfigService as any).value(await InstantConfigService.init());
	container.bind(InhibitorsRegistry).value(new InhibitorsRegistry([babDetection, bidders]));

	container.bind(WikiContextSetup).to(UcpWikiContextSetup);
	container.bind(TargetingSetup).to(UcpTargetingSetup);
	container.bind(AdEngineRunnerSetup).to(UcpAdEngineRunnerSetup);
	container.bind(AdsMode).to(UcpAdsMode);
	container.bind(SlotsStateSetup).to(UcpSlotsStateSetup);
	container.bind(SlotsContextSetup).to(UcpSlotsContextSetup);
	container.bind(DynamicSlotsSetup).to(UcpDynamicSlotsSetup);
	container.bind(TrackingSetup).to(CommonTrackingSetup);

	return container;
}
