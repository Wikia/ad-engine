interface NativoPostRelease {
	Start: (config?: NativoConfiguration) => void;
}

interface NativoConfiguration {
	ptd?: [];
	infScrollReset?: boolean;
}

interface NativoQueue {
	cmd?: any[];
}
