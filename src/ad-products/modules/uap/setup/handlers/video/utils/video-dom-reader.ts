// @ts-strict-ignore
import { DomReader } from "../../manipulators/dom-reader";
import { UapParams, UapState } from "../../../../utils/universal-ad-package";

export interface UapVideoSize {
	width: number;
	height: number;
	top?: number;
	right?: number;
	bottom?: number;
}

export class VideoDomReader {
	constructor(
		private params: UapParams,
		private reader: DomReader
	) {}

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
