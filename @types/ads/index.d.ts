interface Ads {
	runtime: Runtime;
}

interface Runtime {
	disableBtf?: boolean;
	disableSecondCall?: boolean;
	unblockHighlyViewableSlots?: boolean;
}
