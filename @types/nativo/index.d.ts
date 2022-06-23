interface NativoPostRelease {
	Start: (config?: NativoConfiguration) => void;
}

interface NativoConfiguration {
	ptd?: number[];
	infScrollReset?: boolean;
}

interface NativoResponseEvent {
	adLocation: string;
	id: number;
	placement: number;
}

interface NativoCompleteEvent {
	data: NativoResponseEvent;
}

interface NativoNoAdEvent {
	data: Pick<NativoResponseEvent, 'id', 'adLocation'>[];
}

interface NativoApi {
	cmd?: unknown[];
	Events?: {
		PubSub: {
			subscribe(status?: string, fn: (e: NativoNoAdEvent | NativoCompleteEvent) => void): void;
		};
	};
}
