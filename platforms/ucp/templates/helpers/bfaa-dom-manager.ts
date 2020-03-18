import { AdSlot, DomManipulator, UapParams } from '@wikia/ad-engine';
import { BfaaDomReader } from './bfaa-dom-reader';

export class BfaaDomManager extends BfaaDomReader {
	constructor(
		private manipulator: DomManipulator,
		params: UapParams,
		private adSlot: AdSlot,
		private navbar: HTMLElement,
	) {
		super(params);
	}

	setDynamicImpactAdHeight(): void {
		this.setAdHeight(`${this.getDynamicImpactAdHeight()}px`);
	}

	setResolvedAdHeight(): void {
		this.setAdHeight(`${this.getResolvedAdHeight()}px`);
	}

	setResolvedBodyPadding(): void {
		const adHeight = this.getResolvedAdHeight();
		const adAndNavHeight = adHeight + this.navbar.offsetHeight;

		this.manipulator.element(document.body).setProperty('paddingTop', `${adAndNavHeight}px`);
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
}
