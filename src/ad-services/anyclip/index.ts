import { context, utils } from '@ad-engine/core';

const logGroup = 'Anyclip';

class Anyclip {
	get params(): Record<string, string> {
		return {
			pubname: context.get('services.anyclip.pubname'),
			widgetname: context.get('services.anyclip.widgetname'),
		};
	}

	isEnabled(): boolean {
		return context.get('services.anyclip.enabled');
	}

	call(): Promise<void> {
		if (!this.isEnabled()) {
			utils.logger(logGroup, 'Anyclip player is disabled');

			return Promise.resolve();
		}

		this.loadPlayerAsset();
	}

	private loadPlayerAsset() {
		const libraryUrl = 'https://player.anyclip.com/anyclip-widget/lre-widget/prod/v1/src/lre.js';
		const incontentPlayerContainer = document.getElementById('incontent_player');

		utils.logger(logGroup, 'loading Anyclip asset', libraryUrl);

		return utils.scriptLoader
			.loadScript({ src: libraryUrl, node: incontentPlayerContainer, parameters: this.params})
			.then(() => {
				incontentPlayerContainer.classList.remove('hide');
				utils.logger(logGroup, 'ready');
			});
	}
}

export const anyclip = new Anyclip();
