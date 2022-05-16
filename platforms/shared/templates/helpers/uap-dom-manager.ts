import { AdSlot, TEMPLATE, UapParams } from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { NAVBAR, PAGE } from '../configs/uap-dom-elements';
import { DomManipulator } from './manipulators/dom-manipulator';
import { UapDomReader } from './uap-dom-reader';

@Injectable({ autobind: false })
export class UapDomManager {
	constructor(
		@Inject(TEMPLATE.PARAMS) private params: UapParams,
		@Inject(TEMPLATE.SLOT) private adSlot: AdSlot,
		@Inject(NAVBAR) private navbar: HTMLElement,
		@Inject(PAGE) private page: HTMLElement,
		private manipulator: DomManipulator,
		private reader: UapDomReader,
	) {}

	addClassToPage(className: string): void {
		this.manipulator.element(this.page).addClass(className);
	}

	setPageOffsetImpact(): void {
		this.setPageOffset(this.reader.getPageOffsetImpact());
	}

	setPageOffsetResolved(): void {
		this.setPageOffset(this.reader.getPageOffsetResolved());
	}

	private setPageOffset(value: number): void {
		this.manipulator.element(this.page).setProperty('marginTop', `${value}px`);
	}

	setNavbarOffsetImpactToResolved(): void {
		this.setNavbarOffset(this.reader.getNavbarOffsetImpactToResolved());
	}

	setNavbarOffsetResolvedToNone(): void {
		this.setNavbarOffset(this.reader.getNavbarOffsetResolvedToNone());
	}

	setNavbarOffsetResolved(): void {
		this.setNavbarOffset(this.reader.getNavbarOffsetResolved());
	}

	private setNavbarOffset(value: number): void {
		this.manipulator.element(this.navbar).setProperty('top', `${value}px`);
	}

	setSlotOffsetResolvedToNone(): void {
		this.setSlotOffset(this.reader.getSlotOffsetResolvedToNone());
	}

	private setSlotOffset(value: number): void {
		this.manipulator.element(this.adSlot.getElement()).setProperty('top', `${value}px`);
	}

	setSlotHeightImpactToResolved(): void {
		this.setSlotHeight(`${this.reader.getSlotHeightImpactToResolved()}px`);
	}

	setSlotHeightResolved(): void {
		this.setSlotHeight(`${this.reader.getSlotHeightResolved()}px`);
	}

	setSlotHeightImpact(): void {
		this.setSlotHeight(`${this.reader.getSlotHeightImpact()}px`);
	}

	private setSlotHeight(height: string): void {
		this.manipulator.element(this.adSlot.getElement()).setProperty('height', height);
	}

	setSlotHeightClipping(): void {
		this.manipulator
			.element(this.adSlot.getElement())
			.setProperty('clip', this.reader.getSlotHeightClipping());
	}

	setPlaceholderHeightResolved(): void {
		this.setPlaceholderHeight(`${this.reader.getSlotHeightResolved()}px`);
	}

	setPlaceholderHeightImpact(): void {
		this.setPlaceholderHeight(`${this.reader.getSlotHeightImpact()}px`);
	}

	private setPlaceholderHeight(height: string): void {
		let placeholder = this.adSlot.getElement().parentElement;

		if (placeholder.classList.contains('ad-slot-placeholder')) {
			placeholder = placeholder.parentElement;
		}

		this.manipulator.element(placeholder).setProperty('height', height);
	}

	setResolvedImage(): void {
		if (this.params.image2 && this.params.image2.background) {
			this.manipulator.element(this.params.image1.element).addClass('hidden-state');
			this.manipulator.element(this.params.image2.element).removeClass('hidden-state');
		} else if (this.params.image1) {
			this.manipulator.element(this.params.image1.element).removeClass('hidden-state');
		}
	}

	setImpactImage(): void {
		if (this.params.image1) {
			this.manipulator.element(this.params.image1.element).removeClass('hidden-state');
		}
	}
}
