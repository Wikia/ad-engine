import { AdSlot, context, TEMPLATE, UapParams } from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { isUndefined } from 'util';
import { NAVBAR } from '../configs/uap-dom-elements';

@Injectable({ autobind: false })
export class UapDomReader {
	constructor(
		@Inject(TEMPLATE.PARAMS) private params: UapParams,
		@Inject(TEMPLATE.SLOT) private adSlot: AdSlot,
		@Inject(NAVBAR) private navbar: HTMLElement,
	) {}

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

	getSlotHeightBigToSmall(adSlotPlaceholderTopOffset: number): number {
		const minHeight = this.getSlotHeightResolved();
		const maxHeight = this.getSlotHeightImpact();
		const progress = this.getProgressStickyBigToStickySmall(adSlotPlaceholderTopOffset);

		return maxHeight - (maxHeight - minHeight) * progress;
	}

	getProgressImpactToResolved(): number {
		const minHeight = this.getSlotHeightResolved();
		const maxHeight = this.getSlotHeightImpact();
		const offset = window.scrollY / (maxHeight - minHeight);

		return this.calculateProgress(offset);
	}

	getProgressStickyBigToStickySmall(adSlotPlaceholderTopOffset: number): number {
		const minHeight = this.getSlotHeightResolved();
		const maxHeight = this.getSlotHeightImpact();
		const navbarHeight = this.getNavbarOffsetHeight();
		const offset =
			(window.scrollY - (adSlotPlaceholderTopOffset + navbarHeight)) / (maxHeight - minHeight);

		return this.calculateProgress(offset);
	}

	/**
	 * Progress changes between 0 (impact, full height) to 1 (resolved size);
	 */
	calculateProgress(offset: number): number {
		if (offset >= 1) {
			return 1;
		}

		if (offset <= 0) {
			return 0;
		}

		return offset;
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
