// @ts-strict-ignore
import { DomManipulator } from './dom-manipulator';
import { DomReader } from './dom-reader';
import { AD_ENGINE_UAP_DOM_CHANGED } from "../../../../../../communication/events/events-ad-engine-uap";
import { UapParams } from "../../../utils/universal-ad-package";
import { communicationServiceSlim } from "../../../utils/communication-service-slim";
import SlotPlaceholderRetriever from "../../../utils/slot-placeholder-retriever";

export class DomManager {
    private slot: HTMLElement | null;
    constructor(
        private params: UapParams,
        // private page: HTMLElement,
        private manipulator: DomManipulator,
        private reader: DomReader,
    ) {
        this.slot = (new SlotPlaceholderRetriever(this.params)).get();
    }

    // addClassToPage(className: string): void {
    //     this.manipulator.element(this.page).addClass(className);
    // }

    // setPageOffsetImpact(): void {
    //     this.setPageOffset(this.reader.getPageOffsetImpact());
    // }

    // private setPageOffset(value: number): void {
    //     this.manipulator.element(this.page).setProperty('marginTop', `${value}px`);
    // }

    // setSlotOffsetResolvedToNone(): void {
    //     this.setSlotOffset(this.reader.getSlotOffsetResolvedToNone());
    // }

    // private setSlotOffset(value: number): void {
    //     this.manipulator.element(this.slot).setProperty('top', `${value}px`);
    // }

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
        this.manipulator.element(this.slot).setProperty('height', height);
    }

    setSlotHeightClipping(): void {
        this.manipulator
            .element(this.slot)
            .setProperty('clip', this.reader.getSlotHeightClipping());
    }

    setPlaceholderHeightResolved(): void {
        this.setPlaceholderHeight(`${this.reader.getSlotHeightResolved()}px`);
    }

    setPlaceholderHeightImpact(): void {
        this.setPlaceholderHeight(`${this.reader.getSlotHeightImpact()}px`);
    }

    private setPlaceholderHeight(height: string): void {
        let placeholder = this.slot.parentElement;

        if (placeholder.classList.contains('ad-slot-placeholder')) {
            placeholder = placeholder.parentElement;
        }

        this.manipulator.element(placeholder).setProperty('height', height);
        communicationServiceSlim.emit(AD_ENGINE_UAP_DOM_CHANGED, {
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
