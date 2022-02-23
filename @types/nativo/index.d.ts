interface NativoPostRelease {
	Start: (config?: NativoConfiguration) => void;
}

interface NativoConfiguration {
	ptd?: any[];
	infScrollReset?: boolean;
}

interface NativoSdk {
	cmd?: any[];
	Events?: any;
}
