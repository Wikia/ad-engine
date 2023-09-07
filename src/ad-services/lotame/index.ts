import { communicationService, eventsRepository } from '@ad-engine/communication';
import { BaseServiceSetup, utils } from '@ad-engine/core';

interface LotameNamespace {
	config?: { clientId?: number };
	data?: object;
	cmd?: object[];
}

export class Lotame extends BaseServiceSetup {
	private CLIENT_ID = 17364;
	private logGroup = 'Lotame';
	private PIXEL_URL = `https://tags.crwdcntrl.net/lt/c/${this.CLIENT_ID}/lt.min.js`;

	async call(): Promise<void> {
		if (!this.isEnabled('icLotame')) {
			utils.logger(this.logGroup, 'pixel disabled');
			return;
		}

		const siteTags = { ...window.fandomContext?.site?.tags, bundles: [] };
		const taxonomyTags = Object.values(siteTags)
			.map((tag, i) => tag.map((value) => Object.keys(siteTags)[i] + ': ' + value))
			.flat();

		const lotameTagInput = {
			data: {
				behaviors: {
					med: taxonomyTags,
				},
			},
			config: {
				clientId: this.CLIENT_ID,
				onTagReady: () => communicationService.emit(eventsRepository.LOTAME_READY),
			},
		};

		const lotameConfig = lotameTagInput.config || {};
		const namespace: LotameNamespace = (window['lotame_' + this.CLIENT_ID] = {});
		namespace.config = lotameConfig;
		namespace.data = lotameTagInput.data || {};
		namespace.cmd = namespace.cmd || [];

		utils.logger(this.logGroup, 'pixel enabled');
		await utils.scriptLoader.loadScript(this.PIXEL_URL);
		communicationService.emit(eventsRepository.LOTAME_LOADED);
	}
}
