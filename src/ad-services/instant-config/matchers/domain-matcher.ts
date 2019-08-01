import { InstantConfigGroup } from '../instant-config.models';

export class DomainMatcher {
	isProperDomain(domains: InstantConfigGroup['domains'] = []): boolean {
		if (domains.length === 0) {
			return true;
		}

		return domains.some((domain) => window.location.hostname.includes(domain));
	}
}
