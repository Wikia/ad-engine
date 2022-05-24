import { context, utils } from '@ad-engine/core';

const logGroup = 'exCo';

class ExCo {
	get id(): string {
		return context.get('services.exCo.id');
	}

	isEnabled(): boolean {
		return context.get('services.exCo.enabled') && !!this.id;
	}

	call(): Promise<void> {
		if (!this.isEnabled()) {
			utils.logger(logGroup, 'ExCo player is disabled');

			return Promise.resolve();
		}

		this.insertPlayerContainer();
		this.loadPlayerAsset();
	}

	private loadPlayerAsset() {
		const libraryUrl = `//stream.playbuzz.com/embed/sdk.js?embedId=${this.id}`;

		utils.logger(logGroup, 'loading ExCo asset', libraryUrl);

		return utils.scriptLoader.loadScript({  src: libraryUrl }).then(() => {
			utils.logger(logGroup, 'ExCo player is ready');
		});
	}

	private insertPlayerContainer() {
		utils.logger(logGroup, 'inserting ExCo player to the page');

		const exCoPlayerDiv = document.createElement('div');
		exCoPlayerDiv.id = this.id;

		const incontentPlayerContainer = document.getElementById('incontent_player');
		incontentPlayerContainer.appendChild(exCoPlayerDiv);
		incontentPlayerContainer.classList.remove('hide');
	}
}

export const exCo = new ExCo();
