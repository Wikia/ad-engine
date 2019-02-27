export class Cmp {
	get exists() {
		return !!window.__cmp;
	}

	/**
	 * @param {*=} param
	 * @param {function(object)} cb Callback receiving current bids
	 */
	getConsentData(param, cb) {
		window.__cmp('getConsentData', param, (consentData) => cb(consentData));
	}

	override(newCmp) {
		window.__cmp = newCmp;
	}
}

export const cmp = new Cmp();
