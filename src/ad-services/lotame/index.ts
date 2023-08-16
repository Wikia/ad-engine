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

	insertLotamePixel(): void {
		const element = document.createElement('script');
		element.src = this.PIXEL_URL;
		document.body.appendChild(element);
	}

	async call(): Promise<void> {
		if (!this.isEnabled('icLotame')) {
			utils.logger(this.logGroup, 'pixel disabled');
			return;
		}
		this.insertLotamePixel();

		const lotameTagInput = {
			data: {},
			config: {
				clientId: Number(this.CLIENT_ID),
			},
		};

		const lotameConfig = lotameTagInput.config || {};
		const namespace: LotameNamespace = (window['lotame_' + this.CLIENT_ID] = {});
		namespace.config = lotameConfig;
		namespace.data = lotameTagInput.data || {};
		namespace.cmd = namespace.cmd || [];
	}
}
