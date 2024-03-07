import {
	AdSlot,
	communicationService,
	eventsRepository,
	TEMPLATE,
	UapParams,
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

	private setSlotHeight(height: string): void {
		this.manipulator.element(this.adSlot.getElement()).setProperty('height', height);
	}

	setSlotHeightClipping(): void {
		this.manipulator
			.element(this.adSlot.getElement())
			.setProperty('clip', this.reader.getSlotHeightClipping());
	}

	setPlaceholderHeightResolved(): void {
		if (this.adSlot.getSlotName() === 'top_leaderboard') {
			const iframe = this.adSlot.getIframe();

			if (!iframe) {
				this.setPlaceholderHeight(`${this.reader.getSlotHeightImpact()}px`);
			}

			const placeholderHeight = Number(iframe.height) > 90 ? '289px' : '129px';
			const el3: HTMLElement = document.getElementById('top-leaderboard');

			if (el3) {
				el3.setAttribute('style', `height: ${placeholderHeight}!important; clip: unset`);
				console.log('Resolved adjusting adjustPlaceholderSize el3', el3);
			}

			this.setPlaceholderHeight(placeholderHeight);
			return;
		}
		this.setPlaceholderHeight(`${this.reader.getSlotHeightResolved()}px`);
	}

	setPlaceholderHeightImpact(): void {
		if (this.adSlot.getSlotName() === 'top_leaderboard') {
			const iframe = this.adSlot.getIframe();

			if (!iframe) {
				alert('lolo');
				this.setPlaceholderHeight(`${this.reader.getSlotHeightImpact()}px`);
			}

			const placeholderHeight = Number(iframe.height) > 90 ? '289px' : '129px';

			const el3: HTMLElement = document.getElementById('top-leaderboard');

			if (el3) {
				el3.style.height = placeholderHeight;
				el3.setAttribute('style', `height: ${placeholderHeight}!important; clip: unset`);
				console.log('Impact adjusting adjustPlaceholderSize el3', el3);
			}

			this.setPlaceholderHeight(placeholderHeight);
			return;
		}
		this.setPlaceholderHeight(`${this.reader.getSlotHeightImpact()}px`);
	}

	private setPlaceholderHeight(height: string): void {
		let placeholder = this.adSlot.getElement().parentElement;
		console.log('adjusting setPlaceholderHeight', height);
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
