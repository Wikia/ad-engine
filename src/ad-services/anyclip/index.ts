import { utils, VideoTracker } from '@ad-engine/core';

const logGroup = 'Anyclip';
const isSubscribeReady = () => typeof window[Anyclip.SUBSCRIBE_FUNC_NAME] !== 'undefined';

export class Anyclip {
	public static SUBSCRIBE_FUNC_NAME = 'lreSubscribe';

	constructor(
		private tracker: VideoTracker,
		private timeoutForGlobal: number = 250,
		private retriesForGlobal: number = 4,
	) {}

	get params(): Record<string, string> {
		return {
			pubname: 'fandomcom',
			widgetname: '001w000001Y8ud2_19593',
		};
	}

	loadPlayerAsset() {
		const libraryUrl = 'https://player.anyclip.com/anyclip-widget/lre-widget/prod/v1/src/lre.js';
		const incontentPlayerContainer = document.getElementById('incontent_player');

		utils.logger(logGroup, 'loading Anyclip asset', libraryUrl);

		return utils.scriptLoader
			.loadScript(libraryUrl, 'text/javascript', true, incontentPlayerContainer, this.params)
			.then(() => {
				incontentPlayerContainer.classList.remove('hide');
				utils.logger(logGroup, 'ready');

				this.waitForSubscribeReady().then((isSubscribeReady) => {
					utils.logger(
						logGroup,
						'Anyclip global subscribe function set',
						isSubscribeReady,
						window[Anyclip.SUBSCRIBE_FUNC_NAME],
					);

					isSubscribeReady
						? this.tracker.register()
						: utils.logger(logGroup, 'Anyclip global subscribe function not set');
				});
			});
	}

	private waitForSubscribeReady(): Promise<boolean> {
		return new utils.WaitFor(
			isSubscribeReady,
			this.retriesForGlobal,
			this.timeoutForGlobal,
		).until();
	}
}
