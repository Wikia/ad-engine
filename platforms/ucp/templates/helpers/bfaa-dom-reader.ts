import { UapParams } from '@wikia/ad-engine';

export class BfaaDomReader {
	constructor(protected params: UapParams) {}

	getDynamicImpactAdHeight(): number {
		const minHeight = this.getResolvedAdHeight();
		const maxHeight = this.getImpactAdHeight();
		const offset = window.scrollY || window.pageYOffset || 0;
		const height = maxHeight - offset;

		return height < minHeight ? minHeight : height;
	}

	getImpactAdHeight(): number {
		return this.calculateAdHeight(this.params.config.aspectRatio.default);
	}

	getResolvedAdHeight(): number {
		return this.calculateAdHeight(this.params.config.aspectRatio.resolved);
	}

	private calculateAdHeight(ratio: number): number {
		return (1 / ratio) * document.body.offsetWidth;
	}
}
