interface IdentityEngineContext {
	getConsents(): Promise<{
		optOutSale: boolean;
		tracking: boolean;
	}>;
	getCoppaStatus(): Promise<boolean>;
	registerId(id: string, provider: string): Promise<void>;
	isReady: Promise<void>;
}
