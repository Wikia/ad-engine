import { AdSlot, TEMPLATE, UapParams } from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { isUndefined } from 'util';

@Injectable({ autobind: false })
export class UapDomReader {
	constructor(
		@Inject(TEMPLATE.PARAMS) private params: UapParams,
		@Inject(TEMPLATE.SLOT) private adSlot: AdSlot,
	) {}

	getDynamicImpactAdHeight(): number {
		const minHeight = this.getResolvedAdHeight();
		const maxHeight = this.getImpactAdHeight();
		const offset = window.scrollY || window.pageYOffset || 0;
		const height = maxHeight - offset;

		return height < minHeight ? minHeight : height;
	}

	getImpactAdHeight(): number {
		if (isUndefined(this.params?.config?.aspectRatio?.default)) {
			return this.adSlot.element.offsetHeight;
		}

		return this.calculateAdHeight(this.params.config.aspectRatio.default);
	}

	getResolvedAdHeight(): number {
		if (isUndefined(this.params?.config?.aspectRatio?.resolved)) {
			return this.adSlot.element.offsetHeight;
		}

		return this.calculateAdHeight(this.params.config.aspectRatio.resolved);
	}

	private calculateAdHeight(ratio: number): number {
		return (1 / ratio) * this.adSlot.element.offsetWidth;
	}
}
