import { AdSlot, TEMPLATE, UapParams } from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { DomManipulator } from './manipulators/dom-manipulator';

@Injectable()
export class BfabDomManager {
	constructor(
		@Inject(TEMPLATE.PARAMS) private params: UapParams,
		@Inject(TEMPLATE.SLOT) private adSlot: AdSlot,
		private manipulator: DomManipulator,
	) {}

	setResolvedImage(): void {
		if (this.params.image2 && this.params.image2.background) {
			this.manipulator.element(this.params.image2.element).removeClass('hidden-state');
		}
	}

	setImpactImage(): void {
		this.manipulator.element(this.params.image1.element).removeClass('hidden-state');
	}

	setResolvedAdHeight(): void {
		this.setAdHeight(`${this.getResolvedAdHeight()}px`);
	}

	setImpactAdHeight(): void {
		this.setAdHeight(`${this.getImpactAdHeight()}px`);
	}

	setAdHeight(height: string): void {
		this.manipulator.element(this.adSlot.getElement()).setProperty('height', height);
	}

	getResolvedAdHeight(): number {
		return (1 / this.params.config.aspectRatio.resolved) * this.adSlot.element.offsetWidth;
	}

	getImpactAdHeight(): number {
		return (1 / this.params.config.aspectRatio.default) * this.adSlot.element.offsetWidth;
	}
}
