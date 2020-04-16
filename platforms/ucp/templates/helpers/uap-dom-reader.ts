import { AdSlot, NAVBAR, TEMPLATE, UapParams } from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { isUndefined } from 'util';

export interface UapVideoSize {
	width: number;
	height: number;
	margin: number;
}

@Injectable({ autobind: false })
export class UapDomReader {
	constructor(
		@Inject(TEMPLATE.PARAMS) private params: UapParams,
		@Inject(TEMPLATE.SLOT) private adSlot: AdSlot,
		@Inject(NAVBAR) private navbar: HTMLElement,
	) {}

	getBodyOffsetImpact(): number {
		return this.getSlotHeightImpact() + this.navbar.offsetHeight;
	}

	getBodyOffsetResolved(): number {
		return this.getSlotHeightResolved() + this.navbar.offsetHeight;
	}

	getNavbarOffsetImpactToResolved(): number {
		return this.getSlotHeightImpactToResolved();
	}

	getNavbarOffsetResolvedToNone(): number {
		const distance = this.getNavbarOffsetResolved() - window.scrollY;

		return distance <= 0 ? 0 : distance;
	}

	getNavbarOffsetResolved(): number {
		return this.getSlotHeightResolved();
	}

	getVideoSizeImpact(): UapVideoSize {
		return this.calculateVideoSize(this.getSlotHeightImpact(), this.getVideoMultiplierImpact());
	}

	getVideoSizeResolved(): UapVideoSize {
		return this.calculateVideoSize(this.getSlotHeightResolved(), this.getVideoMultiplierResolved());
	}

	getVideoSizeImpactToResolved(): UapVideoSize {
		return this.calculateVideoSize(
			this.getSlotHeightImpactToResolved(),
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
			this.getProgressImpactToResolved() *
				(this.getVideoMultiplierResolved() - this.getVideoMultiplierImpact())
		);
	}

	private getVideoMultiplierImpact(): number {
		return this.params.config.state.height.default;
	}

	private getVideoMultiplierResolved(): number {
		return this.params.config.state.height.resolved;
	}

	getSlotOffsetResolvedToNone(): number {
		return this.getNavbarOffsetResolvedToNone() - this.getSlotHeightResolved();
	}

	getSlotHeightImpactToResolved(): number {
		const mixHeight = this.getSlotHeightResolved();
		const maxHeight = this.getSlotHeightImpact();
		const progress = this.getProgressImpactToResolved();

		return maxHeight - (maxHeight - mixHeight) * progress;
	}

	/**
	 * Progress changes between 0 (impact, full height) to 1 (resolved size);
	 */
	getProgressImpactToResolved(): number {
		const mixHeight = this.getSlotHeightResolved();
		const maxHeight = this.getSlotHeightImpact();
		const progress = window.scrollY / (maxHeight - mixHeight);

		return progress >= 1 ? 1 : progress;
	}

	getSlotHeightImpact(): number {
		if (isUndefined(this.params?.config?.aspectRatio?.default)) {
			return this.adSlot.element.offsetHeight;
		}

		return this.calculateSlotHeight(this.params.config.aspectRatio.default);
	}

	getSlotHeightResolved(): number {
		if (isUndefined(this.params?.config?.aspectRatio?.resolved)) {
			return this.adSlot.element.offsetHeight;
		}

		return this.calculateSlotHeight(this.params.config.aspectRatio.resolved);
	}

	private calculateSlotHeight(ratio: number): number {
		return (1 / ratio) * this.adSlot.element.offsetWidth;
	}
}
