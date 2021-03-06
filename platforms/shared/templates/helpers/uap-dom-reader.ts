import { AdSlot, context, TEMPLATE, UapParams } from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { isUndefined } from 'util';
import { NAVBAR } from '../configs/uap-dom-elements';

@Injectable({ autobind: false })
export class UapDomReader {
	private adSlotInitialYPos;

	constructor(
		@Inject(TEMPLATE.PARAMS) private params: UapParams,
		@Inject(TEMPLATE.SLOT) private adSlot: AdSlot,
		@Inject(NAVBAR) private navbar: HTMLElement,
	) {}

	getAdSlotInitialYPos(): number {
		return this.adSlotInitialYPos ? this.adSlotInitialYPos : 0;
	}

	setAdSlotInitialYPos(): void {
		this.adSlotInitialYPos = window.scrollY + this.getAdSlotTopOffset();
	}

	private getAdSlotTopOffset(): number {
		const rect = this.adSlot.element.getBoundingClientRect();

		return rect.top;
	}

	getPageOffsetImpact(): number {
		return (
			this.getSlotHeightImpact() +
			(context.get('templates.ignoreNavbarHeight') ? 0 : this.navbar.offsetHeight)
		);
	}

	getPageOffsetResolved(): number {
		return (
			this.getSlotHeightResolved() +
			(context.get('templates.ignoreNavbarHeight') ? 0 : this.navbar.offsetHeight)
		);
	}

	getNavbarOffsetHeight(): number {
		return this.navbar.offsetHeight;
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

	getSlotOffsetResolvedToNone(): number {
		return this.getNavbarOffsetResolvedToNone() - this.getSlotHeightResolved();
	}

	getSlotHeightImpactToResolved(): number {
		const minHeight = this.getSlotHeightResolved();
		const maxHeight = this.getSlotHeightImpact();
		const progress = this.getProgressImpactToResolved();

		return maxHeight - (maxHeight - minHeight) * progress;
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

	getProgressStickyBigToStickySmall(): number {
		const minHeight = this.getSlotHeightResolved();
		const maxHeight = this.getSlotHeightImpact();
		const navbarHeight = this.getNavbarOffsetHeight();
		const adSlotTopOffset =
			this.adSlotInitialYPos + this.calculateSlotHeight(this.params.config.aspectRatio.default);
		const offset = (window.scrollY - (adSlotTopOffset + navbarHeight)) / (maxHeight - minHeight);

		return this.calculateProgress(offset);
	}

	private calculateProgress(offset: number): number {
		if (offset >= 1) {
			return 1;
		}

		if (offset <= 0) {
			return 0;
		}

		return offset;
	}

	private calculateSlotHeight(ratio: number): number {
		return (1 / ratio) * this.adSlot.element.offsetWidth;
	}
}
