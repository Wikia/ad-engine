import { AdSlot, NAVBAR, TEMPLATE, UapParams } from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { isUndefined } from 'util';

@Injectable({ autobind: false })
export class UapDomReader {
	constructor(
		@Inject(TEMPLATE.PARAMS) private params: UapParams,
		@Inject(TEMPLATE.SLOT) private adSlot: AdSlot,
		@Inject(NAVBAR) private navbar: HTMLElement,
	) {}

	getBodyOffsetSmall(): number {
		return this.getSlotHeightSmall() + this.navbar.offsetHeight;
	}

	getNavbarOffsetSmallToNone(): number {
		const distance = this.getSlotHeightSmall() - window.scrollY;

		return distance <= 0 ? 0 : distance;
	}

	getSlotOffsetSmallToNone(): number {
		return this.getNavbarOffsetSmallToNone() - this.getSlotHeightSmall();
	}

	getSlotHeightBigToSmall(): number {
		const minHeight = this.getSlotHeightSmall();
		const maxHeight = this.getSlotHeightBig();
		const offset = window.scrollY || window.pageYOffset || 0;
		const height = maxHeight - offset;

		return height < minHeight ? minHeight : height;
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
