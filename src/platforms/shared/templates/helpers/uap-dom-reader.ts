// @ts-strict-ignore
import { AdSlot, context, TEMPLATE, UapParams } from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
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
		if (this.params?.config?.aspectRatio?.default === undefined) {
			return this.adSlot.getElement().offsetHeight;
		}

		return this.calculateSlotHeight(this.params.config.aspectRatio.default);
	}

	getSlotHeightResolved(): number {
		if (this.params?.config?.aspectRatio?.resolved === undefined) {
			return this.adSlot.getElement().offsetHeight;
		}

		return this.calculateSlotHeight(this.params.config.aspectRatio.resolved);
	}

	private calculateSlotHeight(ratio: number): number {
		return (1 / ratio) * this.adSlot.getElement().offsetWidth;
	}

	getSlotHeightClipping(): string {
		const scroll = window.scrollY;

		if (!scroll || scroll <= 0) {
			return 'unset';
		}

		if (scroll >= this.adSlot.getElement().offsetHeight) {
			return 'rect(0, 0, 0, 0)';
		}

		return `rect(0 ${this.adSlot.getElement().offsetWidth}px ${
			this.adSlot.getElement().offsetHeight - scroll
		}px 0)`;
	}
}
