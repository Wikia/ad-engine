interface WindowCMP {
	(command: string, param?: unknown, cb?: (consentData: ConsentData, flag?: boolean) => void);
	receiveMessage?: (event) => void;
}

interface ConsentData {
	gdprApplies?: boolean;
	consentData?: string;
	hasGlobalScope?: boolean;
	metadata?: string;
	purposeConsents?: { [key: string]: boolean };
	vendorConsents?: { [key: string]: boolean };
	cmpId?: number;
	cmpVersion?: number;
	consentLanguage?: string;
	consentScreen?: number;
	cookieVersion?: number;
	created?: string;
	globalVendorListVersion?: unknown;
	lastUpdated?: string;
	maxVendorId?: number;
	publisherVendorsVersion?: unknown;
	vendorListVersion?: number;
}
