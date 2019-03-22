import { Dictionary } from '../models';
import { ADX } from '../providers';
import { queryString } from '../utils';

export interface VideoAdInfo {
	lineItemId: string;
	creativeId: string;
	contentType: string;
}

export interface EventExtra {
	imaAd?: google.ima.Ad;
}

export interface VastParams {
	contentType: string;
	creativeId: string;
	customParams: Dictionary<string>;
	lineItemId: string;
	position: string;
	size: string;
}

class VastParser {
	/**
	 * @private
	 */
	getLastNumber(possibleValues: string[]): string {
		let value = '';

		possibleValues.forEach((curVal) => {
			if (!isNaN(parseInt(curVal, 10))) {
				value = curVal;
			}
		});

		return value;
	}

	getAdInfo(imaAd?: google.ima.Ad): VideoAdInfo {
		const adInfo: VideoAdInfo = {
			lineItemId: imaAd.getAdId(),
			creativeId: imaAd.getCreativeId(),
			contentType: imaAd.getContentType(),
		};

		const wrapperAdIds = imaAd.getWrapperAdIds() || [];

		if (wrapperAdIds && wrapperAdIds.length) {
			adInfo.lineItemId = this.getLastNumber(wrapperAdIds);
		}

		const wrapperCreativeIds = imaAd.getWrapperCreativeIds() || [];

		if (wrapperCreativeIds && wrapperCreativeIds.length) {
			adInfo.creativeId = this.getLastNumber(wrapperCreativeIds);
		}

		const wrapperAdSystems = imaAd.getWrapperAdSystems() || [];

		if (wrapperAdSystems && wrapperAdSystems.indexOf('AdSense/AdX') !== -1) {
			adInfo.lineItemId = ADX;
			adInfo.creativeId = ADX;
		}

		return adInfo;
	}

	parse(vastUrl: string, extra: EventExtra = {}): VastParams {
		let contentType: string;
		let creativeId: string;
		let lineItemId: string;
		const vastParams = queryString.getValues(vastUrl.substr(1 + vastUrl.indexOf('?')));
		const customParams = queryString.getValues(encodeURI(vastParams.cust_params));

		if (extra.imaAd) {
			const currentAd = this.getAdInfo(extra.imaAd);

			contentType = currentAd.contentType;
			creativeId = currentAd.creativeId;
			lineItemId = currentAd.lineItemId;
		}

		return {
			contentType,
			creativeId,
			customParams,
			lineItemId,
			position: vastParams.vpos,
			size: vastParams.sz,
		};
	}
}

export const vastParser = new VastParser();
