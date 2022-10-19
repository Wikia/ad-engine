import {
	AdSlot,
	communicationService,
	ServiceStage,
	Service,
	utils,
	userIdentity,
	jwPlayer,
	iasPublisherOptimization,
} from '@wikia/ad-engine';
import { playerSetup } from './player.setup';

@Service({
	stage: ServiceStage.preProvider,
	dependencies: [
		userIdentity,
		playerSetup,
		jwPlayer.isRequiredToRun() ? jwPlayer.initialized : Promise.resolve(),
		iasPublisherOptimization.isEnabled() ? iasPublisherOptimization.IASReady : Promise.resolve(),
	],
})
class GptSetup {
	call() {
		utils.logger('GPT Setup', 'Called');
		const GPT_LIBRARY_URL = '//www.googletagservices.com/tag/js/gpt.js';

		utils.logger('gpt-provider', 'loading GPT...');
		utils.scriptLoader.loadScript(GPT_LIBRARY_URL);

		communicationService.onSlotEvent(AdSlot.SLOT_RENDERED_EVENT, ({ slot }) => {
			slot.removeClass('default-height');
		});
	}
}

export const gptSetup = new GptSetup();
