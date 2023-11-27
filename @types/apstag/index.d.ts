interface Apstag {
	_Q: any[];
	init?: (...args: any[]) => unknown;
	rpa?: (...args: any[]) => void;
	fetchBids?: (...args: any[]) => unknown;
	targetingKeys?: () => string[];
	debug?: (cmd: 'enable' | 'disable') => void;
	renderImp?: (...args: any[]) => void;
}
