export abstract class DelayModule {
	isEnabled: () => boolean;
	getName: () => string;
	getPromise: () => Promise<void>;
}
