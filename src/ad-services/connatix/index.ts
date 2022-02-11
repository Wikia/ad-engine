import { context, utils } from '@ad-engine/core';

const logGroup = 'connatix';

class Connatix {
	get cid(): string {
		return context.get('services.connatix.cid');
	}

	get playerId(): string {
		return context.get('services.connatix.playerId');
	}

	get renderId(): string {
		return context.get('services.connatix.renderId');
	}

	isEnabled(): boolean {
		return context.get('services.connatix.enabled');
	}

	async call(): Promise<void> {
		if (!this.isEnabled()) {
			utils.logger(logGroup, 'Connatix player is disabled');

			return Promise.resolve();
		}

		await this.loadPlayerAsset();
		this.insertPlayerContainer();
	}

	private async loadPlayerAsset() {
		const libraryUrl = `//cd.connatix.com/connatix.player.js?cid=${this.cid}`;

		utils.logger(logGroup, 'loading Connatix asset', libraryUrl);

		return utils.scriptLoader.loadScript(libraryUrl).then(() => {
			utils.logger(logGroup, 'Connatix player is ready');
		});
	}

	private insertPlayerContainer() {
		utils.logger(logGroup, 'inserting Connatix player to the page');

		const connatixPlayerTag = document.createElement('script');
		connatixPlayerTag.setAttribute('id', this.renderId);

		const connatixImageTag = document.createElement('img');
		connatixImageTag.setAttribute(
			'src',
			`https://capi.connatix.com/tr/si?token=${this.playerId}&cid=${this.cid}`,
		);

		connatixImageTag.innerHTML = window.cnx.cmd.push(() => {
			window.cnx({ playerId: this.playerId }).render(this.renderId);
		});

		const incontentPlayerContainer = document.getElementById('incontent_player');
		incontentPlayerContainer.appendChild(connatixPlayerTag);
		incontentPlayerContainer.classList.remove('hide');
	}
}

export const connatix = new Connatix();
