import { AdSlot, context, utils } from '@ad-engine/core';
import { ConnatixPlayerApi, ConnatixPlayerInterface } from './connatix-player';
import { logGroup } from './index';

export interface PlayerInjectorInterface {
	insertPlayerContainer(cid: string, renderCallback: (error, player) => void): void;
}

export class PlayerInjector implements PlayerInjectorInterface {
	get playerId(): string {
		const queryParams = new URLSearchParams(window.location.search);
		const overriddenPlayerId = queryParams.get('cnxPlayerId');

		return overriddenPlayerId ?? context.get('services.connatix.playerId');
	}

	get renderId(): string {
		return context.get('services.connatix.renderId');
	}

	constructor(private connatixPlayer: ConnatixPlayerInterface) {}

	insertPlayerContainer(cid: string, renderCallback: (error, player: ConnatixPlayerApi) => void) {
		utils.logger(logGroup, 'inserting Connatix player to the page');

		const connatixPlayer = this.createPlayerTags(cid, renderCallback);

		const incontentPlayerContainer = document.getElementById('incontent_player');
		incontentPlayerContainer.appendChild(connatixPlayer);
		incontentPlayerContainer.classList.remove(AdSlot.HIDDEN_AD_CLASS);
	}

	private createPlayerTags(
		cid: string,
		renderCallback: (error, player: ConnatixPlayerApi) => void,
	): HTMLElement {
		const connatixPlayerTag = document.createElement('script');
		connatixPlayerTag.setAttribute('id', this.renderId);

		const connatixImageTag = document.createElement('img');
		connatixImageTag.setAttribute(
			'src',
			`https://capi.connatix.com/tr/si?token=${this.playerId}&cid=${cid}`,
		);

		connatixImageTag.innerHTML = this.connatixPlayer.get(
			this.playerId,
			this.renderId,
			renderCallback,
		);
		connatixPlayerTag.appendChild(connatixImageTag);

		return connatixPlayerTag;
	}
}
