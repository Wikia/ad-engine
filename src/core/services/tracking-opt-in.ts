import { context } from './context-service';

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
	isOptedIn,
	isOptOutSale,
};
