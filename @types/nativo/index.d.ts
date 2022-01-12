interface NativoPostRelease {
	Start: (config?: NativoConfiguration) => void;
}

interface NativoConfiguration {
	ptd?: any[];
	infScrollReset?: boolean;
}

interface NativoQueue {
	cmd?: any[];
	Events?: any;
}
