import { VastParams, vastParser } from './vast-parser';

export interface VastAttributes {
	'data-vast-content-type': string;
	'data-vast-creative-id': string;
	'data-vast-line-item-id': string;
	'data-vast-position': string;
	'data-vast-size': string;
	'data-vast-status': string;
	'data-vast-params': string;
}

class VastDebugger {
	getVastAttributesFromVastParams(status: string, vastParams: VastParams): VastAttributes {
		const customParams = vastParams.customParams;
		const targeting = {};

		Object.keys(customParams).forEach((key) => {
			let value: string | string[] = customParams[key];

			if (typeof value === 'string') {
				const values = value.split(',');

				if (values.length > 1) {
					value = values;
				}
			}

			targeting[key] = value;
		});

		return {
			'data-vast-content-type': vastParams.contentType,
			'data-vast-creative-id': vastParams.creativeId,
			'data-vast-line-item-id': vastParams.lineItemId,
			'data-vast-position': vastParams.position,
			'data-vast-size': vastParams.size,
			'data-vast-status': status,
			'data-vast-params': JSON.stringify(targeting),
		};
	}

	getVastAttributes(vastUrl: string, status: string, imaAd?: google.ima.Ad): VastAttributes {
		const vastParams: VastParams = vastParser.parse(vastUrl, { imaAd });

		return this.getVastAttributesFromVastParams(status, vastParams);
	}
}

export const vastDebugger = new VastDebugger();
