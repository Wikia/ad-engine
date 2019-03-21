import { queryString } from '../utils/query-string';
import { context } from './context-service';

const isOptInByQueryParam = queryString.get('tracking-opt-in-status') === 'true';

function isOptedIn(): boolean {
	return isOptInByQueryParam || !!context.get('options.trackingOptIn');
}

export const trackingOptIn = {
	isOptedIn,
};
