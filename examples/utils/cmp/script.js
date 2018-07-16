import { context, utils, trackingOptIn } from '@wikia/ad-engine';

context.set('options.trackingOptIn', null);

const isCmpDefined = typeof utils.queryString.get('cmp') !== 'undefined',
	optIn = utils.queryString.get('cmp') === '1';

if (isCmpDefined) {
	window.__cmp = function (cmd, param, cb) {
		if (cmd === 'getConsentData') {
			cb({
				consentData: optIn ? 'BOQu5jyOQu5jyCNABAPLBR-AAAAeCAFgAUABYAIAAaABFACY' : 'BOQu5naOQu5naCNABAPLBRAAAAAeCAAA',
				gdprApplies: true,
				hasGlobalScope: false
			}, true);
		} else if (cmd === 'getVendorConsents') {
			cb({
				metadata: 'BOQu5naOQu5naCNABAAABRAAAAAAAA',
				purposeConsents: Array.from({ length: 5 }).reduce((map, val, i) => {
					map[i + 1] = optIn;
					return map;
				}, {}),
				vendorConsents: Array.from({ length: 500 }).reduce((map, val, i) => {
					map[i + 1] = optIn;
					return map;
				}, {})
			}, true);
		} else {
			cb(null, false);
		}
	};
}

trackingOptIn.readConsent();

const preElement = document.getElementById('consent');

preElement.innerText = trackingOptIn.isOptedIn() ? 'yes' : 'no';
