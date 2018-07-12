import { context } from './context-service';
import { queryString } from '../utils/query-string';

const isOptInByQueryParam = queryString.get('tracking-opt-in-status') === 'true';

function isOptedIn() {
	if (typeof context.get('options.trackingOptIn') === 'boolean') {
		return context.get('options.trackingOptIn');
	}

	return isOptInByQueryParam || typeof window.__cmp !== 'function';
}

function readConsent() {
	if (typeof window.__cmp === 'function') {
		window.__cmp('getVendorConsents', null, (consents) => {
			// we assume user opts in when he consents for at least one vendor
			const optIn = Object.keys(consents.vendorConsents).filter(key => !!consents.vendorConsents[key]).length > 0;

			context.set('options.trackingOptIn', isOptInByQueryParam || optIn);
		});
	}
}

readConsent();

export const trackingOptIn = {
	isOptedIn,
	readConsent
};
