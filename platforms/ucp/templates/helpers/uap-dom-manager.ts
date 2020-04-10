import { AdSlot, NAVBAR, TEMPLATE, UapParams } from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { DomManipulator } from './manipulators/dom-manipulator';
import { UapDomReader } from './uap-dom-reader';

@Injectable({ autobind: false })
export class UapDomManager {
	constructor(
		@Inject(TEMPLATE.PARAMS) private params: UapParams,
		@Inject(TEMPLATE.SLOT) private adSlot: AdSlot,
		@Inject(NAVBAR) private navbar: HTMLElement,
		private manipulator: DomManipulator,
		private reader: UapDomReader,
	) {}

	setDynamicImpactAdHeight(): void {
		this.setAdHeight(`${this.reader.getDynamicImpactAdHeight()}px`);
	}

	setResolvedAdHeight(): void {
		this.setAdHeight(`${this.reader.getResolvedAdHeight()}px`);
	}

	setImpactAdHeight(): void {
		this.setAdHeight(`${this.reader.getImpactAdHeight()}px`);
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
		} else if (this.params.image1) {
			this.manipulator.element(this.params.image1.element).removeClass('hidden-state');
		}
	}

	setImpactImage(): void {
		this.manipulator.element(this.params.image1.element).removeClass('hidden-state');
	}

	private setAdHeight(height: string): void {
		this.manipulator.element(this.adSlot.getElement()).setProperty('height', height);
	}
}
