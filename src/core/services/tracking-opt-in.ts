import { queryString } from '../utils/query-string';
import { context } from './context-service';

const isOptInByQueryParam = queryString.get('tracking-opt-in-status') === 'true';
const isOptOutSaleByQueryParam = queryString.get('opt-out-sale-status') === 'true';

function isOptedIn(): boolean {
	return isOptInByQueryParam || !!context.get('options.trackingOptIn');
}

function isOptOutSale(): boolean {
	const isSubjectToCcpa = !!context.get('options.isSubjectToCcpa');

	if (isSubjectToCcpa) {
		return true;
	}

	return isOptOutSaleByQueryParam || !!context.get('options.optOutSale');
}

export const trackingOptIn = {
	isOptedIn,
	isOptOutSale,
};
