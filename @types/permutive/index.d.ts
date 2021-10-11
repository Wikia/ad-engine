interface Permutive {
	addon: (prop: string, value: any) => void;
	track: (eventName: string, value: any, options: any) => void;
	q: any[];
}
