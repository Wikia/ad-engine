import { queryString } from '../utils/query-string';

const isOptInByQueryParam = queryString.get('tracking-opt-in-status') === 'true';

function isOptedIn() {
	if (isOptInByQueryParam || typeof window.__cmp !== 'function') {
		return true;
	}

	let cmpOptIn = false;
	window.__cmp('getVendorConsents', null, (consents) => {
		cmpOptIn = consents.vendorConsents.filter(consent => !!consent).length > 0;
	});

	return isOptInByQueryParam || cmpOptIn;
}

export const trackingOptIn = {
	isOptedIn
};
