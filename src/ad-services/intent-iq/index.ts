import { BaseServiceSetup, utils } from '@ad-engine/core';

const logGroup = 'intent-iq';
const fandomId = 1187275693;
const intentIQScriptUrl = 'https://iiq-be-js-sdk.s3.amazonaws.com/GA/UniversalID/IIQUniversalID.js';

export class IntentIQ extends BaseServiceSetup {
	async call(): Promise<void> {
		if (!this.isEnabled('icIntentIQ')) {
			utils.logger(logGroup, 'disabled');
			return;
		}

		await utils.scriptLoader.loadScript(intentIQScriptUrl, 'text/javascript', true, 'first');

		utils.logger(logGroup, 'loaded');
		// @ts-expect-error no window typings at the moment
		new window.IntentIqObject({
			partner: fandomId,
			callback: (data) => {
				utils.logger(logGroup, 'got data', data);
			},
		});
	}
}
