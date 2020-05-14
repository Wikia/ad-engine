import { TEMPLATE, UapParams, UapState } from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { UapDomReader } from './uap-dom-reader';

export interface UapVideoSize {
	width: number;
	height: number;
	top?: number;
	right?: number;
	bottom?: number;
}

@Injectable({ autobind: false })
export class VideoDomReader {
	constructor(@Inject(TEMPLATE.PARAMS) private params: UapParams, private reader: UapDomReader) {}

	getVideoSizeImpact(): UapVideoSize {
		return this.calculateVideoSize(this.reader.getSlotHeightImpact(), 0);
	}

	getVideoSizeResolved(): UapVideoSize {
		return this.calculateVideoSize(this.reader.getSlotHeightResolved(), 1);
	}

	getVideoSizeImpactToResolved(): UapVideoSize {
		return this.calculateVideoSize(
			this.reader.getSlotHeightImpactToResolved(),
			this.reader.getProgressImpactToResolved(),
		);
	}

	private calculateVideoSize(slotHeight: number, progress: number): UapVideoSize {
		const { height, width } = this.getSize(slotHeight, progress);
		const top = this.getPercentage(progress, this.params.config.state.top);
		const right = this.getPercentage(progress, this.params.config.state.right);
		const bottom = this.getPercentage(progress, this.params.config.state.bottom);

		return {
			top,
			right,
			bottom,
			height: Math.ceil(height),
			width: Math.ceil(width),
		};
	}

	private getSize(slotHeight: number, progress: number): { height: number; width: number } {
		const percentage = this.getPercentage(progress, this.params.config.state.height);
		const height = slotHeight * (percentage / 100);
		const width = height * this.params.videoAspectRatio;

		return { height, width };
	}

	private getPercentage(progress: number, state?: UapState<number>): number | undefined {
		if (!state) {
			return;
		}

		const { default: impact, resolved } = state;

		return impact - (impact - resolved) * progress;
	}
}
