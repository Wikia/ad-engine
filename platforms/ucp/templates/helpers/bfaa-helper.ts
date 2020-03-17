import { AdSlot, DomManipulator, UapParams } from '@wikia/ad-engine';

export class BfaaHelper {
	constructor(
		private manipulator: DomManipulator,
		private params: UapParams,
		private adSlot: AdSlot,
		private navbar: HTMLElement,
	) {}

	setDynamicImpactAdHeight(): void {
		this.setAdHeight(`${this.getDynamicImpactAdHeight()}px`);
	}

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

	setResolvedAdHeight(): void {
		this.setAdHeight(`${this.getResolvedAdHeight()}px`);
	}

	setResolvedBodyPadding(): void {
		const adHeight = this.getResolvedAdHeight();
		const adAndNavHeight = adHeight + this.navbar.offsetHeight;

		this.manipulator.element(document.body).setProperty('paddingTop', `${adAndNavHeight}px`);
	}

	getResolvedAdHeight(): number {
		return this.calculateAdHeight(this.params.config.aspectRatio.resolved);
	}

	setAdFixedPosition(): void {
		this.manipulator
			.element(this.adSlot.getElement())
			.setProperty('position', 'fixed')
			.setProperty('top', '0');
	}

	setNavbarFixedPosition(): void {
		const adHeight = this.adSlot.getElement().offsetHeight;

		this.manipulator
			.element(this.navbar)
			.setProperty('position', 'fixed')
			.setProperty('top', `${adHeight}px`);
	}

	setResolvedImage(): void {
		if (this.params.image2 && this.params.image2.background) {
			this.manipulator.element(this.params.image2.element).removeClass('hidden-state');
		}
	}

	setImpactImage(): void {
		if (this.params.image2 && this.params.image2.background) {
			this.manipulator.element(this.params.image1.element).removeClass('hidden-state');
		}
	}

	private setAdHeight(height: string): void {
		this.manipulator.element(this.adSlot.getElement()).setProperty('height', height);
	}

	private calculateAdHeight(ratio: number): number {
		return (1 / ratio) * document.body.offsetWidth;
	}
}
