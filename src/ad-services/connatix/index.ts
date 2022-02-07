import { context, utils } from '@ad-engine/core';

const logGroup = 'connatix';

class Connatix {
	get dataPlayerId(): string {
		return context.get('services.connatix.dataPlayerId');
	}

	isEnabled(): boolean {
		return context.get('services.connatix.enabled') && !!this.dataPlayerId;
	}

	call(): Promise<void> {
		if (!this.isEnabled()) {
			utils.logger(logGroup, 'Connatix player is disabled');

			return Promise.resolve();
		}

		this.insertPlayerContainer();
		this.loadPlayerAsset();
	}

	private loadPlayerAsset() {
		const libraryUrl = '//scriptURL';

		utils.logger(logGroup, 'loading Connatix asset', libraryUrl);

		return utils.scriptLoader.loadScript(libraryUrl, 'text/javascript', true).then(() => {
			utils.logger(logGroup, 'Connatix player is ready');
		});
	}

	private insertPlayerContainer() {
		utils.logger(logGroup, 'inserting Connatix player to the page');

		const connatixPlayerTag = document.createElement('amp-connatix-player');
		connatixPlayerTag.setAttribute('data-player-id', this.dataPlayerId);
		connatixPlayerTag.setAttribute('layout', 'responsive');
		connatixPlayerTag.setAttribute('width', '16');
		connatixPlayerTag.setAttribute('height', '9');

		const incontentPlayerContainer = document.getElementById('incontent_player');
		incontentPlayerContainer.appendChild(connatixPlayerTag);
		incontentPlayerContainer.classList.remove('hide');
	}
}

export const connatix = new Connatix();
