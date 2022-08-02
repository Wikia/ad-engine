import {
	BaseServiceSetup,
	jwpSetup,
	communicationService,
	JWPlayerManager,
} from '@wikia/ad-engine';

class PlayerSetup extends BaseServiceSetup {
	async execute(): Promise<void> {
		new JWPlayerManager().manage();

		if (this.options) {
			Promise.race([
				new Promise((res) => setTimeout(res, this.options.timeout)),
				Promise.all(this.options.dependencies),
			]).then(() => {
				this.initialize();
			});
		} else {
			this.initialize();
		}
	}

	initialize() {
		communicationService.dispatch(jwpSetup({ showAds: true, autoplayDisabled: false }));
		this.res();
	}
}

export const playerSetup = new PlayerSetup();
