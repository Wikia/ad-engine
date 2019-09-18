import { resolvedState } from './resolved-state';
import { UapParams } from './universal-ad-package';

export class UapVideoSettings {
	private readonly resolvedState: boolean;
	private readonly autoPlay: boolean;
	private readonly splitLayout: string;

	constructor(private params: UapParams) {
		this.resolvedState = resolvedState.isResolvedState(this.params);
		this.autoPlay = this.detectAutoPlay();
		this.splitLayout = params.splitLayoutVideoPosition;
	}

	detectAutoPlay(): boolean {
		const defaultStateAutoPlay = this.params.autoPlay && !this.resolvedState;
		const resolvedStateAutoPlay = this.params.resolvedStateAutoPlay && this.resolvedState;

		return Boolean(defaultStateAutoPlay || resolvedStateAutoPlay);
	}

	getParams(): UapParams {
		return { ...this.params };
	}

	updateParams(params: UapParams): void {
		Object.assign(this.params, params);
	}

	isAutoPlay(): boolean {
		return this.autoPlay;
	}

	isResolvedState(): boolean {
		return this.resolvedState;
	}

	isSplitLayout(): string {
		return this.splitLayout;
	}
}
