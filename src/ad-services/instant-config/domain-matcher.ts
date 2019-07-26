export class DomainMatcher {
	isProperDomain(domains: string[] = []): boolean {
		if (domains.length === 0) {
			return true;
		}

		return domains.some((domain) => window.location.hostname.includes(domain));
	}
}
