interface NativoPostRelease {
	Start: (config?: NativoConfiguration) => void;
}

interface NativoConfiguration {
	ptd?: any[];
	infScrollReset?: boolean;
}

interface NativoResponseEvent {
	id: number;
	placement: number;
}

interface NativoCompleteEvent {
	data: NativoResponseEvent;
}

interface NativoNoAdEvent {
	data: Pick<NativoResponseEvent, 'id'>[];
}

interface NativoQueue {
	cmd?: any[];
	Events?: {
		PubSub: {
			subscribe(status?: string, fn: (e: NativoNoAdEvent | NativoCompleteEvent) => void): void;
		};
	};
}
