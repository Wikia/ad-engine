interface CLRM {
	gpt?: {
		propertyId: string;
		confiantCdn: string;
		sandbox: number;
		mapping: any;
		activation: any;
		callback: (...args: any[]) => void;
	};
}
