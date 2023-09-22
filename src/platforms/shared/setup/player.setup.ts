import {
	AdSlot,
	BaseServiceSetup,
	communicationService,
	context,
	JWPlayerManager,
	jwpSetup,
	slotService,
	utils,
} from '@wikia/ad-engine';

const logGroup = 'player-setup';

export class PlayerSetup extends BaseServiceSetup {
	call() {
		const showAds = !context.get('options.wad.blocking');
		const strategyRulesEnabled = context.get('options.video.enableStrategyRules');

		if (showAds && !strategyRulesEnabled) {
			utils.logger(logGroup, 'JWP with ads controlled by AdEngine enabled');

			new JWPlayerManager().manage();
			communicationService.dispatch(jwpSetup({ showAds: showAds, autoplayDisabled: false }));
		} else if (strategyRulesEnabled) {
			utils.logger(
				logGroup,
				'JWP Strategy Rules enabled - AdEngine does not control ads in JWP anymore',
			);

			communicationService.dispatch(
				jwpSetup({
					showAds: showAds,
					autoplayDisabled: false,
					vastUrl: this.generateVastUrlForJWPlayer(),
					strategyRulesEnabled,
				}),
			);
		} else {
			utils.logger(logGroup, 'ad block detected, without ads');
			communicationService.dispatch(jwpSetup({ showAds: false, autoplayDisabled: false }));
		}
	}

	private generateVastUrlForJWPlayer() {
		const aspectRatio = 16 / 9;
		const slotName = 'featured';
		const position = 'preroll';

		const adSlot = slotService.get(slotName) || new AdSlot({ id: slotName });
		if (!slotService.get(slotName)) {
			slotService.add(adSlot);
		}

		return utils.buildVastUrl(aspectRatio, adSlot.getSlotName(), { vpos: position });
	}
}
