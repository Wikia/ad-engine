interface WindowCMP {
	(command: string, param?: any, cb?: (consentData: any) => void);
	receiveMessage: (event) => void;
}
