import {
	adEngineConfigured,
	AdEngineRunnerSetup,
	BaseContextSetup,
	bootstrapAndGetConsent,
	CommonBiddersStateSetup,
	CurseSlotsContextSetup,
	CurseSlotsStateSetup,
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
import { basicContext } from '../ucp/ad-context';
import { FutheadIocSetup } from './futhead-ioc-setup';
import { FutheadPrebidConfigSetup } from './setup/context/prebid/futhead-prebid-config.setup';
import { FutheadTargetingSetup } from './setup/context/targeting/futhead-targeting.setup';
import { FutheadDynamicSlotsSetup } from './setup/dynamic-slots/futhead-dynamic-slots.setup';
import { FutheadTemplatesSetup } from './templates/futhead-templates.setup';

export class FutheadPlatform {
	constructor(private pipeline: ProcessPipeline, private noAdsDetector: NoAdsDetector) {}

	execute(): void {
		// Config
		this.pipeline.add(
			() => context.extend(basicContext),
			parallel(InstantConfigSetup, () => ensureGeoCookie().then(() => bootstrapAndGetConsent())),
			FutheadIocSetup,
			WikiContextSetup,
			() => context.set('state.isMobile', getDeviceMode() === 'mobile'),
			BaseContextSetup,
			CurseSlotsContextSetup,
			FutheadTargetingSetup,
			FutheadPrebidConfigSetup,
			SportsA9ConfigSetup,
			FutheadDynamicSlotsSetup,
			CurseSlotsStateSetup,
			CommonBiddersStateSetup,
			FutheadTemplatesSetup,
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
