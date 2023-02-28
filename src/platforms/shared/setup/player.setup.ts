import {
	BaseServiceSetup,
	communicationService,
	context,
	JWPlayerManager,
	jwpSetup,
	utils,
} from '@wikia/ad-engine';

const GPT_PROXY_URL = '//imasdk.googleapis.com/js/sdkloader/gpt_proxy.js';

export class PlayerSetup extends BaseServiceSetup {
	async execute(): Promise<void> {
		new JWPlayerManager().manage();

		if (context.get('options.video.uapJWPCompanions')) {
			utils.logger('player-setup', 'loading GPT proxy...');
			await utils.scriptLoader.loadScript(GPT_PROXY_URL);
		}

		if (this.options) {
			await Promise.all(this.options.dependencies);
		}

		await this.call();
		this.setInitialized();
	}

	call() {
		communicationService.dispatch(jwpSetup({ showAds: true, autoplayDisabled: false }));
	}
}
