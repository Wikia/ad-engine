interface WindowTCF {
	(
		command: string,
		version: number,
		cb?: (tcData: TCData, success?: boolean) => void,
		param?: unknown,
	);
	receiveMessage?: (event) => void;
}

interface TCData {
	tcString: string;
	tcfPolicyVersion: number;
	cmpId: number;
	cmpVersion: number;
	gdprApplies: boolean | undefined;
	eventStatus: string;
	cmpStatus: string;
	listenerId: number | undefined;
	isServiceSpecific: boolean;
	useNonStandardStacks: boolean;
	publisherCC: string;
	purposeOneTreatment: boolean;
	outOfBand: {
		allowedVendors: { [key: string]: boolean };
		disclosedVendors: { [key: string]: boolean };
	};
	purpose: {
		consents: { [key: string]: boolean };
		legitimateInterests: { [key: string]: boolean };
	};
	vendor: {
		consents: { [key: string]: boolean };
		legitimateInterests: { [key: string]: boolean };
	};
	specialFeatureOptins: { [key: string]: boolean };
	publisher: {
		consents: { [key: string]: boolean };
		legitimateInterests: { [key: string]: boolean };
		customPurpose: {
			consents: { [key: string]: boolean };
			legitimateInterests: { [key: string]: boolean };
		};
		restrictions: { [key: string]: { [key: string]: boolean } };
	};
}
