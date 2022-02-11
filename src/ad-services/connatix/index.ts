import { context, utils } from '@ad-engine/core';

const logGroup = 'connatix';

class Connatix {
	get cid(): string {
		return context.get('services.connatix.dataPlayerId');
	}

	get playerId(): string {
		return context.get('services.connatix.dataPlayerId');
	}

	get renderId(): string {
		return context.get('services.connatix.dataPlayerId');
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
		connatixPlayerTag.setAttribute('id', 'da3ec3e41d7e41209e5963444de28591');
		//@ts-ignore
		connatixPlayerTag.innerHTML = (new Image()).src = `https://capi.connatix.com/tr/si?token=${this.playerId}&cid=${this.cid}`;  cnx.cmd.push(function() {    cnx({      playerId: "039a9ead-fb3b-4afc-bcfb-ed241bbaa8d1"    }).render("da3ec3e41d7e41209e5963444de28591");  })

		const incontentPlayerContainer = document.getElementById('incontent_player');
		incontentPlayerContainer.appendChild(connatixPlayerTag);
		incontentPlayerContainer.classList.remove('hide');
	}
}

export const connatix = new Connatix();
