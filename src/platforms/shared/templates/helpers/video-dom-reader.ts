import { TEMPLATE, UapParams, UapState } from '@wikia/ad-engine';
import { inject, injectable } from 'tsyringe';
import { UapDomReader } from './uap-dom-reader';

export interface UapVideoSize {
	width: number;
	height: number;
	top?: number;
	right?: number;
	bottom?: number;
}

@injectable()
export class VideoDomReader {
	constructor(@inject(TEMPLATE.PARAMS) private params: UapParams, private reader: UapDomReader) {}

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
		if (!this.params.config) {
			return;
		}
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
		if (!this.params.config) {
			return;
		}
		const videoAspectRatio = 16 / 9;
		const percentage = this.getPercentage(progress, this.params.config.state.height);
		const height = slotHeight * (percentage / 100);
		const width = height * videoAspectRatio;

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
