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

export const trackingOptIn = {
	isOptedIn,
	isOptOutSale,
};
