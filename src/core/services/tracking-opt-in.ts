import { context } from './context-service';

function isGdprConsentRequired(): boolean {
	return !!context.get('options.geoRequiresConsent');
}

function isOptedIn(optIn?: boolean): boolean {
	return !!(optIn ?? context.get('options.trackingOptIn'));
}

function isOptOutSale(optOutSale?: boolean): boolean {
	const isSubjectToCcpa = !!context.get('options.isSubjectToCcpa');

	if (isSubjectToCcpa) {
		return true;
	}

	return !!(optOutSale ?? context.get('options.optOutSale'));
}

export const trackingOptIn = {
	isGdprConsentRequired,
	isOptedIn,
	isOptOutSale,
};
