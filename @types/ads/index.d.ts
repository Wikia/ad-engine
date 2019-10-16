interface Ads {
	runtime: Runtime;
}

interface Runtime {
	disableBtf?: boolean;
	disableSecondCall?: boolean;
	unblockHighlyViewableSlots?: boolean;
	bab?: any;
}

type ManualAdType = 'collapse' | 'forced_collapse' | 'forced_success' | 'manual';
