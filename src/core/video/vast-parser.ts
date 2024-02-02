import { Dictionary } from '../models';
import { ADX } from '../providers';

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
	customParams: Dictionary<string | string[]>;
	lineItemId: string;
	position: string;
	size: string;
}

function getUrlValues(input?: string) {
	const path: string = input || window.location.search.substring(1);
	const queryStringParameters: string[] = path.split('&');
	const queryParameters: Dictionary<string> = {};

	queryStringParameters.forEach((pair) => {
		const [id, value] = pair.split('=');

		if (value) {
			queryParameters[id] = decodeURIComponent(value.replace(/\+/g, ' '));
		}
	});

	return queryParameters;
}

class VastParser {
	/**
	 * @private
	 */
	getLastNumber(possibleValues: string[]): string {
		let value = '';

		possibleValues.forEach((curVal: string) => {
			if (!isNaN(parseInt(curVal, 10))) {
				value = curVal;
			}
		});

		return value;
	}

	getAdInfo(imaAd?: google.ima.Ad): VideoAdInfo {
		const adInfo: VideoAdInfo = {
			lineItemId: undefined,
			creativeId: undefined,
			contentType: undefined,
		};

		if (!imaAd) {
			return adInfo;
		}

		adInfo.lineItemId = imaAd.getAdId();
		adInfo.creativeId = imaAd.getCreativeId();
		adInfo.contentType = imaAd.getContentType();

		const wrapperAdIds: string[] = imaAd.getWrapperAdIds() || [];

		if (wrapperAdIds && wrapperAdIds.length) {
			adInfo.lineItemId = this.getLastNumber(wrapperAdIds);
		}

		const wrapperCreativeIds: string[] = imaAd.getWrapperCreativeIds() || [];

		if (wrapperCreativeIds && wrapperCreativeIds.length) {
			adInfo.creativeId = this.getLastNumber(wrapperCreativeIds);
		}

		const wrapperAdSystems: string[] = imaAd.getWrapperAdSystems() || [];

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
		// TODO: consider using queryString.getURLSearchParams instead of getValues
		const vastParams: Dictionary<string> = getUrlValues(
			vastUrl ? vastUrl.substr(1 + vastUrl.indexOf('?')) : '?',
		);
		const customParams: Dictionary<string> = getUrlValues(encodeURI(vastParams.cust_params));

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
