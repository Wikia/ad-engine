import {
	adEngineConfigured,
	AdEngineRunnerSetup,
	BaseContextSetup,
	BiddersStateSetup,
	bootstrapAndGetConsent,
	CurseDynamicSlotsSetup,
	CurseSlotsContextSetup,
	ensureGeoCookie,
	getDeviceMode,
	InstantConfigSetup,
	LabradorSetup,
	NoAdsDetector,
	SportsA9ConfigSetup,
	SportsAdsMode,
	TrackingSetup,
	WikiContextSetup,
} from '@platforms/shared';
import {
	communicationService,
	conditional,
	context,
	parallel,
	ProcessPipeline,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { basicContext } from './ad-context';
import { MutheadIocSetup } from './muthead-ioc-setup';
import { MutheadPrebidConfigSetup } from './setup/context/prebid/muthead-prebid-config.setup';
import { MutheadTargetingSetup } from './setup/targeting/muthead-targeting.setup';
import { MutheadTemplatesSetup } from './templates/muthead-templates.setup';

@Injectable()
export class MutheadPlatform {
	constructor(private pipeline: ProcessPipeline, private noAdsDetector: NoAdsDetector) {}

	execute(): void {
		// Config
		this.pipeline.add(
			() => context.extend(basicContext),
			() => ensureGeoCookie(),
			parallel(InstantConfigSetup, () => bootstrapAndGetConsent()),
			MutheadIocSetup,
			WikiContextSetup,
			() => context.set('state.isMobile', getDeviceMode() === 'mobile'),
			BaseContextSetup,
			CurseSlotsContextSetup,
			MutheadTargetingSetup,
			MutheadPrebidConfigSetup,
			SportsA9ConfigSetup,
			CurseDynamicSlotsSetup,
			BiddersStateSetup,
			MutheadTemplatesSetup,
			LabradorSetup,
			TrackingSetup,
			AdEngineRunnerSetup,
			() => communicationService.dispatch(adEngineConfigured()),
		);

		// Run
		this.pipeline.add(
			conditional(() => this.noAdsDetector.isAdsMode(), {
				yes: SportsAdsMode,
			}),
		);

		this.pipeline.execute();
	}
}
