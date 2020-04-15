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

	getBodyOffsetBig(): number {
		return this.getSlotHeightBig() + this.navbar.offsetHeight;
	}

	getBodyOffsetSmall(): number {
		return this.getSlotHeightSmall() + this.navbar.offsetHeight;
	}

	getNavbarOffsetBigToSmall(): number {
		return this.getSlotHeightBigToSmall();
	}

	getNavbarOffsetSmallToNone(): number {
		const distance = this.getNavbarOffsetSmall() - window.scrollY;

		return distance <= 0 ? 0 : distance;
	}

	getNavbarOffsetSmall(): number {
		return this.getSlotHeightSmall();
	}

	getVideoSizeImpact(): UapVideoSize {
		return this.calculateVideoSize(this.getSlotHeightBig(), this.getVideoMultiplierImpact());
	}

	getVideoSizeResolved(): UapVideoSize {
		return this.calculateVideoSize(this.getSlotHeightSmall(), this.getVideoMultiplierResolved());
	}

	getVideoSizeImpactToResolved(): UapVideoSize {
		return this.calculateVideoSize(
			this.getSlotHeightBigToSmall(),
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
			this.getProgressBigToSmall() *
				(this.getVideoMultiplierResolved() - this.getVideoMultiplierImpact())
		);
	}

	private getVideoMultiplierImpact(): number {
		return this.params.config.state.height.default;
	}

	private getVideoMultiplierResolved(): number {
		return this.params.config.state.height.resolved;
	}

	getSlotOffsetSmallToNone(): number {
		return this.getNavbarOffsetSmallToNone() - this.getSlotHeightSmall();
	}

	getSlotHeightBigToSmall(): number {
		const smallHeight = this.getSlotHeightSmall();
		const bigHeight = this.getSlotHeightBig();
		const progress = this.getProgressBigToSmall();

		return bigHeight - (bigHeight - smallHeight) * progress;
	}

	/**
	 * Progress changes between 0 (big, full height) to 1 (small size);
	 */
	private getProgressBigToSmall(): number {
		const smallHeight = this.getSlotHeightSmall();
		const bigHeight = this.getSlotHeightBig();
		const progress = window.scrollY / (bigHeight - smallHeight);

		return progress >= 1 ? 1 : progress;
	}

	getSlotHeightBig(): number {
		if (isUndefined(this.params?.config?.aspectRatio?.default)) {
			return this.adSlot.element.offsetHeight;
		}

		return this.calculateSlotHeight(this.params.config.aspectRatio.default);
	}

	getSlotHeightSmall(): number {
		if (isUndefined(this.params?.config?.aspectRatio?.resolved)) {
			return this.adSlot.element.offsetHeight;
		}

		return this.calculateSlotHeight(this.params.config.aspectRatio.resolved);
	}

	private calculateSlotHeight(ratio: number): number {
		return (1 / ratio) * this.adSlot.element.offsetWidth;
	}
}
