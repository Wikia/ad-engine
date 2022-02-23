interface NativoPostRelease {
	Start: (config?: NativoConfiguration) => void;
}

interface NativoConfiguration {
	ptd?: any[];
	infScrollReset?: boolean;
}

interface NativoCompleteEvent {
	data: { id: number; placement: number };
}

interface NativoNoAdEvent {
	data: { id: number }[];
}

interface NativoQueue {
	cmd?: any[];
	Events?: {
		PubSub: {
			subscribe(status?: string, fn: (e: NativoNoAdEvent | NativoCompleteEvent) => void): void;
		};
	};
}
