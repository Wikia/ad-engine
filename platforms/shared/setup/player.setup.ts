import {
	BaseServiceSetup,
	jwpSetup,
	communicationService,
	JWPlayerManager,
	context,
} from '@wikia/ad-engine';

class PlayerSetup extends BaseServiceSetup {
	async execute(): Promise<void> {
		if (!context.get('custom.hasFeaturedVideo')) {
			return;
		}

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

export const playerSetup = new PlayerSetup();
