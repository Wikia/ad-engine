import { resolvedState } from './resolved-state';

export class VideoSettings {
	constructor(params) {
		this.params = params;

		Object.defineProperty(this, 'resolvedState', {
			value: resolvedState.isResolvedState(this.params),
			writable: false,
		});

		Object.defineProperty(this, 'autoPlay', {
			value: this.detectAutoPlay(),
			writable: false,
		});

		Object.defineProperty(this, 'splitLayout', {
			value: Boolean(params.splitLayoutVideoPosition),
			writable: false,
		});
	}

	detectAutoPlay() {
		const defaultStateAutoPlay = this.params.autoPlay && !this.resolvedState;
		const resolvedStateAutoPlay = this.params.resolvedStateAutoPlay && this.resolvedState;

		return Boolean(defaultStateAutoPlay || resolvedStateAutoPlay);
	}

	getParams() {
		return Object.assign({}, this.params);
	}

	updateParams(params) {
		Object.assign(this.params, params);
	}

	isAutoPlay() {
		return this.autoPlay;
	}

	isResolvedState() {
		return this.resolvedState;
	}

	isSplitLayout() {
		return this.splitLayout;
	}
}
