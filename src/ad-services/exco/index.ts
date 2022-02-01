import { context, utils } from '@ad-engine/core';

const logGroup = 'exCo';

class ExCo {
	private readonly id: string;

	constructor() {
		this.id = 'f6c04939-d96e-4bc6-850e-d0e6e6cf9701';
	}

	getId(): string {
		return this.id;
	}

	isEnabled(): boolean {
		return context.get('services.exCo.enabled');
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
		const libraryUrl = `//stream.playbuzz.com/embed/sdk.js?embedId=${this.getId()}`;

		utils.logger(logGroup, 'loading ExCo asset', libraryUrl);

		return utils.scriptLoader.loadScript(libraryUrl, 'text/javascript', true).then(() => {
			utils.logger(logGroup, 'ExCo player is ready');
		});
	}

	private insertPlayerContainer() {
		utils.logger(logGroup, 'inserting ExCo player to the page');

		const exCoPlayerDiv = document.createElement('div');
		exCoPlayerDiv.id = this.getId();

		const incontentPlayerContainer = document.getElementById('incontent_player');
		incontentPlayerContainer.appendChild(exCoPlayerDiv);
		incontentPlayerContainer.classList.remove('hide');
	}
}

export const exCo = new ExCo();
