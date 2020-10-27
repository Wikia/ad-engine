import {
	adEngineConfigured,
	AdEngineRunnerSetup,
	BiddersStateSetup,
	bootstrapAndGetConsent,
	CurseSlotsContextSetup,
	CurseSlotsStateSetup,
	ensureGeoCookie,
	InstantConfigSetup,
	LabradorSetup,
	NoAdsDetector,
	TrackingSetup,
	UcpGamepediaA9ConfigSetup,
	UcpGamepediaPrebidConfigSetup,
	WikiContextSetup,
} from '@platforms/shared';
import {
	communicationService,
	conditional,
	context,
	parallel,
	ProcessPipeline,
	utils,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { basicContext } from './ad-context';
import { GamepediaIocSetup } from './gamepedia-ioc-setup';
import { GamepediaAdsMode } from './modes/gamepedia-ads.mode';
import { GamepediaNoAdsMode } from './modes/gamepedia-no-ads.mode';
import { GamepediaBaseContextSetup } from './setup/context/base/gamepedia-base-context.setup';
import { GamepediaTargetingSetup } from './setup/context/targeting/gamepedia-targeting.setup';
import { GamepediaDynamicSlotsSetup } from './setup/dynamic-slots/gamepedia-dynamic-slots.setup';
import { GamepediaTemplatesSetup } from './setup/templates/gamepedia-templates.setup';

@Injectable()
export class GamepediaPlatform {
	constructor(private pipeline: ProcessPipeline, private noAdsDetector: NoAdsDetector) {}

	execute(): void {
		// Config
		this.pipeline.add(
			() => context.extend(basicContext),
			() => ensureGeoCookie(),
			parallel(InstantConfigSetup, () => bootstrapAndGetConsent()),
			GamepediaIocSetup,
			WikiContextSetup,
			() => context.set('state.isMobile', !utils.client.isDesktop()),
			GamepediaBaseContextSetup,
			GamepediaTargetingSetup,
			CurseSlotsContextSetup,
			UcpGamepediaPrebidConfigSetup,
			UcpGamepediaA9ConfigSetup,
			GamepediaDynamicSlotsSetup,
			CurseSlotsStateSetup,
			BiddersStateSetup,
			GamepediaTemplatesSetup,
			LabradorSetup,
			TrackingSetup,
			AdEngineRunnerSetup,
			() => communicationService.dispatch(adEngineConfigured()),
		);

		// Run
		this.pipeline.add(
			conditional(() => this.noAdsDetector.isAdsMode(), {
				yes: GamepediaAdsMode,
				no: GamepediaNoAdsMode,
			}),
		);

		this.pipeline.execute();
	}
}
