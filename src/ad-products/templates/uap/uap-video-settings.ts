import { resolvedState } from './resolved-state';
import { UapParams } from './universal-ad-package';

export class UapVideoSettings {
	private readonly resolvedState: boolean;
	private readonly autoPlay: boolean;

	constructor(private params: UapParams) {
		this.resolvedState = resolvedState.isResolvedState(this.params);
		this.autoPlay = this.detectAutoPlay();
	}

	detectAutoPlay(): boolean {
		const defaultStateAutoPlay = this.params.autoPlay && !this.resolvedState;
		const resolvedStateAutoPlay = this.params.autoPlay && this.resolvedState;

		return Boolean(defaultStateAutoPlay || resolvedStateAutoPlay);
	}

	getParams(): UapParams {
		return { ...this.params };
	}

	isAutoPlay(): boolean {
		return this.autoPlay;
	}
}
