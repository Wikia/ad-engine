interface WindowUSP {
	(command: string, param?: unknown, cb?: (signalData: SignalData, flag?: boolean) => void);
	receiveMessage?: (event) => void;
}

interface SignalData {
	version?: number;
	uspString?: string;
}
