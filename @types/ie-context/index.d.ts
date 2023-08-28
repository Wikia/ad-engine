interface IdentityEngineContext {
	getConsents(): Promise<{
		optOutSale: boolean;
		tracking: boolean;
		adsAllowed: boolean;
	}>;
	getRestrictions(): Promise<{ coppa: boolean }>;
	registerId(id: string, provider: string): Promise<void>;
	isReady: Promise<void>;
}
