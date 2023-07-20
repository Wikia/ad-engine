export interface OpenWebPlacementSearch {
	isPlacementFound: () => boolean;
	getPlacement: () => Element | null;
	init: () => void;
}

export abstract class OpenWebPlacementSearchHandler implements OpenWebPlacementSearch {
	protected anchor: Element | null;

	constructor() {
		this.init();
	}

	abstract init(): void;

	public isPlacementFound(): boolean {
		return this.anchor !== null;
	}

	public getPlacement(): Element | null {
		return this.anchor;
	}
}
