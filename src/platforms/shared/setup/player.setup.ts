import {
	BaseServiceSetup,
	communicationService,
	context,
	JWPlayerManager,
	jwpSetup,
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
		const src = context.get('src');
		const videoAdUnitId = utils.stringBuilder.build(context.get('slots.featured.videoAdUnit'), {
			slotConfig: {
				group: 'VIDEO',
				adProduct: 'featured',
				slotNameSuffix: '',
			},
		});

		return utils.buildVastUrl(aspectRatio, slotName, {
			videoAdUnitId,
			correlator: Math.round(Math.random() * 10000000000),
			vpos: 'preroll',
			customParams: `src=${src}&pos=${slotName}&rv=1`,
		});
	}
}
