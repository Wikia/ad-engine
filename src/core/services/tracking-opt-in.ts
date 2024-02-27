import { queryString } from '../utils/query-string';
import { context } from './context-service';

const isOptInByQueryParam = queryString.get('tracking-opt-in-status') === 'true';
const isOptOutSaleByQueryParam = queryString.get('opt-out-sale-status') === 'true';

function isOptedIn(optIn?: boolean): boolean {
	return isOptInByQueryParam || !!(optIn ?? context.get('options.trackingOptIn'));
}

function isOptOutSale(optOutSale?: boolean): boolean {
	const isSubjectToCcpa = !!context.get('options.isSubjectToCcpa');

	if (isSubjectToCcpa) {
		return true;
	}

	return isOptOutSaleByQueryParam || !!(optOutSale ?? context.get('options.optOutSale'));
}

function getConsentData() {
	const type = context.get('options.geoRequiresConsent') ? 'gdpr' : 'ccpa';

	let consentString = '';
	window.__tcfapi('getTCData', 2, (data) => {
		consentString = data.tcString;
	});

	return {
		type,
		consentString,
	};
}

export const trackingOptIn = {
	isOptedIn,
	isOptOutSale,
	getConsentData,
};
