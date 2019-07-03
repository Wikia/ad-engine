type ConfiantBlockingType =
	| 1 // manual // Deprecated
	| 2 // creative // Creative-based detection
	| 3 // provider_security // Domain-based detection for unsafe domains
	| 4 // banned_domain // Domain-based detection for banned domains
	| 5 // provider_ibv // Domain-based detection for in-banner-video
	| 6 // unsafejs // Javascript-based detection for unsafe ads
	| 7; // hrap // Domain-based detection for high risk ad platform domains

interface ConfiantImpressionData {
	prebid: any;
	dfp: {
		s: string; // DFP slot element ID
		ad: string; // DFP Advertiser ID
		c: string; // DFP Creative ID
		l: string; // DFP Line Item ID
		o: string; // DFP Order ID
		A: string; // DFP Ad unit name
		y: string; // DFP Yield group ID (Exchange Bidder)
		co: string; // DFP Company ID (Exchange Bidder)
	};
}

interface Confiant {
	enable_integrations?: string[];
	prebidExcludeBidders?: string[];
	prebidNameSpace?: string;
	callback?: (
		blockingType: ConfiantBlockingType,
		blockingId: string,
		isBlocked: boolean,
		wrapperId: string,
		tagId: string,
		impressionData: ConfiantImpressionData,
	) => void;
}
