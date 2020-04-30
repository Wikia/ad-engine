import { TEMPLATE, UapParams } from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { UapDomReader } from './uap-dom-reader';

export interface UapVideoSize {
	width: number;
	height: number;
	margin: number;
}

@Injectable({ autobind: false })
export class VideoDomReader {
	constructor(@Inject(TEMPLATE.PARAMS) private params: UapParams, private reader: UapDomReader) {}

	getVideoSizeImpact(): UapVideoSize {
		return this.calculateVideoSize(
			this.reader.getSlotHeightImpact(),
			this.getVideoMultiplierImpact(),
		);
	}

	getVideoSizeResolved(): UapVideoSize {
		return this.calculateVideoSize(
			this.reader.getSlotHeightResolved(),
			this.getVideoMultiplierResolved(),
		);
	}

	getVideoSizeImpactToResolved(): UapVideoSize {
		return this.calculateVideoSize(
			this.reader.getSlotHeightImpactToResolved(),
			this.getVideoMultiplierImpactToResolved(),
		);
	}

	private calculateVideoSize(slotHeight: number, videoMultiplier: number): UapVideoSize {
		const margin = (100 - videoMultiplier) / 2;
		const height = (slotHeight * videoMultiplier) / 100;
		const width = height * this.params.videoAspectRatio;

		return { margin, height, width };
	}

	private getVideoMultiplierImpactToResolved(): number {
		return (
			this.getVideoMultiplierImpact() +
			this.reader.getProgressImpactToResolved() *
				(this.getVideoMultiplierResolved() - this.getVideoMultiplierImpact())
		);
	}

	private getVideoMultiplierImpact(): number {
		return this.params.config.state.height.default;
	}

	private getVideoMultiplierResolved(): number {
		return this.params.config.state.height.resolved;
	}
}
