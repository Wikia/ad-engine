export interface DelayModule {
	isEnabled: () => boolean;
	getName: () => string;
	getPromise: () => Promise<void>;
}
