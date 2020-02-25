import { AdSlot, DomManipulator, UapParams } from '@wikia/ad-engine';
import { calculateAdHeight } from './calculate-ad-height';

export class BfaaHelper {
	constructor(
		private manipulator: DomManipulator,
		private params: UapParams,
		private adSlot: AdSlot,
		private navbar: HTMLElement,
	) {}

	setImpactAdHeight(): void {
		this.setAdHeight(`${this.getImpactAdHeight()}px`);
	}

	getImpactMaxAdHeight(): number {
		return calculateAdHeight(this.params.config.aspectRatio.default);
	}

	getImpactAdHeight(): number {
		const minHeight = this.getResolvedAdHeight();
		const maxHeight = this.getImpactMaxAdHeight();
		const offset = window.scrollY || window.pageYOffset || 0;
		const height = maxHeight - offset;

		return height < minHeight ? minHeight : height;
	}

	setResolvedAdHeight(): void {
		this.setAdHeight(`${this.getResolvedAdHeight()}px`);
	}

	getResolvedAdHeight(): number {
		return calculateAdHeight(this.params.config.aspectRatio.resolved);
	}

	setAdHeight(height: string): void {
		this.manipulator.element(this.adSlot.getElement()).setProperty('height', height);
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

	setBodyPadding(): void {
		const adHeight = this.adSlot.getElement().offsetHeight;
		const aAdAndNavHeight = adHeight + this.navbar.offsetHeight;

		this.manipulator.element(document.body).setProperty('paddingTop', `${aAdAndNavHeight}px`);
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

	/**
	 * corrects scroll position based a on scrollY value
	 */
	useScrollCorrection(): () => void {
		const startValue = window.scrollY;

		return () => window.scrollBy(0, startValue - window.scrollY);
	}

	/**
	 * corrects scroll position based on a distance from the element of reference
	 */
	usePositionCorrection(elementOfReference: HTMLElement): () => void {
		const startValue = elementOfReference.getBoundingClientRect().top;

		return () => window.scrollBy(0, elementOfReference.getBoundingClientRect().top - startValue);
	}
}
