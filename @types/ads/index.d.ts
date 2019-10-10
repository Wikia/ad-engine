interface Ads {
	runtime: Runtime;
}

interface Runtime {
	disableBtf?: boolean;
	disableSecondCall?: boolean;
	unblockHighlyViewableSlots?: boolean;
	bab?: any;
}

type ManualAdType = 'collapse' | 'force_collapsed' | 'forced_success' | 'manual';
