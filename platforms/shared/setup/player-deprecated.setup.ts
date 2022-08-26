import {
	BaseServiceSetup,
	jwpSetup,
	communicationService,
	JWPlayerManager,
} from '@wikia/ad-engine';

class PlayerDeprecatedSetup extends BaseServiceSetup {
	async execute(): Promise<void> {
		new JWPlayerManager().manage();

		if (this.options) {
			Promise.race([
				new Promise((res) => setTimeout(res, this.options.timeout)),
				Promise.all(this.options.dependencies),
			]).then(async () => {
				await this.call();
				this.setInitialized();
			});
		} else {
			await this.call();
			this.setInitialized();
		}
	}

	call() {
		communicationService.dispatch(jwpSetup({ showAds: true, autoplayDisabled: false }));
	}
}

export const playerDeprecatedSetup = new PlayerDeprecatedSetup();
