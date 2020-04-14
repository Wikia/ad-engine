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

	setBodyOffsetBig(): void {
		this.setBodyOffset(this.reader.getBodyOffsetBig());
	}

	setBodyOffsetSmall(): void {
		this.setBodyOffset(this.reader.getBodyOffsetSmall());
	}

	private setBodyOffset(value: number): void {
		this.manipulator.element(document.body).setProperty('paddingTop', `${value}px`);
	}

	setNavbarOffsetBigToSmall(): void {
		this.setNavbarOffset(this.reader.getNavbarOffsetBigToSmall());
	}

	setNavbarOffsetSmallToNone(): void {
		this.setNavbarOffset(this.reader.getNavbarOffsetSmallToNone());
	}

	setNavbarOffsetSmall(): void {
		this.setNavbarOffset(this.reader.getNavbarOffsetSmall());
	}

	private setNavbarOffset(value: number): void {
		this.manipulator.element(this.navbar).setProperty('top', `${value}px`);
	}

	setSlotOffsetSmallToNone(): void {
		this.setSlotOffset(this.reader.getSlotOffsetSmallToNone());
	}

	private setSlotOffset(value: number): void {
		this.manipulator.element(this.adSlot.getElement()).setProperty('top', `${value}px`);
	}

	setSlotHeightBigToSmall(): void {
		this.setSlotHeight(`${this.reader.getSlotHeightBigToSmall()}px`);
	}

	setSlotHeightSmall(): void {
		this.setSlotHeight(`${this.reader.getSlotHeightSmall()}px`);
	}

	setSlotHeightBig(): void {
		this.setSlotHeight(`${this.reader.getSlotHeightBig()}px`);
	}

	private setSlotHeight(height: string): void {
		this.manipulator.element(this.adSlot.getElement()).setProperty('height', height);
	}

	setSmallImage(): void {
		if (this.params.image2 && this.params.image2.background) {
			this.manipulator.element(this.params.image2.element).removeClass('hidden-state');
		} else if (this.params.image1) {
			this.manipulator.element(this.params.image1.element).removeClass('hidden-state');
		}
	}

	setBigImage(): void {
		this.manipulator.element(this.params.image1.element).removeClass('hidden-state');
	}
}
