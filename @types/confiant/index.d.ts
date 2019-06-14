interface Confiant {
	enable_integrations?: string[];
	prebidExcludeBidders?: string[];
	prebidNameSpace?: string;
	callback?: (
		blockingType: any,
		blockingId: any,
		isBlocked: any,
		wrapperId: any,
		tagId: any,
		impressionData: any,
	) => void;
}
