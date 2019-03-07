export interface DelayModule {
	isEnabled: () => boolean;
	getName: () => string;
	getPromise: () => Promise<void>;
}

export {}; // tslint no-sole-types fix
