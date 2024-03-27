// @ts-strict-ignore
import {
	AdSlot,
	communicationService,
	context,
	eventsRepository,
	TEMPLATE,
	UapParams,
	universalAdPackage,
} from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { PAGE } from '../configs/uap-dom-elements';
import { DomManipulator } from './manipulators/dom-manipulator';
import { UapDomReader } from './uap-dom-reader';

@Injectable({ autobind: false })
export class UapDomManager {
	constructor(
		@Inject(TEMPLATE.PARAMS) private params: UapParams,
		@Inject(TEMPLATE.SLOT) private adSlot: AdSlot,
		@Inject(PAGE) private page: HTMLElement,
		private manipulator: DomManipulator,
		private reader: UapDomReader,
	) {}

	static PLACEHOLDER_HEIGHT_OVERHEAD = 39;

	addClassToPage(className: string): void {
		this.manipulator.element(this.page).addClass(className);
	}

	setPageOffsetImpact(): void {
		this.setPageOffset(this.reader.getPageOffsetImpact());
	}

	private setPageOffset(value: number): void {
		this.manipulator.element(this.page).setProperty('marginTop', `${value}px`);
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

	private addTransitionProperty() {
		const transition = `height 300ms ${universalAdPackage.CSS_TIMING_EASE_IN_CUBIC}`;

		const topAdsContainerElement: HTMLElement = document.querySelector('.top-ads-container');
		this.manipulator.element(this.adSlot.getElement()).setProperty('transition', transition);
		this.manipulator.element(topAdsContainerElement).setProperty('transition', transition);
	}

	private setSlotHeight(height: string): void {
		this.addTransitionProperty();
		this.manipulator.element(this.adSlot.getElement()).setProperty('height', height);
	}

	setSlotHeightClipping(): void {
		this.manipulator
			.element(this.adSlot.getElement())
			.setProperty('clip', this.reader.getSlotHeightClipping());
	}

	resizePlaceholderToIframe(height: number) {
		const slotRefresherConfig = context.get('slotConfig.slotRefresher.sizes') || {};

		if (this.adSlot.getSlotName() in slotRefresherConfig) {
			const iframe = this.adSlot.getIframe();
			const placeholderHeight = `${
				Number(iframe.height) + UapDomManager.PLACEHOLDER_HEIGHT_OVERHEAD
			}px`;

			this.setSlotHeight(placeholderHeight);
			this.setPlaceholderHeight(placeholderHeight);
		} else {
			this.setPlaceholderHeight(`${height}px`);
		}
	}

	setPlaceholderHeightResolved(): void {
		this.resizePlaceholderToIframe(this.reader.getSlotHeightResolved());
	}

	setPlaceholderHeightImpact(): void {
		this.resizePlaceholderToIframe(this.reader.getSlotHeightImpact());
	}

	private setPlaceholderHeight(height: string): void {
		let placeholder = this.adSlot.getElement().parentElement;

		if (placeholder.classList.contains('ad-slot-placeholder')) {
			placeholder = placeholder.parentElement;
		}

		this.manipulator.element(placeholder).setProperty('height', height);
		communicationService.emit(eventsRepository.AD_ENGINE_UAP_DOM_CHANGED, {
			element: 'placeholder',
			size: height,
		});
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
