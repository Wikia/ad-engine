import { queryString } from '../utils';

class VastParser {
	/**
	 * @private
	 */
	getLastNumber(possibleValues) {
		let i;
		let value = '';

		for (i = 0; i < possibleValues.length; i += 1) {
			if (!isNaN(possibleValues[i])) {
				value = possibleValues[i];
			}
		}

		return value;
	}

	getAdInfo(imaAd) {
		const adInfo = {};

		if (imaAd) {
			adInfo.lineItemId = imaAd.getAdId();
			adInfo.creativeId = imaAd.getCreativeId();
			adInfo.contentType = imaAd.getContentType();

			const wrapperAdIds = imaAd.getWrapperAdIds() || [];

			if (wrapperAdIds && wrapperAdIds.length) {
				adInfo.lineItemId = this.getLastNumber(wrapperAdIds);
			}

			const wrapperCreativeIds = imaAd.getWrapperCreativeIds() || [];

			if (wrapperCreativeIds && wrapperCreativeIds.length) {
				adInfo.creativeId = this.getLastNumber(wrapperCreativeIds);
			}
		}

		return adInfo;
	}

	parse(vastUrl, extra = {}) {
		const currentAd = this.getAdInfo(extra.imaAd);
		const vastParams = queryString.getValues(vastUrl.substr(1 + vastUrl.indexOf('?')));
		const customParams = queryString.getValues(encodeURI(vastParams.cust_params));

		return {
			contentType: currentAd.contentType || extra.contentType,
			creativeId: currentAd.creativeId || extra.creativeId,
			customParams,
			lineItemId: currentAd.lineItemId || extra.lineItemId,
			position: vastParams.vpos,
			size: vastParams.sz,
		};
	}
}

export const vastParser = new VastParser();
