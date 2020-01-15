interface Ads {
	consentQueue: any;
	pushToConsentQueue: (callback: any) => void;
	runtime: Runtime;
}

interface Runtime {
	disableBtf?: boolean;
	disableSecondCall?: boolean;
	unblockHighlyViewableSlots?: boolean;
	bab?: any;
}

type ManualAdType = 'collapse' | 'forced_collapse' | 'forced_success' | 'manual';
