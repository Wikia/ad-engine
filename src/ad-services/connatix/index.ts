import { context, utils } from '@ad-engine/core';

const logGroup = 'connatix';

class Connatix {
	get dataPlayerId(): string {
		return context.get('services.connatix.dataPlayerId');
	}

	get playerWidth(): string {
		return context.get('services.connatix.width');
	}

	get playerHeight(): string {
		return context.get('services.connatix.height');
	}

	get playerLayout(): string {
		return context.get('services.connatix.layout');
	}

	isEnabled(): boolean {
		return context.get('services.connatix.enabled') && !!this.dataPlayerId;
	}

	call(): Promise<void> {
		if (!this.isEnabled()) {
			utils.logger(logGroup, 'Connatix player is disabled');

			return Promise.resolve();
		}

		this.loadPlayerAsset();
		this.insertPlayerContainer();
	}

	private loadPlayerAsset() {
		const libraryUrl = '//scriptURL';

		utils.logger(logGroup, 'loading Connatix asset', libraryUrl);

		return utils.scriptLoader.loadScript(libraryUrl).then(() => {
			utils.logger(logGroup, 'Connatix player is ready');
		});
	}

	private insertPlayerContainer() {
		utils.logger(logGroup, 'inserting Connatix player to the page');

		const connatixPlayerTag = document.createElement('amp-connatix-player');
		connatixPlayerTag.setAttribute('data-player-id', this.dataPlayerId);
		connatixPlayerTag.setAttribute('layout', this.playerLayout);
		connatixPlayerTag.setAttribute('width', this.playerWidth);
		connatixPlayerTag.setAttribute('height', this.playerHeight);

		const incontentPlayerContainer = document.getElementById('incontent_player');
		incontentPlayerContainer.appendChild(connatixPlayerTag);
		incontentPlayerContainer.classList.remove('hide');
	}
}

export const connatix = new Connatix();
