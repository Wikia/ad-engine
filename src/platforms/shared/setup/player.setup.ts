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

		if (showAds) {
			utils.logger(logGroup, 'with ads');

			if (!strategyRulesEnabled) new JWPlayerManager().manage();
		} else {
			utils.logger(logGroup, 'ad block detected, without ads');
		}

		if (strategyRulesEnabled) {
			const vastUrl = utils.buildVastUrl(16 / 9, 'featured', {
				videoAdUnitId:
					'/5441/wka1b.VIDEO/featured/desktop/ucp_desktop-fandom-fv-article/_project43-life',
				correlator: Math.round(Math.random() * 10000000000),
				vpos: 'preroll',
				customParams: 'src=test&pos=featured&rv=1',
			});

			communicationService.dispatch(
				jwpSetup({ showAds: showAds, autoplayDisabled: false, vastUrl, strategyRulesEnabled }),
			);
		} else {
			communicationService.dispatch(jwpSetup({ showAds: showAds, autoplayDisabled: false }));
		}
	}
}
