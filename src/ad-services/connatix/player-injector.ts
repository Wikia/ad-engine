import { context, utils } from '@ad-engine/core';
import { logGroup } from './index';
import { ConnatixPlayerInterface } from './connatix-player';

export interface PlayerInjectorInterface {
	insertPlayerContainer(cid: string): void;
}

// TODO test this thing! >=D
export class PlayerInjector implements PlayerInjectorInterface {
	get playerId(): string {
		return context.get('services.connatix.playerId');
	}

	get renderId(): string {
		return context.get('services.connatix.renderId');
	}

	constructor(private connatixPlayer: ConnatixPlayerInterface) {}

	insertPlayerContainer(cid: string) {
		utils.logger(logGroup, 'inserting Connatix player to the page');

		const connatixPlayer = this.createPlayerTags(cid);

		const incontentPlayerContainer = document.getElementById('incontent_player');
		incontentPlayerContainer.appendChild(connatixPlayer);
		incontentPlayerContainer.classList.remove('hide');
	}

	private createPlayerTags(cid: string): HTMLElement {
		const connatixPlayerTag = document.createElement('script');
		connatixPlayerTag.setAttribute('id', this.renderId);

		const connatixImageTag = document.createElement('img');
		connatixImageTag.setAttribute(
			'src',
			`https://capi.connatix.com/tr/si?token=${this.playerId}&cid=${cid}`,
		);

		connatixImageTag.innerHTML = this.connatixPlayer.get(this.playerId, this.renderId);
		connatixPlayerTag.appendChild(connatixImageTag);

		return connatixPlayerTag;
	}
}
